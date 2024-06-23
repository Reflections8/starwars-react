import { Footer } from "../../components/Footer/Footer";
import { Header } from "../../components/Header/Header";
import { HeaderCenterCredits } from "../../components/Header/components/HeaderCenter/HeaderCenterCredits";
import { HomeIcon } from "../../icons/Home";
import { MenuIcon } from "../../icons/Menu";
import { openMenu } from "../../utils";
import "./styles/game1.css";

export function Game1() {
  return (
    <>
      <Header
        leftIcon={<HomeIcon />}
        leftText={"Домой"}
        leftLink={"/"}
        rightIcon={<MenuIcon />}
        rightText={"Меню"}
        rightAction={openMenu}
        centerComponent={<HeaderCenterCredits credits={1235954} />}
      />

      {/* MODEL AND CONTROLS WILL BE HERE */}
      <div className="mainWrapper"></div>

      <Footer power={123456} clip={1234} charges={22} />
    </>
  );
}
