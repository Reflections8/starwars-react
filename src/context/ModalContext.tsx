import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Modal } from "../ui/Modal/Modal";

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const modalElement = document.querySelector(".modal");
      if (modalElement && !modalElement.contains(event.target as Node)) {
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
  }, [isOpen]);

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
