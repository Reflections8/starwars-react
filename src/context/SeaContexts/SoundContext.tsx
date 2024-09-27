/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type SoundProviderProps = {
  children: ReactNode;
};

type SoundContextProps = any;

const SoundContext = createContext<Partial<SoundContextProps>>({});

export function SoundProvider({ children }: SoundProviderProps) {
  const audioBgRef = useRef(null);
  const shotSuccessAudioRef = useRef(null);
  const shotMissAudioRef = useRef(null);
  const shotKilledAudioRef = useRef(null);
  const shotAudioRef = useRef(null);

  const playBeamSound = () => {
    if (!shotAudioRef.current) return;
    // @ts-ignore
    shotAudioRef.current.pause();
    // @ts-ignore
    shotAudioRef.current.currentTime = 0;
    // @ts-ignore
    shotAudioRef.current.play().catch();
  };

  const playSuccessShotAudio = () => {
    if (!shotSuccessAudioRef.current) return;
    // @ts-ignore
    shotSuccessAudioRef.current.pause();
    // @ts-ignore
    shotSuccessAudioRef.current.currentTime = 0;
    // @ts-ignore
    shotSuccessAudioRef.current.play().catch();
  };
  const playMissedShotAudio = () => {
    if (!shotMissAudioRef.current) return;
    // @ts-ignore
    shotMissAudioRef.current.pause();
    // @ts-ignore
    shotMissAudioRef.current.currentTime = 0;
    // @ts-ignore
    shotMissAudioRef.current.play().catch();
  };
  const playKilledShopAudio = () => {
    if (!shotKilledAudioRef.current) return;
    // @ts-ignore
    shotKilledAudioRef.current.pause();
    // @ts-ignore
    shotKilledAudioRef.current.currentTime = 0;
    // @ts-ignore
    shotKilledAudioRef.current.play().catch();
  };

  const startBackgroundAudio = () => {
    console.log("START_BG_AUDIO_CALLED");
    if (audioBgRef.current) {
      // @ts-ignore
      audioBgRef.current.pause();
      // @ts-ignore
      audioBgRef.current.currentTime = 0;
      // @ts-ignore
      audioBgRef.current.play().catch();
    }
  };

  const stopBackgroundAudio = () => {
    console.log("STOOOOP_BG_AUDIO_CALLED");
    if (audioBgRef.current) {
      // @ts-ignore
      audioBgRef.current.pause();
      // @ts-ignore
      audioBgRef.current.currentTime = 0;
    }
  };

  const blastIt = (isHit: string) => {
    playBeamSound();
    setTimeout(() => {
      if (isHit === "success") playSuccessShotAudio();
      else if (isHit === "fail") playMissedShotAudio();
      else if (isHit === "dead") playKilledShopAudio();
    }, 200);
  };

  return (
    <SoundContext.Provider
      value={{
        shotSuccessAudioRef,
        shotMissAudioRef,
        shotKilledAudioRef,
        shotAudioRef,
        audioBgRef,
        blastIt,
        startBackgroundAudio,
        stopBackgroundAudio,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export const useSound = () => useContext(SoundContext);
