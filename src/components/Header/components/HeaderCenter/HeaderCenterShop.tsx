import { useEffect, useState } from "react";
import shopBg from "../../img/ShopBg.png";
import hightlightShop from "../../../../pages/home/video/shop.svg";
import { useTranslation } from "react-i18next";

type HeaderCenterShopProps = {
  onClick: () => void;
};

export function HeaderCenterShop({ onClick }: HeaderCenterShopProps) {
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div
      className={`header__bottom header__bottom--Shop ${
        isMounted ? "header__bottom--slideInTop" : ""
      }`}
    >
      <div
        className="header__bottom-main header__bottom-main--Shop highlighterParent shop"
        onClick={onClick}
      >
        <img src={hightlightShop} className={`highlighter shop`} />
        <img
          src={shopBg}
          alt="shop-bg"
          className="header__bottom-main-bg header__bottom-main-bg--Shop"
        />
        <div className="header__bottom-main-text--Shop">
          {t("homePage.shop")}
        </div>
      </div>
    </div>
  );
}
