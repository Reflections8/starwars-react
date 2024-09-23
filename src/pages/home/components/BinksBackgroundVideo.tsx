import { useEffect, useRef } from "react";
import "../styles/binksBackgroundVideo.css";
import videoEng1 from "../video/eng/1.mp4";
import videoEng2 from "../video/eng/2.mp4";
import videoEng3 from "../video/eng/3.mp4";

import { useTranslation } from "react-i18next";
import videoRus1 from "../video/ru/1.mp4";
import videoRus2 from "../video/ru/2.mp4";
import videoRus3 from "../video/ru/3.mp4";
import { useModal } from "../../../context/ModalContext";

type BinksBackgroundVideoProps = {
  readyState: any;
  setReadyState: any;
  activeVideo: any;
  setActiveVideo: any;
  repeatCount: any;
};

export function BinksBackgroundVideo({
  readyState,
  setReadyState,
  activeVideo,
  setActiveVideo,
  repeatCount,
}: BinksBackgroundVideoProps) {
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);
  const videoRef3 = useRef<HTMLVideoElement>(null);

  const { i18n } = useTranslation();
  const { openModal } = useModal();

  const videoWithLocale = {
    ru: {
      video1: videoRus1,
      video2: videoRus2,
      video3: videoRus3,
    },
    en: {
      video1: videoEng1,
      video2: videoEng2,
      video3: videoEng3,
    },
  };

  useEffect(() => {
    setActiveVideo("1");
    setReadyState(false);
  }, [i18n.language]);

  useEffect(() => {
    const video1 = videoRef1.current;
    const video2 = videoRef2.current;
    const video3 = videoRef3.current;

    if (!readyState && video1 && video2 && video3) {
      video1?.pause();
      video1.muted = true;
      video1.load();

      video2.pause();
      video2.muted = true;
      video1.load();

      video3.pause();
      video3.muted = true;
      video3.load();
      2;
    }

    if (readyState) {
      if (activeVideo === "1" && video1 && video2 && video3) {
        video1.play().catch(console.error);
        video1.muted = false;
        video2.pause();
        video2.muted = true;
      }

      if (activeVideo === "2" && video1 && video2 && video3) {
        video1.pause();
        video1.muted = true;
        video2.play().catch(console.error);
        video2.muted = false;
      }

      if (activeVideo === "3" && video1 && video2 && video3) {
        video1.pause();
        video1.muted = true;
        video2.pause();
        video2.muted = true;
        video3.play().catch(console.error);
        video3.muted = false;
      }
    }
  }, [readyState, activeVideo, i18n.language, repeatCount]);

  useEffect(() => {
    let interval: any;
    if (videoRef1.current && activeVideo === "1") {
      interval = setInterval(() => {
        // @ts-ignore
        findTimeFunction(activeVideo, videoRef1.current?.currentTime);
      }, 1000);
    }

    if (videoRef2.current && activeVideo === "2") {
      interval = setInterval(() => {
        // @ts-ignore
        findTimeFunction(activeVideo, videoRef2.current?.currentTime);
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [activeVideo, i18n.language, repeatCount]);

  function handleTutorialDone() {
    const video2 = videoRef2.current;
    video2 && video2.pause();
    openModal!("binksDone");
  }

  useEffect(() => {
    console.log({ repeatCount, activeVideo, readyState });
    const video1 = videoRef1.current;
    const video2 = videoRef2.current;

    if (video1 && video2) {
      video1.pause();
      video1.muted = true;

      video2.pause();
      video2.muted = true;
      video2.load();
      video2.muted = false;
      video2.play();
    }
  }, [repeatCount]);

  function findTimeFunction(activeVideo: string, currentTime: number) {
    const fixedTime = currentTime?.toFixed(0) as any;

    if (i18n.language === "ru") {
      if (activeVideo === "1") {
        if (fixedTime == 13) {
          highlightElement("book");
        }
        if (fixedTime == 28) {
          highlightElement("book");
        }
      }

      if (activeVideo === "2") {
        if (fixedTime == 31) {
          highlightElement("shop");
        }
        if (fixedTime == 52) {
          highlightElement("tournaments");
        }
        if (fixedTime == 65) {
          highlightElement("options");
        }
        if (fixedTime == 78) {
          highlightElement("credits");
          highlightElement("akron");
          highlightElement("ton");
        }
        if (fixedTime == 93) {
          highlightElement("walletBinks");
        }
        if (fixedTime == 103) {
          highlightElement("playerBinks");
        }
        if (fixedTime == 116) {
          highlightElement("clansBinks");
        }
        if (fixedTime == 116) {
          highlightElement("metricsBinks");
        }
        if (fixedTime == 155) {
          highlightElement("games");
        }
        if (fixedTime == 193) {
          handleTutorialDone();
        }
      }
    }

    if (i18n.language === "en") {
      if (activeVideo === "1") {
        if (fixedTime == 11) {
          highlightElement("book");
        }
        if (fixedTime == 28) {
          highlightElement("book");
        }
      }

      if (activeVideo === "2") {
        if (fixedTime == 31) {
          highlightElement("shop");
        }
        if (fixedTime == 52) {
          highlightElement("tournaments");
        }
        if (fixedTime == 66) {
          highlightElement("options");
        }
        if (fixedTime == 78) {
          highlightElement("credits");
          highlightElement("akron");
          highlightElement("ton");
        }
        if (fixedTime == 93) {
          highlightElement("walletBinks");
        }
        if (fixedTime == 103) {
          highlightElement("playerBinks");
        }
        if (fixedTime == 116) {
          highlightElement("clansBinks");
        }
        if (fixedTime == 116) {
          highlightElement("metricsBinks");
        }
        if (fixedTime == 155) {
          highlightElement("games");
        }
        if (fixedTime == 193) {
          handleTutorialDone();
        }
      }
    }
  }

  function highlightElement(className: string) {
    const animationTime = {
      book: 5,
      shop: 18,
      tournaments: 8,
      options: 9,
      credits: 9,
      akron: 9,
      ton: 9,
      walletBinks: 7,
      playerBinks: 8,
      clansBinks: 23,
      metricsBinks: 7,
      games: 36,
    };

    const element = document.querySelector(`.highlighter.${className}`);
    element?.classList.add("active");
    setTimeout(() => {
      element?.classList.remove("active");
    }, animationTime[className as keyof typeof animationTime] * 1000 || 2500);

    const parentElement = document.querySelector(
      `.highlighterParent.${className}`
    );
    parentElement?.classList.add("pulsation");
    setTimeout(() => {
      parentElement?.classList.remove("pulsation");
    }, animationTime[className as keyof typeof animationTime] * 1000 || 2500);
  }

  return (
    <>
      <video
        ref={videoRef1}
        className={`binksBackgroundVideo ${
          activeVideo === "1" ? "active" : "hidden"
        }`}
        // @ts-ignore
        src={videoWithLocale[i18n.language].video1}
        muted
        preload="auto"
        playsInline
      ></video>

      <video
        ref={videoRef2}
        className={`binksBackgroundVideo ${
          activeVideo === "2" ? "active" : "hidden"
        }`}
        // @ts-ignore
        src={videoWithLocale[i18n.language].video2}
        muted
        preload="auto"
        playsInline
      ></video>

      <video
        ref={videoRef3}
        className={`binksBackgroundVideo ${
          activeVideo === "3" ? "active" : "hidden"
        }`}
        // @ts-ignore
        src={videoWithLocale[i18n.language].video3}
        muted
        preload="auto"
        loop
        playsInline
      ></video>
    </>
  );
}
