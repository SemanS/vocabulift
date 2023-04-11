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
}

const EmbeddedVideo: React.FC<EmbeddedVideoProps> = ({
  videoId,
  title,
  sentencesData,
  onHighlightedSubtitleIndexChange,
}) => {
  const [highlightedSubtitleIndex, setHighlightedSubtitleIndex] = useState<
    number | null
  >(null);
  const playerDivRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    console.log(videoId);
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

    /* return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    }; */
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

      const newHighlightedIndex = sentencesData.findIndex(
        (sentence) =>
          currentTime >= sentence.start! &&
          currentTime <= sentence.start! + sentence.duration!
      );

      if (newHighlightedIndex !== highlightedSubtitleIndex) {
        setHighlightedSubtitleIndex(
          newHighlightedIndex !== -1 ? newHighlightedIndex : null
        );
        if (onHighlightedSubtitleIndexChange) {
          onHighlightedSubtitleIndexChange(
            newHighlightedIndex !== -1 ? newHighlightedIndex : null
          );
        }
      }
    }
  };

  return (
    <Card title={title} style={{ marginBottom: "16px" }}>
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
    </Card>
  );
};

export default EmbeddedVideo;
