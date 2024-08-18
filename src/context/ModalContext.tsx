/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Modal } from "../ui/Modal/Modal";
import { useDrawer } from "./DrawerContext";

type ModalProviderProps = {
  children: ReactNode;
};

type ModalContextProps = {
  isOpen: boolean;
  modalType: string;
  activePillProp?: number;
  openModal: (type: string, activePillProp?: number) => void;
  closeModal: () => void;
};

const ModalContext = createContext<Partial<ModalContextProps>>({});

export function ModalProvider({ children }: ModalProviderProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [modalType, setModalType] = useState("shipsArrangement2");
  const [activePillProp, setActivePillProp] = useState(0);
  const { isOpen: drawerIsOpen } = useDrawer();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const modalElement = document.querySelector(".modal");

      // @ts-ignore
      const clickOnDrawer = !!event.target.closest(".drawerBg");
      if (
        modalElement &&
        !modalElement.contains(event.target as Node) &&
        !clickOnDrawer
      ) {
        closeModal();
      }
    };

    if (isOpen) {
      setTimeout(() => {
        document.addEventListener("click", handleClickOutside);
      }, 0);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen, drawerIsOpen]);

  const openModal = (type: string, pillIndex: number = 0) => {
    setModalType(type);
    setActivePillProp(pillIndex);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setActivePillProp(0);
  };

  return (
    <ModalContext.Provider
      value={{ isOpen, modalType, activePillProp, openModal, closeModal }}
    >
      {children}
      <Modal isOpen={isOpen} />
    </ModalContext.Provider>
  );
}

export const useModal = () => useContext(ModalContext);
