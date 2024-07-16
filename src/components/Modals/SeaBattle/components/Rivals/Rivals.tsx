import { useEffect, useState } from "react";
import { CryptoButtons } from "../../../../../ui/CryptoButtons/CryptoButtons";
import fightIcon from "./img/fight.svg";
import arrowIcon from "./img/arrow.svg";
import avatarImg from "./img/ava.png";
import tonIcon from "./img/ton.svg";
import "./styles/Rivals.css";
import { CuttedButton } from "../../../../../ui/CuttedButton/CuttedButton";

// type RivalsProps = {
//   isCreatingDuel: boolean;
//   setIsCreatingDuel: (state: boolean) => void;
// };
export function Rivals() {
  const [isCreatingDuel, setIsCreatingDuel] = useState(false);
  const [friendsLogin, setFriendsLogin] = useState("");
  const [bet, setBet] = useState(0);

  const [activeCurrency, setActiveCurrency] = useState("ton");
  const rivalsList = [
    {
      login: "@pashaurofff",
      bet: 123.456,
      avatarSrc: avatarImg,
    },
    {
      login: "@pashaurofff",
      bet: 123.456,
      avatarSrc: avatarImg,
    },
    {
      login: "@pashaurofff",
      bet: 1234.456,
      avatarSrc: avatarImg,
    },
    {
      login: "@pashaurofff",
      bet: 1234.456,
      avatarSrc: avatarImg,
    },
    {
      login: "@pashaurofff",
      bet: 1234.4536,
      avatarSrc: avatarImg,
    },
  ];

  function handleDuelCreating(e: Event) {
    e.stopPropagation();
    setIsCreatingDuel(true);
  }

  useEffect(() => {}, [isCreatingDuel]);
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
          {rivalsList.map((item, index) => {
            return (
              <div className="rivals__list-item" key={index}>
                <div className="rivals__list-item-start">
                  <img
                    src={item.avatarSrc}
                    alt="avatar"
                    className="rivals__list-item-start-ava"
                  />
                  <div className="rivals__list-item-start-login">
                    <div className="rivals__list-item-start-login-key">
                      Логин:
                    </div>
                    <a
                      href={item.login}
                      className="rivals__list-item-start-login-value"
                    >
                      {item.login}
                    </a>
                  </div>
                  <div className="rivals__list-item-start-bet">
                    <div className="rivals__list-item-start-bet-key">
                      Ставка:
                    </div>
                    <div className="rivals__list-item-start-bet-value">
                      <img
                        src={tonIcon}
                        alt="ton"
                        className="rivals__list-item-start-bet-value-icon"
                      />
                      <div className="rivals__list-item-start-bet-value-amount">
                        {item.bet}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rivals__list-item-end">
                  <CuttedButton
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
                className="rivals__newDuel__inputBlock-input"
              />
              <div className="rivals__newDuel__inputBlock-postfix">SOL</div>
            </div>
          </div>

          <CuttedButton
            className="rivals__newDuel__cuttedButton"
            text="Создать дуэль"
          />
        </div>
      ) : null}
    </div>
  );
}
