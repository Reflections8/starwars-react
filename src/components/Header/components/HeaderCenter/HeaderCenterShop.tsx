import { useEffect, useState } from "react";
import shopBg from "../../img/ShopBg.png";

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
      onClick={onClick}
      className={`header__bottom header__bottom--Shop ${
        isMounted ? "header__bottom--slideInTop" : ""
      }`}
    >
      <div className="header__bottom-main">
        <img src={shopBg} alt="shop-bg" className="header__bottom-main-bg" />
        <div className="header__bottom-main-text--Shop">Магазин</div>
      </div>
    </div>
  );
}
