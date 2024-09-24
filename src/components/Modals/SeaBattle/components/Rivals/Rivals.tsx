import { useEffect, useState } from "react";
import { CryptoButtons } from "../../../../../ui/CryptoButtons/CryptoButtons";
import arrowIcon from "./img/arrow.svg";
import fightIcon from "./img/fight.svg";

import { useBattleships } from "../../../../../context/BattleshipsContext";
import { useDrawer } from "../../../../../context/DrawerContext";
import { CuttedButton } from "../../../../../ui/CuttedButton/CuttedButton";
import "./styles/Rivals.css";
import { BetTypeEnum, BetTypeIconEnum } from "../../types/enum";
import { useModal } from "../../../../../context/ModalContext";
import { useTranslation } from "react-i18next";

export function Rivals() {
  const { t } = useTranslation();
  const { openModal } = useModal();
  const { openDrawer } = useDrawer();
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
    joinedRoom,
    setJoinedRoom,
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

    sendMessage({
      type: "create_room",
      message: {
        room_name: friendsLogin,
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

  useEffect(() => {
    if (joinedRoom) {
      openModal!("shipsArrangement2");
      setJoinedRoom("");
    }
  }, [joinedRoom]);

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
          {rooms?.map((item: any, index: number) => {
            return (
              <div className="rivals__list-item" key={index}>
                <div className="rivals__list-item-start">
                  <img
                    src={"#"}
                    alt="avatar"
                    className="rivals__list-item-start-ava"
                  />
                  <div className="rivals__list-item-start-login">
                    <div className="rivals__list-item-start-login-key">
                      {t("battleshipsModal.rivalsTab.login")}:
                    </div>
                    <a
                      href={item.player}
                      className="rivals__list-item-start-login-value"
                    >
                      {item.room_name}
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
                      setRoomName(item.room_name);
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
                  setFriendsLogin(e.target.value);
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
                  setBet(Number(e.target.value));
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

          {/* TODO: КНОПКУ УБРАТЬ*/}
          <button
            onClick={(e) => {
              e.stopPropagation();
              sendMessage({
                type: "deny_battle",
                message: {
                  room_name: friendsLogin,
                },
              });
              sendMessage({
                type: "give_up",
                message: {
                  room_name: friendsLogin,
                },
              });
            }}
          >
            СДАТЬСЯ TEST
          </button>
        </div>
      ) : null}
    </div>
  );
}
