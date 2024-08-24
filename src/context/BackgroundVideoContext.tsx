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
};

const BackgroundVideoContext = createContext<
  Partial<BackgroundVideoContextProps>
>({});

export function BackgroundVideoProvider({
  children,
}: BackgroundVideoProviderProps) {
  const [readyState, setReadyState] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <BackgroundVideoContext.Provider
      value={{ readyState, setReadyState, activeVideo, setActiveVideo }}
    >
      {children}
    </BackgroundVideoContext.Provider>
  );
}

export const useBackgroundVideo = () => useContext(BackgroundVideoContext);
