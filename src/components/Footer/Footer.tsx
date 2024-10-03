import { useEffect, useState } from "react";
import { FooterAmmoBgIcon } from "../../icons/FooterAmmoBgIcon";
import bgBottom from "./img/bg-bottom.png";
import bgBottomBar from "./img/bottom-bar.png";
import weaponBgLeft from "./img/weapon-bg-left.png";
import weaponBgRight from "./img/weapon-bg-right.png";
import weaponImg1 from "./img/m 002.png";
import weaponImg2 from "./img/ef 4.png";
import weaponImg3 from "./img/fg 13.png";
import "./styles/Footer.css";
import "./styles/FooterAnimation.css";

type FooterProps = {
  clip: number;
  power: number;
  charges: number;
};

// @ts-ignore
export function Footer({
  clip,
  power,
  charges,
  // @ts-ignore
  weaponLevel,
}: Partial<FooterProps>) {
  const chargeArray = Array.from(Array(25));

  const weaponArr = [weaponImg1, weaponImg2, weaponImg3];

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
              src={weaponArr[weaponLevel - 1]}
              alt="weapon"
              className="footer__top-center-weapon"
            />
            <div className="footer__top-center-weaponBg">
              <img
                src={weaponBgLeft}
                alt=""
                className="footer__top-center-weaponBg-left"
              />
              <img
                src={weaponBgRight}
                alt=""
                className="footer__top-center-weaponBg-right"
              />
              {/* <img
                src={weaponBgTop}
                alt=""
                className="footer__top-center-weaponBg-top"
              /> */}
              {/* <img
                src={weaponBgBottom}
                alt=""
                className="footer__top-center-weaponBg-bottom"
              /> */}
            </div>
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
