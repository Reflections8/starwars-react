import "./styles/Info.css";
import img1 from "./img/1.svg";
import img2 from "./img/2.svg";
import img3 from "./img/3.svg";
import { useState } from "react";
import { CuttedButton } from "../../../../../ui/CuttedButton/CuttedButton";
import { useDrawer } from "../../../../../context/DrawerContext";

type InfoProps = {
  handleOuterPills: (pillType: string) => void;
};

export function Info({ handleOuterPills }: InfoProps) {
  const { openDrawer } = useDrawer();
  const [duels] = useState(1234);
  const [warriors] = useState(123);
  const [funds] = useState(12345.45);
  const [awards] = useState(12345.45);

  return (
    <div className="partnerInfoWrapper">
      <div className="partnerInfo">
        <div className="partnerInfo__item">
          <div className="partnerInfo__item-text">
            <div className="partnerInfo__item-text-key">дуэлей:</div>
            <div className="partnerInfo__item-text-value">{duels}</div>
          </div>
          <img src={img1} alt="icon" className="partnerInfo__item-img" />
        </div>

        <div className="partnerInfo__item">
          <div className="partnerInfo__item-text">
            <div className="partnerInfo__item-text-key">воинов:</div>
            <div className="partnerInfo__item-text-value">{warriors}</div>
          </div>
          <img src={img2} alt="icon" className="partnerInfo__item-img" />
        </div>

        <div className="partnerInfo__item">
          <div className="partnerInfo__item-text">
            <div className="partnerInfo__item-text-key">Средства::</div>
            <div className="partnerInfo__item-text-value">{funds}</div>
          </div>
          <img src={img3} alt="icon" className="partnerInfo__item-img" />
        </div>

        <div className="partnerInfo__item">
          <div className="partnerInfo__item-text">
            <div className="partnerInfo__item-text-key">Наград::</div>
            <div className="partnerInfo__item-text-value">{awards}</div>
          </div>
          <img src={img3} alt="icon" className="partnerInfo__item-img" />
        </div>
      </div>

      <div className="partnerInfoWrapper__footer">
        <CuttedButton
          text="пригласить друга"
          size="small"
          callback={(e) => {
            e.stopPropagation();
            openDrawer!("inviteFriend");
          }}
        />

        <CuttedButton
          text="список друзей"
          size="small"
          callback={(e) => {
            e.stopPropagation();
            handleOuterPills("FRIENDS_LIST");
          }}
        />
      </div>
    </div>
  );
}
