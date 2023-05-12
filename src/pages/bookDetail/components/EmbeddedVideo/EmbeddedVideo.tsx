import React, { useCallback, useEffect, useRef, useState } from "react";
import { Snapshot } from "@/models/snapshot.interfaces";
import { useLocation, useParams } from "react-router-dom";
import { getLibraryItem } from "@/services/libraryService";

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
    currentTime?: number | undefined
  ) => void;
  snapshot: Snapshot | null | undefined;
}

const EmbeddedVideo: React.FC<EmbeddedVideoProps> = ({
  onHighlightedSubtitleIndexChange,
  sentencesPerPage,
  handlePageChange,
  snapshot,
}) => {
  const { libraryId } = useParams();
  const playerDivRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const currentPageToUseRef = useRef<number | null>(null);
  const sentencesPerPageRef = useRef(sentencesPerPage);
  const snapshotRef = useRef<Snapshot | null | undefined>(null);
  const location = useLocation();
  const [isInitRender, setIsInitRender] = useState(true);

  let timeoutId: NodeJS.Timeout | null = null;

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  useEffect(() => {
    snapshotRef.current = snapshot;
  }, [snapshot]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const currentPage = Number(queryParams.get("currentPage")) || 0;

    if (currentPage !== currentPageToUseRef.current) {
      //handlePageChange(currentPage, 10);
      setVideoTime(
        snapshot?.sentencesData[
          currentPage * sentencesPerPage - sentencesPerPage + 1
        ]?.start || 0
      );
    }
  }, [location]);

  const handlePlayerStateChange = useCallback(() => {
    const scheduleHandleTimeUpdate = async () => {
      if (!playerRef.current?.getCurrentTime()) {
        return;
      }
      const currentTime = playerRef.current.getCurrentTime();
      const currentSentenceIndex = getCurrentIndex(
        snapshotRef.current!,
        currentTime
      );
      const nextSentence =
        snapshotRef.current?.sentencesData[currentSentenceIndex + 1];
      if (!nextSentence) {
        return;
      }

      const timeUntilNextSentence = (nextSentence.start! - currentTime) * 1000;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(async () => {
        await handleTimeUpdate();
        // We need to reschedule the handleTimeUpdate because we just moved to the next sentence
        await scheduleHandleTimeUpdate();
      }, timeUntilNextSentence);
    };

    if (playerRef.current?.getPlayerState() === YT.PlayerState.PLAYING) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      scheduleHandleTimeUpdate();
    } else if (
      playerRef.current?.getPlayerState() === YT.PlayerState.PAUSED ||
      playerRef.current?.getPlayerState() === YT.PlayerState.ENDED
    ) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [handlePageChange]);

  useEffect(() => {
    const fetchLibraryItemAndSetupPlayer = async () => {
      const library = await getLibraryItem(libraryId!);
      if (isInitRender) {
        handlePageChange(1, sentencesPerPageRef.current);
        setIsInitRender(false);
      }

      const onYouTubeIframeAPIReady = () => {
        if (playerDivRef.current && !playerRef.current) {
          playerRef.current = new YT.Player(playerDivRef.current, {
            videoId: library.videoId,
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
    const startIndex = getCurrentIndex(snapshotRef.current!, currentTime);
    const pageNumber = Math.ceil((startIndex + 1) / sentencesPerPage);

    const pageNumberToUse =
      playerRef.current?.getPlayerState() === YT.PlayerState.PAUSED
        ? currentPageToUseRef.current
        : pageNumber;

    currentPageToUseRef.current = pageNumberToUse;

    const isOutsideSnapshotWindow = findSnapshotWindow(
      snapshotRef.current!,
      sentencesPerPageRef.current,
      currentTime,
      pageNumber - 1
    );

    const newPage =
      (snapshotRef.current?.sentenceFrom! - 1) / sentencesPerPageRef.current +
      pageNumber;

    const newHighlightedSentence = snapshotRef.current?.sentencesData.find(
      (sentence) =>
        currentTime >= sentence.start! &&
        currentTime <= sentence.start! + sentence.duration!
    );

    if (!newHighlightedSentence) {
      return;
    }

    if (pageNumber !== pageNumberToUse) {
      const newVideoTime = newHighlightedSentence?.start!;
      setVideoTime(newVideoTime + 1);
      console.log("changikujem1");
      console.log("newPage" + JSON.stringify(newPage, null, 2));
      handlePageChange(newPage, sentencesPerPageRef.current);
    } else if (isOutsideSnapshotWindow) {
      const newPage = findPageIndexByTime(
        snapshotRef.current!,
        sentencesPerPageRef.current,
        currentTime
      );
      console.log("changikujem2");
      handlePageChange(newPage, sentencesPerPageRef.current);
    }

    if (onHighlightedSubtitleIndexChange) {
      const newHighlightedIndex = snapshotRef.current?.sentencesData.indexOf(
        newHighlightedSentence!
      );
      console.log(
        "newHighlightedIndex" + JSON.stringify(newHighlightedIndex, null, 2)
      );
      onHighlightedSubtitleIndexChange(
        newHighlightedIndex !== -1 ? newHighlightedIndex! : null
      );
    }
  };

  const setVideoTime = (timeInSeconds: number) => {
    if (playerRef.current && playerRef.current.seekTo) {
      playerRef.current.playVideoAt(timeInSeconds);
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
  snapshot: Snapshot,
  currentTime: number
): number {
  const currentIndex = snapshot.sentencesData.findIndex((sentence) => {
    return (
      currentTime >= sentence.start! &&
      currentTime <= sentence.start! + sentence.duration!
    );
  });
  return currentIndex;
}

export function findSnapshotWindow(
  snapshot: Snapshot,
  sentencesPerPage: number,
  currentTime: number,
  pageIndex: number
): boolean {
  if (sentencesPerPage < 1 || sentencesPerPage > 100) {
    throw new Error("sentencesPerPage must be between 1 and 100");
  }

  const startIndex = pageIndex * sentencesPerPage;
  const endIndex = Math.min(
    (pageIndex + 1) * sentencesPerPage - 1,
    snapshot.sentencesData.length - 1
  );

  console.log("startIndex" + JSON.stringify(startIndex, null, 2));
  console.log("endIndex" + JSON.stringify(endIndex, null, 2));
  if (startIndex >= snapshot.sentencesData.length) {
    return false;
  }

  const windowStartTime = snapshot.sentencesData[startIndex].start;
  const windowEndTime =
    snapshot.sentencesData[endIndex].start! +
    snapshot.sentencesData[endIndex].duration!;
  if (!windowStartTime || !windowEndTime) {
    throw new Error("Start or end time is not available for some sentences");
  }

  return currentTime >= windowEndTime || currentTime <= windowStartTime;
}

export function findPageIndexByTime(
  snapshot: Snapshot,
  sentencesPerPage: number,
  currentTime: number
): number {
  if (sentencesPerPage < 1 || sentencesPerPage > 100) {
    throw new Error("sentencesPerPage must be between 1 and 100");
  }

  let pageIndex = -1;
  let currentIndex = 0;

  for (const sentenceData of snapshot.sentencesData) {
    if (sentenceData.start && sentenceData.start <= currentTime) {
      currentIndex++;
    } else {
      break;
    }
  }

  const sentenceNo = snapshot.sentencesData[currentIndex].sentenceNo;
  if (currentIndex > 0) {
    pageIndex = Math.floor(sentenceNo / sentencesPerPage) + 1;
  }

  return pageIndex;
}
