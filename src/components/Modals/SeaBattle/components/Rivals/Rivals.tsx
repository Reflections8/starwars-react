import { useEffect, useState } from "react";
import { CryptoButtons } from "../../../../../ui/CryptoButtons/CryptoButtons";
import arrowIcon from "./img/arrow.svg";
import fightIcon from "./img/fight.svg";

import { useBattleships } from "../../../../../context/BattleshipsContext";
import { useDrawer } from "../../../../../context/DrawerContext";
import { CuttedButton } from "../../../../../ui/CuttedButton/CuttedButton";
import { fetchRooms } from "../../service/sea-battle.service";
import "./styles/Rivals.css";
import { BetTypeEnum, BetTypeIconEnum } from "../../types/enum";
import { Room } from "../../types/types";
import { useModal } from "../../../../../context/ModalContext";

export function Rivals() {
  const { openModal } = useModal();
  const { openDrawer } = useDrawer();
  const [isCreatingDuel, setIsCreatingDuel] = useState(false);
  const [friendsLogin, setFriendsLogin] = useState("");
  const [bet, setBet] = useState(0);

  const [activeCurrency, setActiveCurrency] = useState("credits");
  const [rooms, setRooms] = useState<Room[]>([]);

  function handleDuelCreating(e: Event) {
    e.stopPropagation();
    setIsCreatingDuel(true);
  }

  const {
    createdRoom,
    setCreatedRoom,
    joinedRoom,
    setJoinedRoom,
    sendMessage,
    setRoomName,
  } = useBattleships();

  async function createRoom() {
    if (!friendsLogin) {
      openDrawer!("rejected", "bottom", "Введите логин");
      return;
    }

    if (!bet) {
      openDrawer!("rejected", "bottom", "Введите размер ставки");
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

  async function loadRooms() {
    const res = await fetchRooms();
    if (res) {
      const filtered = res?.rooms?.filter((room: Room) => {
        return (
          room.bet_type ===
          BetTypeEnum[activeCurrency as keyof typeof BetTypeEnum]
        );
      });
      setRooms(filtered || []);
    }
  }

  useEffect(() => {
    loadRooms();
  }, [activeCurrency]);

  useEffect(() => {
    if (createdRoom.name) {
      setIsCreatingDuel(false);
      loadRooms();
      setCreatedRoom({ name: "" });
    }
  }, [createdRoom.name]);

  useEffect(() => {
    if (joinedRoom.name) {
      openModal!("shipsArrangement2");
      setJoinedRoom({ name: "" });
    }
  }, [joinedRoom.name]);

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
                  игра с другом
                </div>
                <div className="rivals__list-item-start-info-value">
                  создайте общую дуэль
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
          {rooms?.map((item, index) => {
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
                      Логин:
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
                      Ставка:
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
                    }}
                    size="small"
                    className="rivals__list-item-end-btn"
                    text="Дуэль"
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
            создайте свою дуэль с другом!
          </div>

          <div className="rivals__newDuel__inputBlock">
            <div className="rivals__newDuel__inputBlock-sup">
              <label className="rivals__newDuel__inputBlock-sup-label">
                1.логин друга:
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
                2.ваша ставка:
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
            text="Создать дуэль"
          />

          {/* TODO: КНОПКУ УБРАТЬ*/}
          <button
            onClick={(e) => {
              e.stopPropagation();
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
