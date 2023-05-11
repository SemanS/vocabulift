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
  videoId?: string | null;
  title: string;
  onHighlightedSubtitleIndexChange?: (index: number | null) => void;
  currentPage: number;
  sentencesPerPage: number;
  handlePageChange: (
    page: number,
    pageSize: number,
    snapshot?: Snapshot
  ) => void;
  sourceLanguage: string;
  targetLanguages: string[];
}

const EmbeddedVideo: React.FC<EmbeddedVideoProps> = ({
  videoId,
  title,
  onHighlightedSubtitleIndexChange,
  currentPage,
  sentencesPerPage,
  handlePageChange,
  sourceLanguage,
  targetLanguages,
}) => {
  const { libraryId } = useParams();
  const playerDivRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const currentPageRef = useRef(currentPage);
  const sentencesPerPageRef = useRef(sentencesPerPage);
  const snapshotRef = useRef<Snapshot | null>(null);

  const [isInitRender, setIsInitRender] = useState<boolean>(true);

  const handlePlayerStateChange = async () => {
    //if (playerRef.current?.getPlayerState() === YT.PlayerState.PLAYING) {
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

      const currentIndex = snapshot.sentencesData.findIndex((sentence) => {
        return (
          currentTime >= sentence.start! &&
          currentTime <= sentence.start! + sentence.duration
        );
      });

      const newIndex = currentIndex + snapshot.sentenceFrom - 1;
      const newPage = Math.ceil((newIndex + 1) / sentencesPerPageRef.current);
      handlePageChange(newPage, sentencesPerPageRef.current);
    }

    while (playerRef.current?.getPlayerState() === YT.PlayerState.PLAYING) {
      await handleTimeUpdate();
      await new Promise((resolve) => setTimeout(resolve, 500));
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
    currentTime: string,
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

    return currentTime >= windowStartTime && currentTime <= windowEndTime;
  }

  function findPageIndexByTime(
    snapshot: Snapshot,
    sentencesPerPage: number,
    currentTime: string
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

    if (currentIndex > 0) {
      pageIndex = Math.floor((currentIndex - 1) / sentencesPerPage);
    }

    return pageIndex;
  }

  const handleTimeUpdate = async () => {
    if (playerRef.current?.getCurrentTime) {
      const currentTime = playerRef.current.getCurrentTime();
      const tempStartIndex =
        (currentPageRef.current - 1) * sentencesPerPageRef.current;
      const startIndex = tempStartIndex % 100;

      const newHighlightedIndex = snapshotRef.current?.sentencesData.findIndex(
        (sentence) =>
          currentTime >= sentence.start! &&
          currentTime <= sentence.start! + sentence.duration
      );

      const isOutsideSnapshotWindow = findSnapshotWindow(
        snapshotRef.current!,
        sentencesPerPageRef.current,
        currentTime,
        startIndex
      );

      if (isOutsideSnapshotWindow) {
        const newPage =
          findPageIndexByTime(
            snapshotRef.current!,
            sentencesPerPageRef.current,
            currentTime
          ) +
          snapshotRef.current?.sentenceFrom! -
          1;
        handlePageChange(
          newPage,
          sentencesPerPageRef.current,
          snapshotRef.current!
        );
      }

      if (onHighlightedSubtitleIndexChange) {
        onHighlightedSubtitleIndexChange(
          newHighlightedIndex !== -1 ? newHighlightedIndex! : null
        );
      }
    }
  };

  const setVideoTime = (timeInSeconds: number) => {
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
