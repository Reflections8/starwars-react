/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ReactNode, createContext, useContext, useState } from "react";

type LoaderProviderProps = {
  children: ReactNode;
};

type LoaderContextProps = {
  isLoading: boolean;
  setIsLoading: (state: boolean) => void;
};

const LoaderContext = createContext<Partial<LoaderContextProps>>({});

export function LoaderProvider({ children }: LoaderProviderProps) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoaderContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
      {/* <LoadingModal isOpen={isLoading} /> */}
    </LoaderContext.Provider>
  );
}

export const useLoader = () => useContext(LoaderContext);
