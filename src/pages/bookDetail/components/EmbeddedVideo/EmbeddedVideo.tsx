import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Snapshot } from "@/models/snapshot.interfaces";
import { useNavigate, useParams } from "react-router-dom";
import { getLibraryItem } from "@/services/libraryService";
import { calculatePage } from "@/utils/stringUtils";
import { LibraryItem, SnapshotInfo } from "@/models/libraryItem.interface";
import { socket } from "@/messaging/socket";
import { useCookies } from "react-cookie";
import { getUser } from "@/services/userService";
import { User } from "@/models/user";

declare const YT: any;
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface ExposedFunctions {
  playVideo: () => void;
  pauseVideo: () => void;
}

interface EmbeddedVideoProps {
  onHighlightedSubtitleIndexChange?: (index: number | null) => void;
  sentencesPerPage: number;
  handlePageChange: (
    page: number,
    pageSize: number,
    changeTriggeredByHighlightChange?: boolean,
    changeTriggeredFromVideo?: boolean,
    changeTriggeredFromVideoFetch?: boolean
  ) => void;
  snapshots: Snapshot[] | null | undefined;
  shouldSetVideo: boolean;
  setShouldSetVideo: (shouldSetVideo: boolean) => void;
  firstIndexAfterReset: number | null;
  setLoadingFromFetch: (loadingFromFetch: boolean) => void;
  onPlay?: () => void;
  onPause?: () => void;
}

