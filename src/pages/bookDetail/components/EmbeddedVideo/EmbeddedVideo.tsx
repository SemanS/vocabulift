import React, { useEffect, useState } from "react";
import { Card } from "antd";

interface EmbeddedVideoProps {
  videoId: string;
  title: string;
}

const EmbeddedVideo: React.FC<EmbeddedVideoProps> = ({ videoId, title }) => {
  const videoSrc = `https://www.youtube.com/embed/${videoId}`;
  const [subtitles, setSubtitles] = useState<
    Array<{ startTime: number; endTime: number; text: string }>
  >([]);

  useEffect(() => {
    const response = fetch(
      `${
        import.meta.env.VITE_REACT_APP_SERVER_ENDPOINT
      }/user/captions/${videoId})}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        },
      }
    );
    console.log(JSON.stringify(response));
  }, [videoId]);

  return (
    <Card title={title} style={{ marginBottom: "16px" }}>
      <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
        <iframe
          src={videoSrc}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        />
      </div>
      <div style={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}>
        {subtitles.map((subtitle, index) => (
          <p key={index}>{subtitle.text}</p>
        ))}
      </div>
    </Card>
  );
};

export default EmbeddedVideo;
