import React, { useEffect, useRef, useState } from "react";
import { Card } from "antd";
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
  onCurrentPageChange?: (highlightedSubtitleIndex: number | null) => void;
}

const EmbeddedVideo: React.FC<EmbeddedVideoProps> = ({
  videoId,
  title,
  sentencesData,
  onHighlightedSubtitleIndexChange,
  currentPage,
  sentencesPerPage,
}) => {
  const [highlightedSubtitleIndex, setHighlightedSubtitleIndex] = useState<
    number | null
  >(null);
  const playerDivRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    const onYouTubeIframeAPIReady = () => {
      if (playerDivRef.current && !playerRef.current) {
        playerRef.current = new YT.Player(playerDivRef.current, {
          videoId: videoId,
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

  const handlePlayerStateChange = (event: any) => {
    if (event.data === YT.PlayerState.PLAYING) {
      updateHighlight();
    }
  };

  const updateHighlight = () => {
    if (
      playerRef.current &&
      playerRef.current.getPlayerState() === YT.PlayerState.PLAYING
    ) {
      handleTimeUpdate();
      setTimeout(updateHighlight, 500);
    }
  };

  const handleTimeUpdate = () => {
    if (playerRef.current && playerRef.current.getCurrentTime) {
      const currentTime = playerRef.current.getCurrentTime();

      const startIndex = (currentPage - 1) * sentencesPerPage;

      const newHighlightedIndex = sentencesData
        .slice(startIndex)
        .findIndex(
          (sentence) =>
            currentTime >= sentence.start! &&
            currentTime <= sentence.start! + sentence.duration!
        );

      if (newHighlightedIndex !== highlightedSubtitleIndex) {
        setHighlightedSubtitleIndex(
          newHighlightedIndex !== -1 ? newHighlightedIndex + startIndex : null
        );
        if (onHighlightedSubtitleIndexChange) {
          onHighlightedSubtitleIndexChange(
            newHighlightedIndex !== -1 ? newHighlightedIndex + startIndex : null
          );
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
