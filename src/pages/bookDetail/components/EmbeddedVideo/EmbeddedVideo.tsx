import React, { useEffect, useRef } from "react";
import { SentenceData } from "@/models/sentences.interfaces";

declare var YT: any;
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface EmbeddedVideoProps {
  videoId?: string | null;
  title: string;
  sentencesData: SentenceData[];
  onHighlightedSubtitleIndexChange?: (index: number | null) => void;
  currentPage: number;
  sentencesPerPage: number;
  handlePageChange: (page: number, pageSize: number) => void;
}

const EmbeddedVideo: React.FC<EmbeddedVideoProps> = ({
  videoId,
  title,
  sentencesData,
  onHighlightedSubtitleIndexChange,
  currentPage,
  sentencesPerPage,
  handlePageChange,
}) => {
  const playerDivRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const currentPageRef = useRef(currentPage);
  const sentencesPerPageRef = useRef(sentencesPerPage);

  useEffect(() => {
    const currentTime = playerRef.current?.getCurrentTime();
    if (!currentTime) return;

    const newIndex = sentencesData.findIndex(
      (sentence) =>
        currentTime >= sentence.start! &&
        currentTime <= sentence.start! + sentence.duration
    );

    if (newIndex !== -1) {
      const newPage = Math.ceil((newIndex + 1) / sentencesPerPageRef.current);

      if (newPage !== currentPageRef.current && newPage > 0) {
        handlePageChange(newPage, sentencesPerPageRef.current);
      }
    }
  }, [sentencesData, handlePageChange]);

  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  useEffect(() => {
    sentencesPerPageRef.current = sentencesPerPage;
  }, [sentencesPerPage]);

  const handlePlayerStateChange = () => {
    if (playerRef.current?.getPlayerState() === YT.PlayerState.PLAYING) {
      handleTimeUpdate();
      setTimeout(handlePlayerStateChange, 500);
    }
  };

  const handleTimeUpdate = () => {
    if (playerRef.current?.getCurrentTime) {
      const currentTime = playerRef.current.getCurrentTime();
      changePageOnVideoPlay();
      const startIndex =
        (currentPageRef.current - 1) * sentencesPerPageRef.current;

      const newHighlightedIndex = sentencesData
        .slice(startIndex)
        .findIndex(
          (sentence) =>
            currentTime >= sentence.start! &&
            currentTime <= sentence.start! + sentence.duration
        );

      if (onHighlightedSubtitleIndexChange) {
        onHighlightedSubtitleIndexChange(
          newHighlightedIndex !== -1 ? newHighlightedIndex + startIndex : null
        );
      }
    }
  };

  const changePageOnVideoPlay = () => {
    const currentTime = playerRef.current.getCurrentTime();
    const newPage = Math.ceil(
      (sentencesData.findIndex(
        (sentence) =>
          currentTime >= sentence.start! &&
          currentTime <= sentence.start! + sentence.duration
      ) +
        1) /
        sentencesPerPageRef.current
    );

    if (newPage !== currentPageRef.current && newPage > 0) {
      handlePageChange(newPage, sentencesPerPageRef.current);
    }
  };

  useEffect(() => {
    const onYouTubeIframeAPIReady = () => {
      if (playerDivRef.current && !playerRef.current) {
        playerRef.current = new YT.Player(playerDivRef.current, {
          videoId,
          events: {
            onStateChange: handlePlayerStateChange,
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
  }, [videoId]);

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
