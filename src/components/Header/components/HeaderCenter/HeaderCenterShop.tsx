import { useEffect, useState } from "react";
import shopBg from "../../img/ShopBg.png";

export function HeaderCenterShop() {
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
      <div className="header__bottom-main">
        <img src={shopBg} alt="shop-bg" className="header__bottom-main-bg" />
        <div className="header__bottom-main-text--Shop">Магазин</div>
      </div>
    </div>
  );
}
