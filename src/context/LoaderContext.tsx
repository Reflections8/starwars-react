/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ReactNode, createContext, useContext, useState } from "react";

type LoaderProviderProps = {
  children: ReactNode;
};

type LoaderContextProps = {
  isLoading: boolean;
  setIsLoading: (state: boolean) => void;
  sessionInteracted: boolean;
  setSessionInteracted: (state: boolean) => void;
  tutorialClicked: boolean;
  setTutorialClicked: (state: boolean) => void;
};

const LoaderContext = createContext<Partial<LoaderContextProps>>({});

export function LoaderProvider({ children }: LoaderProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [sessionInteracted, setSessionInteracted] = useState(false);
  const [tutorialClicked, setTutorialClicked] = useState(false);

  return (
    <LoaderContext.Provider
      value={{
        isLoading,
        setIsLoading,
        sessionInteracted,
        setSessionInteracted,
        tutorialClicked,
        setTutorialClicked,
      }}
    >
      {children}
      {/* <LoadingModal isOpen={isLoading} /> */}
    </LoaderContext.Provider>
  );
}

export const useLoader = () => useContext(LoaderContext);
