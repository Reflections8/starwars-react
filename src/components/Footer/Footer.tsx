import { useEffect, useState } from "react";
import { FooterAmmoBgIcon } from "../../icons/FooterAmmoBgIcon";
import bgBottom from "./img/bg-bottom.png";
import bgBottomBar from "./img/bottom-bar.png";
import weaponBg from "./img/weapon-bg.png";
import weaponImg from "./img/weapon.png";
import "./styles/Footer.css";
import "./styles/FooterAnimation.css";

type FooterProps = {
  clip: number;
  power: number;
  charges: number;
};

export function Footer({ clip, power, charges }: Partial<FooterProps>) {
  const chargeArray = Array.from(Array(25));

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <footer className={`footerWrapper`}>
      <div className={`footer ${isMounted ? "footer--slideInBottom" : ""}`}>
        <div className="footer__top">
          <div className="footer__top-left">
            <div className="footer__top-content">
              <div className="footer__top-content-key">Обойма:</div>
              <div className="footer__top-content-value">{clip}</div>
            </div>
            <FooterAmmoBgIcon className="footer__top-left-bg" />
          </div>
          <div className="footer__top-center">
            <img
              src={weaponImg}
              alt="weapon"
              className="footer__top-center-weapon"
            />
            <img
              src={weaponBg}
              alt="bg-weapon"
              className="footer__top-center-weaponBg"
            />
          </div>
          <div className="footer__top-right">
            <div className="footer__top-content">
              <div className="footer__top-content-key">Мощность:</div>
              <div className="footer__top-content-value">{power}</div>
            </div>

            <FooterAmmoBgIcon className="footer__top-right-bg" />
          </div>
        </div>
        <div className="footer__bottom">
          <div className="footer__bottom-bar">
            <img src={bgBottomBar} alt="" className="footer__bottom-bar-bg" />
            {chargeArray.map((_, index) => (
              <div
                key={index}
                className={`segment ${
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  //@ts-ignore
                  index < charges!
                    ? "footer__bottom-bar-item footer__bottom-bar-item--Charged"
                    : "footer__bottom-bar-item"
                }`}
              ></div>
            ))}
          </div>
          <img src={bgBottom} alt="bg-bottom" className="footer__bottomBg" />
        </div>
      </div>
    </footer>
  );
}
