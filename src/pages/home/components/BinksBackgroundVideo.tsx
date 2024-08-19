import { useEffect, useRef } from "react";
import "../styles/binksBackgroundVideo.css";
import videoSrc from "../video/binks.mp4";

export function BinksBackgroundVideo() {
  const videoRef = useRef(null);

  useEffect(() => {
    const videoElement = videoRef.current as unknown as HTMLVideoElement;

    if (videoElement) {
      videoElement.muted = true;
      videoElement.play().catch((error) => {
        console.error("Error attempting to play video:", error);
      });
    }
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        className="binksBackgroundVideo"
        src={videoSrc}
        loop
        muted
        playsInline
      ></video>
    </>
  );
}
