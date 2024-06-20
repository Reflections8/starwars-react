import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { YellowBgIcon } from "../../icons/YellowBg";
import bgImgBlur from "./img/left-bg-blur.png";
import bgImg from "./img/left-bg.png";
import creditsBg from "./img/CreditsBg.png";
import "./styles/Header.css";

type HeaderProps = {
  onlyRight: boolean;
  onlyLeft: boolean;
  leftIcon: ReactNode;
  leftLink: string;
  leftText: string;
  rightIcon: ReactNode;
  rightText: string;
  credits: number;
};

export function Header({
  onlyRight = false,
  onlyLeft = false,
  leftIcon,
  leftLink,
  leftText,
  rightIcon,
  rightText,
  credits = 0,
}: Partial<HeaderProps>) {
  function formatNumberWithCommas(number: number) {
    if (number) {
      let strNumber = number.toString();
      let parts = strNumber.split(".");
      let integerPart = parts[0];
      integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      if (parts.length === 2) {
        return integerPart + "." + parts[1];
      } else {
        return integerPart;
      }
    }
  }

  return (
    <header className="headerWrapper">
      <div className="header">
        <div className="header__top">
          <Link
            to={leftLink as string}
            className={`header__top-link header__top-left ${
              onlyRight && "header__top-link--Disabled"
            }`}
          >
            <img
              src={bgImg}
              alt="bg"
              className="header__top-bg header__top-left-bg"
            />
            <img src={bgImgBlur} alt="" className="header__top-left-bgBlur" />

            {!onlyRight && (
              <div className={`header__top-left-content`}>
                <div className="header__top-left-content-iconWrapper">
                  {leftIcon}
                  <div className="header__top-left-content-iconWrapper-blur">
                    {leftIcon}
                  </div>
                </div>
                <span className="header__top-left-content-text">
                  {leftText}
                </span>
              </div>
            )}
          </Link>

          {!onlyLeft && (
            <div className="header__top-link header__top-right">
              <img
                src={bgImg}
                alt="bg"
                className="header__top-bg header__top-right-bg"
              />
              <img
                src={bgImgBlur}
                alt=""
                className="header__top-right-bgBlur"
              />

              <div className="header__top-right-content">
                <span className="header__top-right-content-text">
                  {rightText}
                </span>
                <div className="header__top-right-content-iconWrapper">
                  {rightIcon}
                  <div className="header__top-right-content-iconWrapper-blur">
                    {rightIcon}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="header__bottom">
          <div className="header__bottom-sup">
            <div className="header__bottom-sup-bg">
              <YellowBgIcon />
            </div>
            <div className="header__bottom-sup-text">Кредиты</div>
          </div>
          <div className="header__bottom-main">
            <img
              src={creditsBg}
              alt="credits-bg"
              className="header__bottom-main-bg"
            />
            <div className="header__bottom-main-text">
              {formatNumberWithCommas(credits)}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
