import { useEffect, useState } from "react";
import shopBg from "../../img/ShopBg.png";
import hightlightShop from "../../../../pages/home/video/shop.svg";

type HeaderCenterShopProps = {
  onClick: () => void;
};

export function HeaderCenterShop({ onClick }: HeaderCenterShopProps) {
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
        <div className="header__bottom-main-text--Shop">Магазин</div>
      </div>
    </div>
  );
}
