import React, { useCallback, useEffect, useRef, useState } from "react";
import { Snapshot } from "@/models/snapshot.interfaces";
import { useParams } from "react-router-dom";
import { getLibraryItem } from "@/services/libraryService";
import { calculatePage } from "@/utils/stringUtils";
import { LibraryItem, SnapshotInfo } from "@/models/libraryItem.interface";

declare const YT: any;
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface EmbeddedVideoProps {
  onHighlightedSubtitleIndexChange?: (index: number | null) => void;
  sentencesPerPage: number;
  handlePageChange: (
    page: number,
    pageSize: number,
    changeTriggeredByHighlightChange?: boolean
  ) => void;
  snapshots: Snapshot[] | null | undefined;
  shouldSetVideo: boolean;
  setShouldSetVideo: (shouldSetVideo: boolean) => void;
  firstIndexAfterReset: number | null;
}

const EmbeddedVideo: React.FC<EmbeddedVideoProps> = ({
  onHighlightedSubtitleIndexChange,
  sentencesPerPage,
  handlePageChange,
  snapshots,
  shouldSetVideo,
  setShouldSetVideo,
  firstIndexAfterReset,
}) => {
  const { libraryId } = useParams();
  const playerDivRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const currentPageToUseRef = useRef<number | null>(null);
  const sentencesPerPageRef = useRef(sentencesPerPage);
  const snapshotsRef = useRef<Snapshot[] | null | undefined>(null);
  const [isInitRender, setIsInitRender] = useState(true);
  const startIndexRef = useRef<number | null>(null);
  const endIndexRef = useRef<number | null>(null);

  let timeoutId: number | null = null;

  const [currentLibrary, setCurrentLibrary] = useState<LibraryItem | null>();

  useEffect(() => {
    if (playerRef.current! && shouldSetVideo === true) {
      playerRef.current.seekTo(
        snapshots![0].sentencesData[firstIndexAfterReset!].start! + 0.2
      );
      onHighlightedSubtitleIndexChange?.(firstIndexAfterReset);
      setShouldSetVideo(false);
    }
  }, [shouldSetVideo, firstIndexAfterReset]);

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  useEffect(() => {
    snapshotsRef.current = snapshots;
    scheduleHandleTimeUpdate();
    handleTimeUpdate();
  }, [snapshots]);

  const scheduleHandleTimeUpdate = async () => {
    if (!playerRef.current?.getCurrentTime()) {
      return;
    }
    const currentTime = playerRef.current.getCurrentTime();
    const currentSentenceIndex = getCurrentIndex(
      snapshotsRef.current!,
      currentTime
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
    timeoutId = window.setTimeout(async () => {
      await handleTimeUpdate();
      // We need to reschedule the handleTimeUpdate because we just moved to the next sentence
      await scheduleHandleTimeUpdate();
    }, timeUntilNextSentence);
  };

  const handlePlayerStateChange = useCallback(
    (event: any) => {
      if (event.data === YT.PlayerState.PLAYING) {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        //handleTimeUpdate();
        scheduleHandleTimeUpdate();
      } else if (
        event.data === YT.PlayerState.PAUSED ||
        event.data === YT.PlayerState.ENDED
      ) {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
      }

      // If the user seeks to a new time, update the subtitles immediately
      if (event.data === YT.PlayerState.BUFFERING) {
        handleTimeUpdate();
        scheduleHandleTimeUpdate();
      }

      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
    },
    [handlePageChange, shouldSetVideo]
  );

  useEffect(() => {
    const fetchLibraryItemAndSetupPlayer = async () => {
      if (isInitRender) {
        const library = await getLibraryItem(libraryId!);
        setCurrentLibrary(library);
        console.log("init handlePageChange");
        handlePageChange(1, sentencesPerPageRef.current);
        setIsInitRender(false);
      }

      const onYouTubeIframeAPIReady = () => {
        if (playerDivRef.current && !playerRef.current) {
          playerRef.current = new YT.Player(playerDivRef.current, {
            videoId: currentLibrary!.videoId,
            events: {
              onStateChange: handlePlayerStateChange,
              onPlaybackRateChange: handlePlayerStateChange,
            },
          });
        }
      };

      if (window.YT) {
        onYouTubeIframeAPIReady();
      } else {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.async = true;
        script.onload = onYouTubeIframeAPIReady;
        document.body.appendChild(script);
      }
    };

    fetchLibraryItemAndSetupPlayer();
  }, [handlePageChange, handlePlayerStateChange]);

  useEffect(() => {
    sentencesPerPageRef.current = sentencesPerPage;
  }, [sentencesPerPage]);

  const handleTimeUpdate = async () => {
    if (!playerRef.current?.getCurrentTime()) {
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
      snapshotsRef.current![0].sentencesData.findIndex(
        (sentence) =>
          currentTime >= sentence.start! &&
          currentTime <= sentence.start! + sentence.duration!
      );

    if (!newHighlightedIndex) {
      return;
    }

    if (newHighlightedIndex === -1) {
      const snapshotInfo = findSnapshotWithCurrentTime(
        currentLibrary!,
        currentTime
      );

      const newPage = Math.ceil(
        snapshotInfo?.sentenceFrom! / sentencesPerPageRef.current
      );
      startIndexRef.current = newPage * sentencesPerPageRef.current;
      endIndexRef.current = Math.ceil(
        newPage * sentencesPerPageRef.current - 1
      );
      console.log("newHighlightedIndex === -1");
      //handlePageChange(newPage, sentencesPerPageRef.current, true);
    } else {
      if (onHighlightedSubtitleIndexChange) {
        console.log(
          "newHighlightedIndex" + JSON.stringify(newHighlightedIndex, null, 2)
        );
        console.log(
          "startIndexRef.current" +
            JSON.stringify(startIndexRef.current, null, 2)
        );
        console.log(
          "endIndexRef.current" + JSON.stringify(endIndexRef.current, null, 2)
        );
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

          startIndexRef.current = (newPage - 1) * sentencesPerPageRef.current;
          endIndexRef.current = Math.min(
            newPage * sentencesPerPageRef.current - 1,
            snapshotsRef.current![0].sentencesData.length! - 1
          );
          console.log("newHighlightedIndex pokracuje");
          handlePageChange(newPage, sentencesPerPageRef.current, true);
        }
        if (onHighlightedSubtitleIndexChange) {
          onHighlightedSubtitleIndexChange(newHighlightedIndex!);
        }
      }
    }
  };

  return (
    <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
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
};

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
