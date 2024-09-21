import "./styles/Info.css";
import img1 from "./img/1.svg";
import img2 from "./img/2.svg";
import img3 from "./img/3.svg";
import { useState } from "react";
import { CuttedButton } from "../../../../../ui/CuttedButton/CuttedButton";
import { useDrawer } from "../../../../../context/DrawerContext";
import { useUserData } from "../../../../../UserDataService.tsx";
import { useTranslation } from "react-i18next";

type InfoProps = {
  handleOuterPills: (pillType: string) => void;
};

export function Info({ handleOuterPills }: InfoProps) {
  const { t } = useTranslation();
  const { refInfo } = useUserData();
  const { openDrawer } = useDrawer();
  const [duels] = useState(refInfo?.invited);
  const [warriors] = useState(refInfo?.invited_ranked);
  const [funds] = useState(refInfo?.total_deposited);
  const [awards] = useState(refInfo?.total_rewards);

  return (
    <div className="partnerInfoWrapper">
      <div className="partnerInfo">
        <div className="partnerInfo__item">
          <div className="partnerInfo__item-text">
            <div className="partnerInfo__item-text-key">
              {t("partnersModal.infoTab.partners")}:
            </div>
            <div className="partnerInfo__item-text-value">{duels}</div>
          </div>
          <img src={img1} alt="icon" className="partnerInfo__item-img" />
        </div>

        <div className="partnerInfo__item">
          <div className="partnerInfo__item-text">
            <div className="partnerInfo__item-text-key">
              {t("partnersModal.infoTab.characters")}:
            </div>
            <div className="partnerInfo__item-text-value">{warriors}</div>
          </div>
          <img src={img2} alt="icon" className="partnerInfo__item-img" />
        </div>

        <div className="partnerInfo__item">
          <div className="partnerInfo__item-text">
            <div className="partnerInfo__item-text-key">
              {t("partnersModal.infoTab.buys")}:
            </div>
            <div className="partnerInfo__item-text-value">{funds}</div>
          </div>
          <img src={img3} alt="icon" className="partnerInfo__item-img" />
        </div>

        <div className="partnerInfo__item">
          <div className="partnerInfo__item-text">
            <div className="partnerInfo__item-text-key">
              {t("partnersModal.infoTab.awards")}:
            </div>
            <div className="partnerInfo__item-text-value">{awards}</div>
          </div>
          <img src={img3} alt="icon" className="partnerInfo__item-img" />
        </div>
      </div>

      <div className="partnerInfoWrapper__footer">
        <CuttedButton
          text={t("partnersModal.infoTab.inviteFriends")}
          size="small"
          callback={(e) => {
            e.stopPropagation();
            openDrawer!("inviteFriend");
          }}
        />

        <CuttedButton
          text={t("partnersModal.infoTab.friendsList")}
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
