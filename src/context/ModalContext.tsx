import { ReactNode, createContext, useContext, useState } from "react";
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
