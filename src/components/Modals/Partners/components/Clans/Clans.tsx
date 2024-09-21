import { useState } from "react";
import { CuttedButton } from "../../../../../ui/CuttedButton/CuttedButton";
import "./styles/Clans.css";
import safeImg from "./img/Safe.svg";
import cupImg from "./img/cup.svg";
import tonImg from "./img/ton.svg";
import { useDrawer } from "../../../../../context/DrawerContext";
import { useTranslation } from "react-i18next";

type ClansProps = {
  handleOuterPills: (pillType: string) => void;
};

export function Clans({ handleOuterPills }: ClansProps) {
  const { t } = useTranslation();
  const { openDrawer } = useDrawer();
  const mockClan = {
    name: "MY CLAN NAME",
    balance: "123K AKRON",
    victories: "12",
    awards: "12345.34",
  };

  const [myClan] = useState<typeof mockClan | null>(null);
  const [isClanOwner] = useState(false);
  const [ableToCreate] = useState(true);

  const comingSoon = true;
  return (
    <div className="clans">
      <div className="tasks modalComingSoon">
        <div className="modalComingSoon__title">coming soon...</div>
        <div className="modalComingSoon__text">
          {t("partnersModal.clansTab.comingSoonText")}
        </div>
      </div>
      {!comingSoon ? (
        <div>
          {myClan ? (
            <>
              <div className="clans__title">
                {t("partnersModal.clansTab.youAreClanMember")}: {myClan.name}
              </div>
              <div className="clans__clanBalance">
                <div className="clans__clanBalance-main">
                  <div className="clans__clanBalance-main-block">
                    <img
                      src={safeImg}
                      alt="playersImg"
                      className="clans__clanBalance-main-block-img"
                    />
                    <div className="clans__clanBalance-main-block-info">
                      <div className="clans__clanBalance-main-block-info-key">
                        {t("partnersModal.clansTab.clanBalance")}:
                      </div>
                      <div className="clans__clanBalance-main-block-info-value">
                        {myClan.balance}
                      </div>
                    </div>
                  </div>

                  <CuttedButton
                    className="clans__clanBalance-main-requestBtn"
                    text="пополнить"
                    size="small"
                    callback={(e) => {
                      e.stopPropagation();
                      openDrawer!("connectWallet");
                    }}
                  />
                </div>
              </div>
              <div className="clans__blocks">
                <div className="clans__blocks__item">
                  <div className="clans__blocks__item-text">
                    <div className="clans__blocks__item-text-key">
                      {t("partnersModal.clansTab.victories")}:
                    </div>
                    <div className="clans__blocks__item-text-value">
                      {myClan.victories}
                    </div>
                  </div>
                  <img
                    src={cupImg}
                    alt="icon"
                    className="clans__blocks__item-img"
                  />
                </div>

                <div className="clans__blocks__item">
                  <div className="clans__blocks__item-text">
                    <div className="clans__blocks__item-text-key">
                      {t("partnersModal.clansTab.awards")}:
                    </div>
                    <div className="clans__blocks__item-text-value">
                      {myClan.awards}
                    </div>
                  </div>
                  <img
                    src={tonImg}
                    alt="icon"
                    className="clans__blocks__item-img"
                  />
                </div>
              </div>

              {isClanOwner ? (
                <div className="clans__ownerFooter">
                  <CuttedButton
                    className="clans__footerBtn"
                    text={t("partnersModal.clansTab.clanRequests")}
                    size="small"
                    callback={(e) => {
                      e.stopPropagation();
                      handleOuterPills("CLAN_REQUESTS");
                    }}
                  />
                  <CuttedButton
                    className="clans__footerBtn"
                    text={t("partnersModal.clansTab.clanMembers")}
                    size="small"
                    callback={(e) => {
                      e.stopPropagation();
                      handleOuterPills("CLAN_MEMBERS");
                    }}
                  />
                </div>
              ) : (
                <CuttedButton
                  className="clans__footerBtn"
                  text={t("partnersModal.clansTab.clansList")}
                  size="small"
                  callback={(e) => {
                    e.stopPropagation();
                    handleOuterPills("JOIN_CLAN");
                  }}
                />
              )}
            </>
          ) : (
            <>
              <div className="clans__title">
                {t("partnersModal.clansTab.youAreNotInAClan")}
              </div>

              <CuttedButton
                className="clans__joinBtn"
                text={t("partnersModal.clansTab.joinClan")}
                size="small"
                callback={(e) => {
                  e.stopPropagation();
                  handleOuterPills("JOIN_CLAN");
                }}
              />

              <div className="clans__footer">
                <CuttedButton
                  className={`clans__footer-createBtn ${
                    ableToCreate ? "" : "halfTransparent"
                  }`}
                  text={t("partnersModal.clansTab.createClan")}
                  size="small"
                  callback={(e) => {
                    e.stopPropagation();
                    handleOuterPills("CREATE_CLAN");
                  }}
                />

                <div className="clans__footer-text">
                  {t("partnersModal.clansTab.createClanConditionText")}
                </div>
              </div>
            </>
          )}{" "}
        </div>
      ) : null}
    </div>
  );
}
