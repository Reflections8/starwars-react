import { Footer } from "../../components/Footer/Footer";
import { Header } from "../../components/Header/Header";
import { HomeIcon } from "../../icons/Home";
import { MenuIcon } from "../../icons/Menu";
import "./styles/game1.css";

export function Game1() {
  return (
    <>
      <Header
        leftIcon={<HomeIcon />}
        leftText={"Домой"}
        leftLink={"/home"}
        rightIcon={<MenuIcon />}
        rightText={"Меню"}
        credits={1235954}
      />

      {/* MODEL AND CONTROLS WILL BE HERE */}
      <div className="mainWrapper">CONTENT WILL BE HERE</div>

      <Footer power={123456} clip={1234} charges={22} />
    </>
  );
}
