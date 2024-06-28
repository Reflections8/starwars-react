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
  openModal: (type: string) => void;
  closeModal: () => void;
};

const ModalContext = createContext<Partial<ModalContextProps>>({});

export function ModalProvider({ children }: ModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState("");
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

  const openModal = (type: string) => {
    setModalType(type);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <ModalContext.Provider value={{ isOpen, modalType, openModal, closeModal }}>
      {children}
      <Modal isOpen={isOpen} />
    </ModalContext.Provider>
  );
}

export const useModal = () => useContext(ModalContext);
