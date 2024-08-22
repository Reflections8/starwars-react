import { useEffect, useRef } from "react";
import "../styles/binksBackgroundVideo.css";
import videoSrc2 from "../video/2.mp4";
import videoSrc3 from "../video/3.mp4";

type BinksBackgroundVideoProps = {
  readyState: any;
  activeVideo: any;
};

export function BinksBackgroundVideo({
  readyState,
  activeVideo,
}: BinksBackgroundVideoProps) {
  const videoRef = useRef(null);

  useEffect(() => {
    console.log(readyState, activeVideo);
    const videoElement = videoRef.current as unknown as HTMLVideoElement;

    if (videoElement) {
      videoElement.muted = false;
      videoElement.play().catch((error) => {
        console.error("Error attempting to play video:", error);
      });
    }
  }, [readyState, activeVideo]);

  return (
    <>
      {readyState && activeVideo === "2" ? (
        <video
          ref={videoRef}
          className="binksBackgroundVideo"
          src={videoSrc2}
          muted
          playsInline
        ></video>
      ) : null}

      {readyState && activeVideo === "3" ? (
        <video
          ref={videoRef}
          className="binksBackgroundVideo"
          src={videoSrc3}
          muted
          loop
          playsInline
        ></video>
      ) : null}
    </>
  );
}
