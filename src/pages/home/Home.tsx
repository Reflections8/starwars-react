import { useState } from "react";
import { Header } from "../../components/Header/Header";
import { HeaderCenterShop } from "../../components/Header/components/HeaderCenter/HeaderCenterShop";
import { ExitIcon } from "../../icons/Exit";
import { GamesIcon } from "../../icons/Games";
import { MenuIcon } from "../../icons/Menu";
import { OptionsIcon } from "../../icons/Options";
import { openMenu } from "../../utils";
import { CharaсterModel } from "./components/CharacterModel";
import { Resources } from "./components/Resources";
import "./styles/home.css";
import { MainLinks } from "./components/MainLinks";
import { BackgroundLayers } from "./components/BackgroundLayers";
import { useModal } from "../../context/ModalContext";

export function Home() {
  const [currentModel] = useState("stormtrooper");
  const { openModal } = useModal();
  return (
    <>
      <BackgroundLayers />

      <Header
        leftIcon={<ExitIcon />}
        leftText={"Выход"}
        leftLink={"/auth"}
        rightIcon={<MenuIcon />}
        rightText={"Меню"}
        rightAction={openMenu}
        centerComponent={<HeaderCenterShop />}
      />

      <Resources credits={1235954} woopy={253954} ton={35954} />

      <MainLinks />

      <CharaсterModel type={currentModel} />

      <Header
        position={"bottom"}
        leftIcon={<GamesIcon />}
        leftText={"Игры"}
        leftAction={() => {
          openModal("chooseGame");
        }}
        rightIcon={<OptionsIcon />}
        rightText={"Опции"}
        rightAction={openMenu}
        centerComponent={<HeaderCenterShop />}
      />
    </>
  );
}