const EmbeddedVideo = React.forwardRef<ExposedFunctions, EmbeddedVideoProps>(
  (props, ref) => {
    const {
      onHighlightedSubtitleIndexChange,
      sentencesPerPage,
      handlePageChange,
      snapshots,
      shouldSetVideo,
      setShouldSetVideo,
      firstIndexAfterReset,
      setLoadingFromFetch,
    } = props;

    const { libraryId } = useParams();
    const playerDivRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<any>(null);
    const currentPageToUseRef = useRef<number | null>(null);
    const sentencesPerPageRef = useRef(sentencesPerPage);
    const snapshotsRef = useRef<Snapshot[] | null | undefined>(null);
    const [isInitRender, setIsInitRender] = useState(true);
    const startIndexRef = useRef<number | null>(null);
    const endIndexRef = useRef<number | null>(null);
    const intervalId = React.useRef<NodeJS.Timeout>();
    const [hasVideoPaused, setHasVideoPaused] = useState(true);
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const hasSeekHappenedRef = useRef(false);
    const isMounted = useRef(true); // Set to true initially

    const [cookies] = useCookies(["access_token"]);
    let timeoutId: number | null = null;

    const [currentLibrary, setCurrentLibrary] = useState<LibraryItem | null>();
    const [currentUser, setCurrentUser] = useState<User | null>();
    const [isVideoPaused, setIsVideoPaused] = useState(false);
    const navigate = useNavigate();
    function closeView() {
      navigate("/library");
    }

    useEffect(() => {
      // When the component unmounts, set isMounted to false
      return () => {
        isMounted.current = false;
      };
    }, []);

    useImperativeHandle(ref, () => ({
      playVideo: () => {
        if (playerRef.current && playerRef.current.playVideo) {
          playerRef.current.playVideo();
          props.onPlay && props.onPlay();
        }
      },
      pauseVideo: () => {
        if (playerRef.current && playerRef.current.pauseVideo) {
          playerRef.current.pauseVideo();
          props.onPause && props.onPause();
        }
      },
    }));

    useEffect(() => {
      window.history.replaceState(
        "fake-route",
        document.title,
        window.location.href
      );

      addEventListener("popstate", closeView);

      // Cleanup when this component unmounts
      return () => {
        removeEventListener("popstate", closeView);
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        if (intervalId.current) {
          clearInterval(intervalId.current);
          intervalId.current = undefined;
        }
        // Add these lines to clean up the player events
        if (playerRef.current) {
          playerRef.current.stopVideo();
          playerRef.current.destroy();
        }
      };
    }, []);

    useEffect(() => {
      if (snapshots) {
        snapshotsRef.current = snapshots;
      }
      if (
        playerRef.current! &&
        playerRef.current.seekTo &&
        shouldSetVideo === false &&
        !isVideoPaused
      ) {
        const currentTime = playerRef.current.getCurrentTime();
        const newHighlightedIndex =
          currentTime < snapshotsRef.current![0].sentencesData[0].start!
            ? 0
            : snapshotsRef.current![0].sentencesData.findIndex((sentence) => {
                return (
                  currentTime >= sentence.start! &&
                  currentTime < sentence.start! + sentence.duration! - 0.1
                );
              });
        onHighlightedSubtitleIndexChange?.(newHighlightedIndex);
        if (newHighlightedIndex) {
          const newPage = calculatePage(
            newHighlightedIndex!,
            sentencesPerPageRef.current,
            snapshotsRef.current![0].sentenceFrom!
          );
          handlePageChange(
            newPage,
            sentencesPerPageRef.current,
            true,
            true,
            false
          );
          onHighlightedSubtitleIndexChange?.(newHighlightedIndex);
          setLoadingFromFetch(false);
        }
      }
      if (
        playerRef.current! &&
        playerRef.current.seekTo &&
        shouldSetVideo === true
      ) {
        playerRef.current.seekTo(
          snapshots![0].sentencesData[firstIndexAfterReset!].start!
        );
        onHighlightedSubtitleIndexChange?.(firstIndexAfterReset);
        setShouldSetVideo(false);
      }
      setLoadingFromFetch(false);
    }, [snapshots, shouldSetVideo, firstIndexAfterReset]);

    useEffect(() => {
      const fetchCurrentUser = async () => {
        const user = await getUser(cookies.access_token);
        setCurrentUser(user);
      };
      fetchCurrentUser();
      async () => {
        socket.connect();
      };
      if (isInitRender) setIsInitRender(false);
      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        if (intervalId.current) {
          clearInterval(intervalId.current);
          intervalId.current = undefined;
        }
        async () => {
          socket.disconnect();
        };
      };
    }, []);

    const scheduleHandleTimeUpdate = async () => {
      if (
        !playerRef.current?.getCurrentTime() &&
        playerRef.current?.getCurrentTime() !== 0
      ) {
        return;
      }
      const currentTime = playerRef.current.getCurrentTime();
      let currentSentenceIndex = getCurrentIndex(
        snapshotsRef.current!,
        currentTime
      );

      if (currentSentenceIndex === -1) {
        currentSentenceIndex = 0;
      }
      console.log(
        "currentSentenceIndex" + JSON.stringify(currentSentenceIndex, null, 2)
      );
      const nextSentence =
        snapshotsRef.current![0].sentencesData[currentSentenceIndex];
      if (!nextSentence) {
        return;
      }
      const timeUntilNextSentence =
        (nextSentence.start! + nextSentence.duration! - currentTime) * 1000;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (isMounted.current) {
        timeoutId = window.setTimeout(async () => {
          await handleTimeUpdate();
          // We need to reschedule the handleTimeUpdate because we just moved to the next sentence
          await scheduleHandleTimeUpdate();
        }, timeUntilNextSentence);
      }
    };

    const hasSeekToBeenCalledRef = useRef(false);

    const handlePlayerStateChange = useCallback(
      (event: any) => {
        if (
          event.data === YT.PlayerState.PLAYING &&
          !hasSeekToBeenCalledRef.current
        ) {
          if (!hasSeekToBeenCalledRef.current) {
            /* playerRef.current?.seekTo(
              snapshotsRef.current![0].sentencesData[0].start!
            ); */
            setIsInitRender(false);
            hasSeekToBeenCalledRef.current = true;
          }
        }
        if (event.data === YT.PlayerState.PLAYING && hasVideoPaused) {
          setIsVideoPaused(false);
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          if (intervalId.current) {
            clearInterval(intervalId.current);
          }
          intervalId.current = setInterval(() => {
            if (
              playerRef.current?.getPlayerState() !== YT.PlayerState.PAUSED &&
              playerRef.current?.getPlayerState() !== YT.PlayerState.ENDED
            ) {
              console.log("Sending data...");
              socket.emit("video-playing", {
                libraryId: libraryId,
                currentTime: playerRef.current?.getCurrentTime(),
              });
            }
          }, 10000);
          if (!isInitRender) scheduleHandleTimeUpdate();
          if (isInitRender) {
            setIsInitRender(false);
          }
        } else if (
          event.data === YT.PlayerState.PAUSED ||
          event.data === YT.PlayerState.ENDED
        ) {
          setIsVideoPaused(true);
          setHasVideoPaused(true);
          if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
          }
          if (intervalId.current) {
            clearInterval(intervalId.current);
            intervalId.current = undefined;
          }
        }

        if (event.data === YT.PlayerState.BUFFERING) {
          if (hasSeekHappenedRef.current === false) {
            if (
              currentUser?.userLibraries &&
              currentUser.userLibraries.some(
                (library) => library.libraryId === libraryId
              )
            ) {
              const userLibraryWatched = currentUser.userLibraries.find(
                (library) => library.libraryId === libraryId
              );
              if (userLibraryWatched) {
                playerRef.current?.seekTo(userLibraryWatched.timeStamp);
              }
            }
          }
          hasSeekHappenedRef.current = true;
          setIsInitRender(false);
          handleTimeUpdate();
        }
        return () => {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
        };
      },
      [
        handlePageChange,
        shouldSetVideo,
        snapshots,
        isInitRender,
        hasVideoPaused,
      ]
    );

    useEffect(() => {
      const fetchLibraryItemAndSetupPlayer = async () => {
        if (isInitRender) {
          const library = await getLibraryItem(libraryId!);
          setCurrentLibrary(library);
          handlePageChange(1, sentencesPerPageRef.current, false, false, false);
        }
        window.onYouTubeIframeAPIReady = () => {
          if (playerDivRef.current && !playerRef.current && currentLibrary) {
            playerRef.current = new YT.Player(playerDivRef.current, {
              videoId: currentLibrary!.videoId,
              events: {
                onStateChange: handlePlayerStateChange,
                onPlaybackRateChange: handlePlayerStateChange,
                onError: (event: any) => {
                  console.error("YouTube Player Error", event);
                },
              },
            });
            playerRef.current.addEventListener("onReady", function () {
              if (playerRef.current.seekTo) {
                //playerRef.current.seekTo(0.1, true);
              }
            });
          }
        };

        if (window.YT && window.YT.loaded) {
          window.onYouTubeIframeAPIReady();
        } else {
          const tag = document.createElement("script");
          tag.src = "https://www.youtube.com/iframe_api";
          const firstScriptTag = document.getElementsByTagName("script")[0];
          firstScriptTag.parentNode!.insertBefore(tag, firstScriptTag);
        }
      };
      fetchLibraryItemAndSetupPlayer();
    }, [handlePageChange, handlePlayerStateChange]);

    useEffect(() => {
      sentencesPerPageRef.current = sentencesPerPage;
    }, [sentencesPerPage]);

    const handleTimeUpdate = async () => {
      if (
        !playerRef.current?.getCurrentTime() &&
        playerRef.current?.getCurrentTime() !== 0
      ) {
        return;
      }

      const currentTime = playerRef.current.getCurrentTime();
      const startIndex = getCurrentIndex(snapshotsRef.current!, currentTime);

      const pageNumber = calculatePage(
        startIndex,
        sentencesPerPage,
        snapshotsRef.current![0].sentenceFrom
      );

      const pageNumberToUse =
        playerRef.current?.getPlayerState() === YT.PlayerState.PAUSED
          ? currentPageToUseRef.current
          : pageNumber;

      currentPageToUseRef.current = pageNumberToUse;

      const newHighlightedIndex =
        currentTime < snapshotsRef.current![0].sentencesData[0].start!
          ? 0
          : snapshotsRef.current![0].sentencesData.findIndex((sentence) => {
              return (
                currentTime >= sentence.start! &&
                currentTime < sentence.start! + sentence.duration! - 0.1
              );
            });
      console.log(
        "newHighlightedIndex" + JSON.stringify(newHighlightedIndex, null, 2)
      );
      if (
        newHighlightedIndex === null ||
        newHighlightedIndex === undefined ||
        isNaN(newHighlightedIndex)
      ) {
        return;
      }

      if (
        currentTime > snapshotsRef.current![0].end ||
        currentTime < snapshotsRef.current![0].start
      ) {
        const snapshotInfo = findSnapshotWithCurrentTime(
          currentLibrary!,
          currentTime
        );
        const newPage = Math.ceil(
          snapshotInfo?.sentenceFrom! / sentencesPerPageRef.current
        );
        handlePageChange(
          newPage,
          sentencesPerPageRef.current,
          false,
          true,
          true
        );
      }

      if (newHighlightedIndex === -1) {
        const snapshotInfo = findSnapshotWithCurrentTime(
          currentLibrary!,
          currentTime
        );

        const newPage = Math.ceil(
          snapshotInfo?.sentenceFrom! / sentencesPerPageRef.current
        );
        startIndexRef.current =
          newPage * sentencesPerPageRef.current -
          snapshotsRef.current![0].sentenceFrom +
          1;
        endIndexRef.current = Math.ceil(
          newPage * sentencesPerPageRef.current -
            snapshotsRef.current![0].sentenceFrom
        );
      } else {
        if (
          onHighlightedSubtitleIndexChange &&
          newHighlightedIndex !== null &&
          newHighlightedIndex !== undefined &&
          !isNaN(newHighlightedIndex)
        ) {
          if (
            startIndexRef.current === null ||
            endIndexRef.current === null ||
            newHighlightedIndex! < startIndexRef.current ||
            newHighlightedIndex! > endIndexRef.current
          ) {
            const newPage = calculatePage(
              newHighlightedIndex!,
              sentencesPerPageRef.current,
              snapshotsRef.current![0].sentenceFrom!
            );

            startIndexRef.current =
              (newPage - 1) * sentencesPerPageRef.current -
              snapshotsRef.current![0].sentenceFrom +
              1;
            endIndexRef.current = Math.ceil(
              newPage * sentencesPerPageRef.current -
                snapshotsRef.current![0].sentenceFrom
            );
            handlePageChange(
              newPage,
              sentencesPerPageRef.current,
              true,
              true,
              false
            );
          }
          if (onHighlightedSubtitleIndexChange) {
            onHighlightedSubtitleIndexChange(newHighlightedIndex!);
          }
        }
      }
    };

    return (
      <div style={{ paddingBottom: "56.25%", height: 0 }}>
        <div
          ref={playerDivRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        />
      </div>
    );
  }
);

export default EmbeddedVideo;

export function getCurrentIndex(
  snapshots: Snapshot[],
  currentTime: number
): number {
  const currentIndex = snapshots[0].sentencesData.findIndex((sentence) => {
    return (
      currentTime >= sentence.start! &&
      currentTime <= sentence.start! + sentence.duration!
    );
  });
  return currentIndex;
}

export function findSnapshotWithCurrentTime(
  libraryItem: LibraryItem,
  currentTime: number
): SnapshotInfo | null {
  for (let snapshot of libraryItem.snapshotsInfo) {
    if (snapshot.start <= currentTime && currentTime <= snapshot.end) {
      return snapshot;
    }
  }
  return null;
}
