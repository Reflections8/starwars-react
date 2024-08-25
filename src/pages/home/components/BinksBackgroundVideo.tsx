import { useEffect, useRef } from "react";
import "../styles/binksBackgroundVideo.css";
import videoSrc2 from "../video/test.mp4";
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

  useEffect(() => {
    if (videoRef3.current) {
      setInterval(() => {
        // @ts-ignore
        findTimeFunction(videoRef3.current?.currentTime);
      }, 1000);
    }
  }, []);

  function findTimeFunction(currentTime: number) {
    const fixedTime = currentTime?.toFixed(0);
    // @ts-ignore
    if (fixedTime == 8) {
      highlightElement("shop");
    }
    // @ts-ignore
    if (fixedTime == 11) {
      highlightElement("games");
    }
    // @ts-ignore
    if (fixedTime == 15) {
      highlightElement("credits");
    }
    // @ts-ignore
    if (fixedTime == 17) {
      highlightElement("akron");
    }
  }

  function highlightElement(className: string) {
    const element = document.querySelector(`.highlighter.${className}`);
    element?.classList.add("active");
    setTimeout(() => {
      element?.classList.add("pulsation");
    }, 250);
    setTimeout(() => {
      element?.classList.remove("active");
    }, 2500);
    setTimeout(() => {
      element?.classList.remove("pulsation");
    }, 2750);
  }

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
