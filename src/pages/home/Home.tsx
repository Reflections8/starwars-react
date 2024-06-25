/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState } from "react";
import { Header } from "../../components/Header/Header";
import { HeaderCenterShop } from "../../components/Header/components/HeaderCenter/HeaderCenterShop";
import { useModal } from "../../context/ModalContext";
import { ExitIcon } from "../../icons/Exit";
import { GamesIcon } from "../../icons/Games";
import { MenuIcon } from "../../icons/Menu";
import { OptionsIcon } from "../../icons/Options";
import { openMenu } from "../../utils";
import { BackgroundLayers } from "./components/BackgroundLayers";
import { CharaсterModel } from "./components/CharacterModel";
import { MainLinks } from "./components/MainLinks";
import { Resources } from "./components/Resources";
import "./styles/home.css";

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
        centerComponent={
          <HeaderCenterShop
            onClick={() => {
              //@ts-ignore
              openModal("shop");
            }}
          />
        }
      />

      <Resources credits={1235954} woopy={253954} ton={35954} />

      <MainLinks />

      <CharaсterModel type={currentModel} />

      <Header
        position={"bottom"}
        leftIcon={<GamesIcon />}
        leftText={"Игры"}
        leftAction={() => {
          //@ts-ignore
          openModal("chooseGame");
        }}
        rightIcon={<OptionsIcon />}
        rightText={"Опции"}
        rightAction={openMenu}
      />
    </>
  );
}
