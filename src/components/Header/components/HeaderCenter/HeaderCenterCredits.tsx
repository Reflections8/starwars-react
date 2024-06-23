import { useEffect, useState } from "react";
import { YellowBgIcon } from "../../../../icons/YellowBg";
import { formatNumberWithCommas } from "../../../../utils";
import creditsBg from "../../img/CreditsBg.png";

type HeaderCenterCreditsProps = {
  credits: number;
};

export function HeaderCenterCredits({
  credits,
}: Partial<HeaderCenterCreditsProps>) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div
      className={`header__bottom ${
        isMounted ? "header__bottom--slideInTop" : ""
      }`}
    >
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
  );
}
