/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ReactNode, createContext, useContext, useState } from "react";

type BackgroundVideoProviderProps = {
  children: ReactNode;
};

type BackgroundVideoContextProps = {
  readyState: boolean;
  setReadyState: (state: boolean) => void;
  activeVideo: "1" | "2" | "3" | null;
  setActiveVideo: (state: any) => void;
  repeatCount: number;
  setRepeatCount: (state: number) => void;
  restartTutorial: () => void;
  sessionCount: number;
};

const BackgroundVideoContext = createContext<
  Partial<BackgroundVideoContextProps>
>({});

export function BackgroundVideoProvider({
  children,
}: BackgroundVideoProviderProps) {
  const [readyState, setReadyState] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);
  const [repeatCount, setRepeatCount] = useState(0);

  function restartTutorial() {
    setReadyState(true);
    // @ts-ignore
    setActiveVideo("2");
  }

  return (
    <BackgroundVideoContext.Provider
      value={{
        readyState,
        setReadyState,
        activeVideo,
        setActiveVideo,
        repeatCount,
        setRepeatCount,
        restartTutorial,
      }}
    >
      {children}
    </BackgroundVideoContext.Provider>
  );
}

export const useBackgroundVideo = () => useContext(BackgroundVideoContext);
