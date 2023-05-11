import React, { useEffect, useRef, useState } from "react";
import { Snapshot } from "@/models/snapshot.interfaces";
import { getSnapshot } from "@/services/snapshotService";
import { useParams } from "react-router-dom";
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
  currentPage: number;
  sentencesPerPage: number;
  handlePageChange: (page: number, pageSize: number) => void;
  sourceLanguage: string;
  targetLanguages: string[];
}

const EmbeddedVideo: React.FC<EmbeddedVideoProps> = ({
  onHighlightedSubtitleIndexChange,
  currentPage,
  sentencesPerPage,
  handlePageChange,
  sourceLanguage,
  targetLanguages,
}) => {
  const { libraryId } = useParams();
  const queryParams = new URLSearchParams(location.search);
  const currentPageFromQuery = parseInt(
    queryParams.get("currentPage") as string
  );
  const playerDivRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const currentPageRef = useRef(currentPage);
  const sentencesPerPageRef = useRef(sentencesPerPage);
  const snapshotRef = useRef<Snapshot | null>(null);

  const [isInitRender, setIsInitRender] = useState<boolean>(true);

  function getCurrentIndex(snapshot: Snapshot, currentTime: number): number {
    const currentIndex = snapshot.sentencesData.findIndex((sentence) => {
      return (
        currentTime >= sentence.start! &&
        currentTime <= sentence.start! + sentence.duration!
      );
    });
    return currentIndex;
  }

  const handlePlayerStateChange = async () => {
    if (playerRef.current?.getPlayerState() && isInitRender) {
      // Your logic to execute when the video starts playing for the first time
      const currentTime = playerRef.current.getCurrentTime();
      const snapshot = await getSnapshot(
        sourceLanguage,
        targetLanguages,
        currentTime,
        undefined
      );

      snapshotRef.current = snapshot;

      const currentIndex = getCurrentIndex(snapshot, currentTime);

      const newIndex = currentIndex + snapshot.sentenceFrom - 1;
      const newPage = Math.ceil((newIndex + 1) / sentencesPerPageRef.current);
      handlePageChange(newPage, sentencesPerPageRef.current);
    }

    while (
      playerRef.current?.getPlayerState() === YT.PlayerState.PLAYING ||
      playerRef.current?.getPlayerState() === YT.PlayerState.PAUSED
    ) {
      await handleTimeUpdate();
      await new Promise((resolve) => setTimeout(resolve, 4000));
    }
  };

  useEffect(() => {
    const fetchLibraryItemAndSetupPlayer = async () => {
      const library = await getLibraryItem(libraryId!);

      const snapshot = await getSnapshot(
        sourceLanguage,
        targetLanguages,
        undefined,
        1
      );

      snapshotRef.current = snapshot;
      handlePageChange(1, sentencesPerPageRef.current);

      const onYouTubeIframeAPIReady = () => {
        if (playerDivRef.current && !playerRef.current) {
          playerRef.current = new YT.Player(playerDivRef.current, {
            videoId: library.videoId,
            events: {
              onStateChange: () => handlePlayerStateChange(),
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
        script.onload = () =>
          (window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady);
        document.body.appendChild(script);
      }
    };

    fetchLibraryItemAndSetupPlayer();
  }, []);

  useEffect(() => {
    sentencesPerPageRef.current = sentencesPerPage;
  }, [sentencesPerPage]);

  function findSnapshotWindow(
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

    if (startIndex >= snapshot.sentencesData.length) {
      return false;
    }

    const windowStartTime = snapshot.sentencesData[startIndex].start;
    const windowEndTime = snapshot.sentencesData[endIndex].start;
    if (!windowStartTime || !windowEndTime) {
      throw new Error("Start or end time is not available for some sentences");
    }

    //return currentTime >= windowStartTime && currentTime <= windowEndTime;
    return currentTime >= windowEndTime || currentTime <= windowStartTime;
  }

  function findPageIndexByTime(
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

  const handleTimeUpdate = async () => {
    if (!playerRef.current?.getCurrentTime()) {
      return;
    }

    const currentTime = playerRef.current.getCurrentTime();
    const startIndex = getCurrentIndex(snapshotRef.current!, currentTime);
    const pageNumber = Math.ceil((startIndex + 1) / sentencesPerPage);

    const newHighlightedSentence = snapshotRef.current?.sentencesData.find(
      (sentence) =>
        currentTime >= sentence.start! &&
        currentTime <= sentence.start! + sentence.duration!
    );

    if (!newHighlightedSentence) {
      return;
    }

    const pageNumberToUse =
      playerRef.current?.getPlayerState() === YT.PlayerState.PAUSED
        ? currentPageRef.current
        : pageNumber;

    currentPageRef.current = pageNumberToUse;

    const isOutsideSnapshotWindow = findSnapshotWindow(
      snapshotRef.current!,
      sentencesPerPageRef.current,
      currentTime,
      pageNumber - 1
    );

    const newPage =
      (snapshotRef.current?.sentenceFrom! - 1) / sentencesPerPageRef.current +
      pageNumber;

    console.log("currentPageFromQuery" + currentPageFromQuery);
    /* if (newPage !== currentPageFromQuery) {
      handlePageChange(currentPageFromQuery, sentencesPerPageRef.current);
    } */
    if (pageNumber !== pageNumberToUse) {
      const newVideoTime = newHighlightedSentence?.start!;
      setVideoTimeFunction(newVideoTime + 1);
      handlePageChange(newPage, sentencesPerPageRef.current);
    } else if (isOutsideSnapshotWindow) {
      const newPage = findPageIndexByTime(
        snapshotRef.current!,
        sentencesPerPageRef.current,
        currentTime
      );
      console.log("newPage" + newPage);
      handlePageChange(
        newPage,
        sentencesPerPageRef.current,
        snapshotRef.current!
      );
    }

    if (onHighlightedSubtitleIndexChange) {
      const newHighlightedIndex = snapshotRef.current?.sentencesData.indexOf(
        newHighlightedSentence!
      );
      onHighlightedSubtitleIndexChange(
        newHighlightedIndex !== -1 ? newHighlightedIndex! : null
      );
    }
  };

  const setVideoTimeFunction = (timeInSeconds: number) => {
    if (playerRef.current && playerRef.current.seekTo) {
      playerRef.current.seekTo(timeInSeconds, true);
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
