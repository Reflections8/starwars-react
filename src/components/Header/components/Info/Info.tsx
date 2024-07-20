import cornerImg from "../../../../pages/home/img/corner.svg";
import infoIcon from "../../../../pages/home/img/info.svg";
import "../../styles/Info.css";

import { useModal } from "../../../../context/ModalContext";

export function Info() {
  const { openModal } = useModal();
  return (
    <div className="info">
      <div
        className="info__button"
        onClick={() => {
          openModal!("currentStat");
        }}
      >
        <img src={cornerImg} alt="corner" className="info__button-corner--1" />
        <img src={cornerImg} alt="corner" className="info__button-corner--2" />
        <img src={cornerImg} alt="corner" className="info__button-corner--3" />
        <img src={cornerImg} alt="corner" className="info__button-corner--4" />

        <img src={infoIcon} alt="info" className="info__button-icon" />
        <div className="info__button-text">инфо</div>
      </div>
    </div>
  );
}
