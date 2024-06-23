import { ReactNode, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import bgImgBlur from "./img/left-bg-blur.png";
import bgImg from "./img/left-bg.png";
import "./styles/Header.css";
import "./styles/HeaderAnimation.css";

type HeaderProps = {
  position: "top" | "bottom";
  onlyRight: boolean;
  onlyLeft: boolean;
  leftIcon: ReactNode;
  leftLink: string;
  leftText: string;
  leftAction: () => void;
  rightIcon: ReactNode;
  rightText: string;
  rightAction: () => void;
  centerComponent: ReactNode;
};

export function Header({
  position = "top",
  onlyRight = false,
  onlyLeft = false,
  leftIcon,
  leftLink,
  leftText,
  leftAction,
  rightIcon,
  rightText,
  rightAction,
  centerComponent,
}: Partial<HeaderProps>) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <header
      className={`headerWrapper ${
        position === "bottom" ? "headerWrapper--Bottom" : ""
      }`}
    >
      <div className="header">
        <div className="header__top">
          {leftLink && (
            <Link
              to={leftLink as string}
              className={`header__top-link header__top-left ${
                onlyRight ? "header__top-link--Disabled" : ""
              } ${isMounted ? "header__top-link--slideInLeft" : ""}`}
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
          )}

          {!!leftAction && (
            <div
              onClick={leftAction}
              className={`header__top-link header__top-left ${
                onlyRight ? "header__top-link--Disabled" : ""
              } ${isMounted ? "header__top-link--slideInLeft" : ""}`}
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
            </div>
          )}

          <div
            className={`header__top-link header__top-right ${
              isMounted ? "header__top-link--slideInRight" : ""
            }`}
            onClick={rightAction}
          >
            <img
              src={bgImg}
              alt="bg"
              className="header__top-bg header__top-right-bg"
            />
            <img src={bgImgBlur} alt="" className="header__top-right-bgBlur" />

            {!onlyLeft && (
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
            )}
          </div>
        </div>

        {position === "top" ? centerComponent : null}
      </div>
    </header>
  );
}
