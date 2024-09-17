import { ReactNode, createContext, useContext, useState } from "react";

type DrawerProviderProps = {
  children: ReactNode;
};

type DrawerContextProps = {
  isOpen: boolean;
  drawerType: string;
  openDrawer: (
    type: string,
    position?: "top" | "bottom",
    text?: string
  ) => void;
  closeDrawer: () => void;
  drawerPosition: string;
  drawerText: string;
};

const DrawerContext = createContext<Partial<DrawerContextProps>>({});

export function DrawerProvider({ children }: DrawerProviderProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [drawerType, setDrawerType] = useState("opponentFound");
  const [drawerPosition, setDrawerPosition] = useState("bottom");
  const [drawerText, setDrawerText] = useState("");

  const openDrawer = (
    type: string,
    position: "top" | "bottom" = "bottom",
    text?: string
  ) => {
    setDrawerText(text || "");
    setDrawerPosition(position);
    setDrawerType(type);
    setIsOpen(true);
  };

  const closeDrawer = () => {
    setIsOpen(false);
    setDrawerText("");
  };

  return (
    <DrawerContext.Provider
      value={{
        isOpen,
        drawerType,
        openDrawer,
        closeDrawer,
        drawerPosition,
        drawerText,
      }}
    >
      {children}
    </DrawerContext.Provider>
  );
}

export const useDrawer = () => useContext(DrawerContext);
