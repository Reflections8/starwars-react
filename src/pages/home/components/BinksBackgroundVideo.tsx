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
import { useUserData } from "../../../UserDataService";

type BinksBackgroundVideoProps = {
  readyState: any;
  setReadyState: any;
  activeVideo: any;
  setActiveVideo: any;
  repeatCount: number;
  sessionsCount: number;
};

export function BinksBackgroundVideo({
  readyState,
  setReadyState,
  activeVideo,
  setActiveVideo,
  repeatCount,
  sessionsCount,
}: BinksBackgroundVideoProps) {
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);
  const videoRef3 = useRef<HTMLVideoElement>(null);

  const { characters, soundSetting } = useUserData();
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
    setActiveVideo(null);
    setReadyState(false);
  }, [i18n.language]);

  function stopVideo(index: string) {
    const video1 = videoRef1.current;
    const video2 = videoRef2.current;
    const video3 = videoRef3.current;

    if (video1 && video2 && video3) {
      if (index === "1") {
        video1.pause();
        video1.muted = true;
        video1.currentTime = 0;
      }
      if (index === "2") {
        video2.pause();
        video2.muted = true;
        video2.currentTime = 0;
      }
      if (index === "3") {
        video3.pause();
        video3.muted = true;
        video3.currentTime = 0;
      }
    }
  }

  function muteVideos() {
    const video1 = videoRef1.current;
    const video2 = videoRef2.current;
    const video3 = videoRef3.current;
    if (video1 && video2 && video3) {
      video1.muted = true;
      video2.muted = true;
      video3.muted = true;
    }
  }

  function unmuteVideos() {
    const video1 = videoRef1.current;
    const video2 = videoRef2.current;
    const video3 = videoRef3.current;
    if (video1 && video2 && video3) {
      video1.muted = false;
      video2.muted = false;
      video3.muted = false;
    }
  }

  function stopAllVideos() {
    stopVideo("1");
    stopVideo("2");
    stopVideo("3");
  }

  useEffect(() => {
    if (!activeVideo) {
      stopAllVideos();
    }

    if (activeVideo === "1") {
      stopVideo("2");
      stopVideo("3");
    }
    if (activeVideo === "2") {
      stopVideo("1");
      stopVideo("3");
    }
    if (activeVideo === "3") {
      stopVideo("1");
      stopVideo("2");
    }
  }, [activeVideo]);

  useEffect(() => {
    if (soundSetting) unmuteVideos();
    if (!soundSetting) muteVideos();
  }, [
    soundSetting,
    readyState,
    activeVideo,
    i18n.language,
    repeatCount,
    videoRef1.current,
    videoRef2.current,
    videoRef3.current,
  ]);

  // Чтобы видео не воспроизводилось при маунте и появлении ref.current
  useEffect(() => {
    stopAllVideos();
  }, [videoRef1.current, videoRef2.current, videoRef3.current]);

  useEffect(() => {
    const video1 = videoRef1.current;
    const video2 = videoRef2.current;
    const video3 = videoRef3.current;

    if (!readyState && video1 && video2 && video3) {
      stopAllVideos();
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

    if (!soundSetting) muteVideos();
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
    // Нет НФТ, 1-5
    if (!characters.length && sessionsCount <= 2) {
      stopVideo("2");
      openModal!("binksDone");
      return;
    }

    // Нет НФТ, 6+ (убрал модалку binksDone если это уже 6+ сессии)
    if (!characters.length && sessionsCount > 2) {
      stopVideo("2");
      setActiveVideo("3");
      return;
    }

    // Если есть НФТ, 1-5
    if (characters.length && sessionsCount <= 2) {
      stopAllVideos();
      setReadyState(false);
      setActiveVideo(null);
      return;
    }

    // Если есть НФТ, 6+
    if (characters.length && sessionsCount > 2) {
      stopAllVideos();
      setReadyState(false);
      setActiveVideo(null);
      return;
    }

    console.log("UNHANDLED TUTORIAL ENDING");
    openModal!("binksDone");

    //  if (repeatCount === 0) {
    //    // TODO: пока сделал так, что если в рамках сессии это первое проигрывание обучения, то показывать модалку...
    //    stopVideo("2");
    //    console.log("repeatCount === 0");
    //    openModal!("binksDone");
    //  }

    //  // TODO: ...иначе сразу переключаем на 3-е видео
    //  if (repeatCount > 0) {
    //    stopVideo("2");
    //    setActiveVideo("3");
    //  }
  }

  useEffect(() => {
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
        if (fixedTime == 143) {
          highlightElement("metricsBinks");
        }
        if (fixedTime == 155) {
          highlightElement("games");
        }
        if (fixedTime == 191) {
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
        if (fixedTime == 143) {
          highlightElement("metricsBinks");
        }
        if (fixedTime == 155) {
          highlightElement("games");
        }
        if (fixedTime == 191) {
          handleTutorialDone();
        }
      }
    }
  }

  function highlightElement(className: string) {
    const animationTime = {
      book: 5,
      shop: i18n.language === "ru" ? 18 : 16,
      tournaments: i18n.language === "ru" ? 8 : 10,
      options: 9,
      credits: 9,
      akron: 9,
      ton: 9,
      walletBinks: 7,
      playerBinks: i18n.language === "ru" ? 8 : 10,
      clansBinks: i18n.language === "ru" ? 23 : 21,
      metricsBinks: 7,
      games: i18n.language === "ru" ? 36 : 38,
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
        loop
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
