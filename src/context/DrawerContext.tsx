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
    text?: string,
    button?: ReactNode | null
  ) => void;
  closeDrawer: () => void;
  drawerPosition: string;
  drawerText: string;
  button?: ReactNode | null;
};

const DrawerContext = createContext<Partial<DrawerContextProps>>({});

export function DrawerProvider({ children }: DrawerProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [drawerType, setDrawerType] = useState("");
  const [drawerPosition, setDrawerPosition] = useState("bottom");
  const [drawerText, setDrawerText] = useState("");
  const [button, setButton] = useState<ReactNode | null>(null);

  const openDrawer = (
    type: string,
    position: "top" | "bottom" = "bottom",
    text?: string,
    argsButton?: ReactNode
  ) => {
    setDrawerText(text || "");
    setDrawerPosition(position);
    setDrawerType(type);
    setIsOpen(true);
    setButton(argsButton || null);
  };

  const closeDrawer = () => {
    setIsOpen(false);
    setDrawerText("");
    setButton(null);
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
        button,
      }}
    >
      {children}
    </DrawerContext.Provider>
  );
}

export const useDrawer = () => useContext(DrawerContext);
