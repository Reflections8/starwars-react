import { ReactNode, createContext, useContext, useState } from "react";
import { Drawer } from "../ui/Drawer/Drawer";

type DrawerProviderProps = {
  children: ReactNode;
};

type DrawerContextProps = {
  isOpen: boolean;
  drawerType: string;
  openDrawer: (type: string) => void;
  closeDrawer: () => void;
  drawerPosition: string;
};

const DrawerContext = createContext<Partial<DrawerContextProps>>({});

export function DrawerProvider({ children }: DrawerProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [drawerType, setDrawerType] = useState("");
  const [drawerPosition, setDrawerPosition] = useState("top");

  const openDrawer = (type: string, position: "top" | "bottom" = "bottom") => {
    setDrawerPosition(position);
    setDrawerType(type);
    setIsOpen(true);
  };

  const closeDrawer = () => {
    setIsOpen(false);
  };

  return (
    <DrawerContext.Provider
      value={{ isOpen, drawerType, openDrawer, closeDrawer, drawerPosition }}
    >
      {children}
      <Drawer isOpen={isOpen} />
    </DrawerContext.Provider>
  );
}

export const useDrawer = () => useContext(DrawerContext);
