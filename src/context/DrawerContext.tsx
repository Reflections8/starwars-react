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
};

const DrawerContext = createContext<Partial<DrawerContextProps>>({});

export function DrawerProvider({ children }: DrawerProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [drawerType, setDrawerType] = useState("");

  const openDrawer = (type: string) => {
    setDrawerType(type);
    setIsOpen(true);
  };

  const closeDrawer = () => {
    setIsOpen(false);
  };

  return (
    <DrawerContext.Provider
      value={{ isOpen, drawerType, openDrawer, closeDrawer }}
    >
      {children}
      <Drawer isOpen={isOpen} />
    </DrawerContext.Provider>
  );
}

export const useDrawer = () => useContext(DrawerContext);
