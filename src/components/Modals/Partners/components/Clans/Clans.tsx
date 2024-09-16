import { useState } from "react";
import { CuttedButton } from "../../../../../ui/CuttedButton/CuttedButton";
import "./styles/Clans.css";
import safeImg from "./img/Safe.svg";
import cupImg from "./img/cup.svg";
import tonImg from "./img/ton.svg";
import { useDrawer } from "../../../../../context/DrawerContext";

type ClansProps = {
  handleOuterPills: (pillType: string) => void;
};

export function Clans({ handleOuterPills }: ClansProps) {
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
          следите за новостями о кланах в нашем ТГ канале
        </div>
      </div>
      { !comingSoon ?
          <div>
        {myClan ? (
            <>
              <div className="clans__title">Вы участник клана {myClan.name}</div>
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
                        баланс клана:
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
                    <div className="clans__blocks__item-text-key">побед::</div>
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
                    <div className="clans__blocks__item-text-key">наград:</div>
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
                        text="заявки в клан"
                        size="small"
                        callback={(e) => {
                          e.stopPropagation();
                          handleOuterPills("CLAN_REQUESTS");
                        }}
                    />
                    <CuttedButton
                        className="clans__footerBtn"
                        text="состав клана"
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
                      text="список кланов"
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
              <div className="clans__title">Вы не находитесь в клане</div>

              <CuttedButton
                  className="clans__joinBtn"
                  text="вступить в клан"
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
                    text="создать клан"
                    size="small"
                    callback={(e) => {
                      e.stopPropagation();
                      handleOuterPills("CREATE_CLAN");
                    }}
                />

                <div className="clans__footer-text">
                  создавать кланы смогут юзеры только с структурой например 1000 тон
                  или 100 активных участников
                </div>
              </div>
            </>
        )} </div>: null }
    </div>
  );
}
