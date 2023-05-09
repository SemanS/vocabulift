import React, { useEffect, useRef, useState } from "react";
import { SentenceData, SentenceResponse } from "@/models/sentences.interfaces";

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
  sentencesData: SentenceResponse;
  onHighlightedSubtitleIndexChange?: (index: number | null) => void;
  currentPage: number;
  sentencesPerPage: number;
  handlePageChange: (
    page: number,
    pageSize: number,
    isManual: boolean,
    callback?: () => void
  ) => void;
  sentenceFrom: number;
}

const EmbeddedVideo: React.FC<EmbeddedVideoProps> = ({
  videoId,
  title,
  sentencesData,
  onHighlightedSubtitleIndexChange,
  currentPage,
  sentencesPerPage,
  handlePageChange,
  sentenceFrom,
}) => {
  const playerDivRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const currentPageRef = useRef(currentPage);
  const sentencesPerPageRef = useRef(sentencesPerPage);
  const sentencesDataRef = useRef(sentencesData);

  useEffect(() => {
    //console.log("sentencesData updated", sentencesData.sentences.length);
    //console.log("sentencesData" + JSON.stringify(sentencesData, null, 2));
    sentencesDataRef.current = sentencesData;
  }, []);

  useEffect(() => {
    //console.log("sentencesData updated", sentencesData.sentences.length);
    sentencesDataRef.current = sentencesData;
  }, [sentencesData]);

  useEffect(() => {
    if (currentPage && playerRef.current) {
      setVideoTime(
        sentencesDataRef.current.sentences.sentencesData[
          ((currentPage % 10) - 1) * 10
        ].start
      );
      console.log("tak davaj" + ((currentPage % 10) * 10 + 1));
    }
    currentPageRef.current = currentPage;
  }, [currentPage]);

  useEffect(() => {
    sentencesPerPageRef.current = sentencesPerPage;
  }, [sentencesPerPage]);

  const handlePlayerStateChange = async () => {
    while (playerRef.current?.getPlayerState() === YT.PlayerState.PLAYING) {
      await handleTimeUpdate();
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  };

  const handleTimeUpdate = async () => {
    if (playerRef.current?.getCurrentTime) {
      const currentTime = playerRef.current.getCurrentTime();
      await changePageOnVideoPlay();
      const tempStartIndex =
        (currentPageRef.current - 1) * sentencesPerPageRef.current;
      const startIndex = tempStartIndex % 100;
      const newHighlightedIndex =
        sentencesDataRef.current.sentences.sentencesData
          .slice(startIndex)
          .findIndex(
            (sentence) =>
              currentTime >= sentence.start! &&
              currentTime <= sentence.start! + sentence.duration
          );
      console.log("newHighlightedIndex" + newHighlightedIndex);

      console.log(
        newHighlightedIndex !== -1 ? newHighlightedIndex + startIndex : null
      );
      if (onHighlightedSubtitleIndexChange) {
        onHighlightedSubtitleIndexChange(
          newHighlightedIndex !== -1 ? newHighlightedIndex + startIndex : null
        );
      }
    }
  };

  const setVideoTime = (timeInSeconds) => {
    if (playerRef.current && playerRef.current.seekTo) {
      playerRef.current.seekTo(timeInSeconds, true);
    }
  };

  const changePageOnVideoPlay = async () => {
    const currentTime = playerRef.current.getCurrentTime();
    console.log("currentTime" + currentTime);
    /* console.log(
      "sentencesData.length" + sentencesDataRef.current.sentences.length
    ); */

    const currentIndex =
      sentencesDataRef.current.sentences.sentencesData.findIndex((sentence) => {
        //console.log("sentence" + JSON.stringify(sentence, null, 2));
        return (
          currentTime >= sentence.start! &&
          currentTime <= sentence.start! + sentence.duration
        );
      });

    console.log("currentIndex" + currentIndex);

    const newIndex =
      currentIndex + sentencesDataRef.current.sentences.sentenceFrom - 1;

    console.log("NEW INDEX" + newIndex);
    const newPage = Math.ceil((newIndex + 1) / sentencesPerPageRef.current);

    console.log("newPage" + newPage);
    console.log("currentPageRef.current" + currentPageRef.current);

    /* if (newPage !== currentPageRef.current && newPage > 0) {
      handlePageChange(newPage, sentencesPerPageRef.current, () => {
        console.log(
          "currentPageRef.current after update",
          currentPageRef.current
        );
      });
    } else if (newPage === 0) {
      handlePageChange(11, sentencesPerPageRef.current, () => {
        console.log(
          "currentPageRef.current after update",
          currentPageRef.current
        );
      });
    } */
  };

  useEffect(() => {
    const onYouTubeIframeAPIReady = () => {
      if (playerDivRef.current && !playerRef.current) {
        playerRef.current = new YT.Player(playerDivRef.current, {
          videoId,
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
