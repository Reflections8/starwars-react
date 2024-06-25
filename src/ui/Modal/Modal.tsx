/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ChooseGame } from "../../components/Modals/ChooseGame/ChooseGame";
import { Shop } from "../../components/Modals/Shop/Shop";
import { Tasks } from "../../components/Modals/Tasks/Tasks";
import { Tournament } from "../../components/Modals/Tournament/Tournament";
import { useModal } from "../../context/ModalContext";
import { CupIcon } from "../../icons/Modals/Cup";
import { GamepadIcon } from "../../icons/Modals/Gamepad";
import { StoreIcon } from "../../icons/Modals/Store";
import { TasksIcon } from "../../icons/Modals/Tasks";
import modalBodyBorderBottom from "./img//modal-body-border-title.svg";
import textureBg from "./img/bg-texture.svg";
import modalBodyCloseIcon from "./img/close-bg.svg";
import modalBodyBgShort from "./img/modal-body-short.png";
import modalBodyBg from "./img/modal-body.png";
import modalHeaderIconBg from "./img/modal-header-icon-wrapper.png";
import modalHeaderBg from "./img/modal-header.png";
import "./styles/modal.css";

type ModalProps = {
  isOpen: boolean;
};

export function Modal({ isOpen }: ModalProps) {
  const { closeModal, modalType } = useModal();
  const shortModalBody = modalType === "chooseGame";

  const modalContentType = {
    chooseGame: {
      title: "Выбор игры:",
      icon: <GamepadIcon />,
      component: <ChooseGame />,
    },
    shop: {
      title: "Магазин",
      icon: <StoreIcon />,
      component: <Shop />,
    },
    tournament: {
      title: "Турнир",
      icon: <CupIcon />,
      component: <Tournament />,
    },
    tasks: {
      title: "Задания",
      icon: <TasksIcon />,
      component: <Tasks />,
    },
  };

  return (
    <div
      className={`modalBg ${!isOpen ? "modalBg--Hidden" : ""} ${
        shortModalBody ? "modalBg--Short" : ""
      }`}
    >
      <img
        src={textureBg}
        alt="texture"
        className="modalBg__textureBg modalBg__textureBg--Left"
      />
      <img
        src={textureBg}
        alt="texture"
        className="modalBg__textureBg modalBg__textureBg--Right"
      />

      <div className="modal">
        {/* HEADER */}
        <div className="modal__header">
          <img
            src={modalHeaderBg}
            alt="modal-header-bg"
            className="modal__header-bg"
          />

          <img
            src={modalHeaderIconBg}
            alt="modal-header-icon-bg"
            className="modal__header-iconBg"
          />

          <div className="modal__header-iconWrapper">
            {modalContentType[modalType as keyof typeof modalContentType]?.icon}
          </div>
        </div>

        {/* BODY */}
        <div
          className={`modal__body ${
            shortModalBody ? `modal__body--Short` : ""
          }`}
        >
          <img
            src={shortModalBody ? modalBodyBgShort : modalBodyBg}
            alt="modal-body"
            className="modal__body-bg"
          />

          <div className="modal__body-top">
            <button className="modal__body-top-closeBtn" onClick={closeModal}>
              <img
                src={modalBodyCloseIcon}
                alt="closeIcon"
                className="modal__body-top-closeBtn-bg"
              />
              <span className="modal__body-top-closeBtn-text">Закрыть</span>
            </button>

            <div className="modal__body-top-title">
              {
                modalContentType[modalType as keyof typeof modalContentType]
                  ?.title
              }
            </div>

            <img
              src={modalBodyBorderBottom}
              alt="border-bottom"
              className="modal__body-top__borderBottom"
            />
          </div>

          {
            modalContentType[modalType as keyof typeof modalContentType]
              ?.component
          }
        </div>
      </div>
    </div>
  );
}
