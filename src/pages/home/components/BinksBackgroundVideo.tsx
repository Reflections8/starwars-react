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
        highlightElement(videoRef3.current?.currentTime);
      }, 1000);
    }
  }, []);

  function highlightElement(currentTime: number) {
    const fixedTime = currentTime?.toFixed(0);
    console.log(fixedTime);
    // @ts-ignore
    if (fixedTime == 8) {
      highlightShopIcon();
    }
    // @ts-ignore
    if (fixedTime === 11) {
      highlightGamesIcon();
    }
  }

  function highlightShopIcon() {
    const shopIcon = document.querySelector(".header__bottom-main--Shop");
    shopIcon?.classList.add("highlightPulse");
    setTimeout(() => {
      shopIcon?.classList.remove("highlightPulse");
    }, 2500);
  }

  function highlightGamesIcon() {
    const gamesContent = document.querySelector(
      ".header__top-bg.header__top-left-bg"
    );
    gamesContent?.classList.add("highlightPulse");
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
