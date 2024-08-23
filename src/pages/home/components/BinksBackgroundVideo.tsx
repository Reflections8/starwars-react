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
  const videoRef2 = useRef<HTMLVideoElement>(null);
  const videoRef3 = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (readyState) {
      const video2 = videoRef2.current;
      const video3 = videoRef3.current;
      if (activeVideo === "2" && video2) {
        video2.play().catch(console.error);
        video2.muted = false;
      }

      if (activeVideo === "3" && video2 && video3) {
        video2.pause();
        video3.play().catch(console.error);
        video3.muted = false;
      }
    }
  }, [readyState, activeVideo]);

  return (
    <>
      <video
        ref={videoRef2}
        className={`binksBackgroundVideo ${
          activeVideo === "2" ? "active" : "hidden"
        }`}
        src={videoSrc2}
        muted
        preload="auto"
        playsInline
      ></video>

      <video
        ref={videoRef3}
        className={`binksBackgroundVideo ${
          activeVideo === "3" ? "active" : "hidden"
        }`}
        src={videoSrc3}
        muted
        preload="auto"
        loop
        playsInline
      ></video>
    </>
  );
}
