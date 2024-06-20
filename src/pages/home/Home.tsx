import { Header } from "../../components/Header/Header";
import { MenuIcon } from "../../icons/Menu";
import "./styles/home.css";

export function Home() {
  return (
    <>
      <Header onlyRight={true} rightIcon={<MenuIcon />} rightText={"Меню"} />

      {/* MODEL AND CONTROLS WILL BE HERE */}
      <div className="mainWrapper">CONTENT WILL BE HERE</div>

      <footer className="footerWrapper">
        <div className="footer"></div>
      </footer>
    </>
  );
}
