import { useEffect, useState } from "react";
import { CryptoButtons } from "../../../../../ui/CryptoButtons/CryptoButtons";
import arrowIcon from "./img/arrow.svg";
import fightIcon from "./img/fight.svg";

import { useTranslation } from "react-i18next";
import { useBattleships } from "../../../../../context/BattleshipsContext";
import { useDrawer } from "../../../../../context/DrawerContext";
import defaultAva from "../../../../../icons/no_avatar.png";
import { CuttedButton } from "../../../../../ui/CuttedButton/CuttedButton";
import { useUserData } from "../../../../../UserDataService";
import { fetchUserPhoto } from "../../service/sea-battle.service";
import { BetTypeEnum, BetTypeIconEnum } from "../../types/enum";
import { CurrentBalace } from "../CurrentBalance";
import "./styles/Rivals.css";

export function Rivals() {
  const { t } = useTranslation();
  const { openDrawer } = useDrawer();
  const { credits, tokens: akronix, tons } = useUserData();
  const [isCreatingDuel, setIsCreatingDuel] = useState(false);
  const [friendsLogin, setFriendsLogin] = useState("");
  const [bet, setBet] = useState(0);

  function handleDuelCreating(e: Event) {
    e.stopPropagation();
    setIsCreatingDuel(true);
  }

  const {
    activeCurrency,
    setActiveCurrency,
    rooms,
    loadRooms,
    createdRoom,
    setCreatedRoom,
    sendMessage,
    setRoomName,
    me,
  } = useBattleships();

  async function createRoom() {
    if (!friendsLogin) {
      openDrawer!(
        "rejected",
        "bottom",
        t("battleshipsModal.rivalsTab.enterLogin")
      );
      return;
    }

    if (!bet) {
      openDrawer!(
        "rejected",
        "bottom",
        t("battleshipsModal.rivalsTab.enterBetAmount")
      );
      return;
    }

    if (activeCurrency === "credits") {
      if (credits < bet) {
        openDrawer!(
          "rejected",
          "bottom",
          `${t("battleshipsModal.notEnoughCurrency")} (${activeCurrency})`
        );
        return;
      }
    }

    if (activeCurrency === "akronix") {
      if (akronix < bet) {
        openDrawer!(
          "rejected",
          "bottom",
          `${t("battleshipsModal.notEnoughCurrency")} (${activeCurrency})`
        );
        return;
      }
    }

    if (activeCurrency === "ton") {
      if (tons < bet) {
        openDrawer!(
          "rejected",
          "bottom",
          `${t("battleshipsModal.notEnoughCurrency")} (${activeCurrency})`
        );
        return;
      }
    }

    sendMessage({
      type: "invite_user",
      message: {
        username: friendsLogin.toLocaleLowerCase(),
        bet_type: BetTypeEnum[activeCurrency as keyof typeof BetTypeEnum],
        bet_amount: bet,
      },
    });
  }

  async function joinRoom(login: string) {
    setRoomName(login);
    sendMessage({
      type: "join_room",
      message: {
        room_name: login,
      },
    });
  }

  useEffect(() => {
    if (createdRoom.name) {
      setIsCreatingDuel(false);
      loadRooms();
      setCreatedRoom({ name: "" });
    }
  }, [createdRoom.name]);

  const [userPhotos, setUserPhotos] = useState({});

  useEffect(() => {
    const fetchPhotos = async () => {
      const photos = {};
      for (const item of rooms) {
        if (item.creator.username in userPhotos) return;

        const res = await fetchUserPhoto(item?.creator?.username);

        // @ts-ignore
        photos[item.creator.username] = res;
      }
      setUserPhotos(photos);
    };

    if (rooms?.length) {
      fetchPhotos();
    }
  }, [rooms]);

  return (
    <div className="rivals">
      <CryptoButtons
        activeOptions={["credits", "akronix", "ton"]}
        className="seaBattle__cryptoButtons"
        activeCurrency={activeCurrency}
        setActiveCurrency={setActiveCurrency}
      />

      {!isCreatingDuel ? (
        <div className="rivals__list">
          {/* ITEM NEW DUEL */}
          <div className="rivals__list-item rivals__list-item--New">
            <div className="rivals__list-item-start">
              <img
                src={fightIcon}
                alt="icon"
                className="rivals__list-item-start-icon"
              />
              <div className="rivals__list-item-start-info">
                <div className="rivals__list-item-start-info-key">
                  {t("battleshipsModal.rivalsTab.gameWithFriend")}
                </div>
                <div className="rivals__list-item-start-info-value">
                  {t("battleshipsModal.rivalsTab.createGeneralDuel")}
                </div>
              </div>
            </div>
            <div className="rivals__list-item-end">
              <CuttedButton
                className="rivals__list-item-end-btn"
                iconSrc={arrowIcon}
                callback={handleDuelCreating}
              />
            </div>
          </div>
          {rooms?.map((item: any) => {
            return (
              <div className="rivals__list-item" key={item?.room_name}>
                <div className="rivals__list-item-start">
                  {userPhotos[
                    item.creator.username as keyof typeof userPhotos
                  ] ? (
                    <img
                      src={
                        userPhotos[
                          item.creator.username as keyof typeof userPhotos
                        ]
                      }
                      alt=""
                      width="36px"
                      className="rivals__list-item-start-ava check-image"
                    />
                  ) : (
                    <img
                      src={defaultAva}
                      alt=""
                      width="36px"
                      className="rivals__list-item-start-avaDefault"
                    />
                  )}

                  <div className="rivals__list-item-start-login">
                    <div className="rivals__list-item-start-login-key">
                      {t("battleshipsModal.rivalsTab.login")}:
                    </div>
                    <a
                      href={item.player}
                      className="rivals__list-item-start-login-value"
                    >
                      {item?.creator?.username}
                    </a>
                  </div>
                  <div className="rivals__list-item-start-bet">
                    <div className="rivals__list-item-start-bet-key">
                      {t("battleshipsModal.rivalsTab.bet")}:
                    </div>
                    <div className="rivals__list-item-start-bet-value">
                      <img
                        src={BetTypeIconEnum[item.bet_type]}
                        alt="ton"
                        className="rivals__list-item-start-bet-value-icon"
                      />
                      <div className="rivals__list-item-start-bet-value-amount">
                        {item.bet_amount}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rivals__list-item-end">
                  <CuttedButton
                    callback={(e) => {
                      e.stopPropagation();
                      joinRoom(item.room_name);
                      //  setRoomName(item.room_name);
                      setRoomName(item?.creator?.username);
                    }}
                    size="small"
                    className={`rivals__list-item-end-btn ${
                      item.creator.username === me ? "halfTransparent" : ""
                    }`}
                    text={t("battleshipsModal.rivalsTab.duel")}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {isCreatingDuel ? (
        <div className="rivals__newDuel">
          <div className="rivals__newDuel__title">
            {t("battleshipsModal.rivalsTab.createDuelWithFriend")}!
          </div>

          <CurrentBalace
            activeCurrency={activeCurrency}
            credits={credits}
            akronix={akronix}
            tons={tons}
          />

          <div className="rivals__newDuel__inputBlock">
            <div className="rivals__newDuel__inputBlock-sup">
              <label className="rivals__newDuel__inputBlock-sup-label">
                1.{t("battleshipsModal.rivalsTab.friendsLogin")}:
              </label>
            </div>

            <div className="rivals__newDuel__inputBlock-inputWrapper">
              <input
                type="decimal"
                value={friendsLogin}
                onChange={(e) => {
                  const value = e.target.value;
                  const cleanedValue = value.startsWith("@")
                    ? value.slice(1)
                    : value;
                  setFriendsLogin(cleanedValue);
                }}
                className="rivals__newDuel__inputBlock-input"
              />
            </div>
          </div>

          <div className="rivals__newDuel__inputBlock">
            <div className="rivals__newDuel__inputBlock-sup">
              <label className="rivals__newDuel__inputBlock-sup-label">
                2.{t("battleshipsModal.rivalsTab.yourBet")}:
              </label>
            </div>

            <div className="rivals__newDuel__inputBlock-inputWrapper">
              <input
                type="decimal"
                value={bet}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    setBet(0);
                    return;
                  }
                  const numericValue = Number(value);
                  if (!isNaN(numericValue)) {
                    setBet(numericValue);
                  }
                }}
                className={`rivals__newDuel__inputBlock-input ${activeCurrency}`}
              />
              <div className="rivals__newDuel__inputBlock-postfix">
                {activeCurrency.toUpperCase()}
              </div>
            </div>
          </div>

          <CuttedButton
            callback={createRoom}
            className="rivals__newDuel__cuttedButton"
            text={t("battleshipsModal.rivalsTab.createDuel")}
          />
        </div>
      ) : null}
    </div>
  );
}
