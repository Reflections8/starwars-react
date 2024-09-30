import { useEffect, useState } from "react";
import { Select } from "../../../ui/Select/Select";
import { SlidingPills } from "../../../ui/SlidingPills/SlidingPills";
import { PillType } from "../../../ui/SlidingPills/types";
import "./styles/settings.css";
import { SelectOptionType } from "./types";
import { CharactersData, useUserData } from "../../../UserDataService.tsx";
import { SERVER_URL } from "../../../main.tsx";
import { useTranslation } from "react-i18next";
import engFlag from "./img/eng.svg";
import rusFlag from "./img/rus.svg";
import { CuttedButton } from "../../../ui/CuttedButton/CuttedButton.tsx";
import { useBackgroundVideo } from "../../../context/BackgroundVideoContext.tsx";
import { useDrawer } from "../../../context/DrawerContext.tsx";
import { useModal } from "../../../context/ModalContext.tsx";

export function Settings() {
  const {
    characters,
    activeCharacter,
    jwt,
    soundSetting,
    setSoundSetting,
    updateUserInfo,
  } = useUserData();
  const { t, i18n } = useTranslation();

  const { restartTutorial, sessionCount } = useBackgroundVideo();
  const { closeModal } = useModal();

  const pills: PillType[] = [
    {
      label: t("settingsModal.optionInactive"),
      value: "OFF",
    },
    {
      label: t("settingsModal.optionActive"),
      value: "ON",
    },
  ];

  const graphics: SelectOptionType[] = [
    {
      label: t("settingsModal.optionAuto"),
      value: "AUTO",
    },
  ];

  const language: SelectOptionType[] = [
    {
      label: "RUS",
      value: "RUS",
      icon: rusFlag,
    },
    {
      label: "ENG",
      value: "ENG",
      icon: engFlag,
    },
  ];

  const [activePill, setActivePill] = useState(pills[0]);
  const [activeGraphics, setActiveGraphics] = useState(graphics[0]);

  const [characterOptions, setCharacterOptions] = useState<SelectOptionType[]>(
    []
  );
  const [activeOption, setActiveOption] = useState<SelectOptionType | null>(
    null
  );

  const [activeLanguage, setActiveLanguage] = useState<SelectOptionType>(
    localStorage.getItem("language") === "ru" ? language[0] : language[1]
  );

  useEffect(() => {
    setActiveGraphics(graphics[0]);
  }, [i18n.language]);

  useEffect(() => {
    const currentLanguageCode = activeLanguage.value === "ENG" ? "en" : "ru";
    i18n.changeLanguage(currentLanguageCode);
  }, [activeLanguage]);

  useEffect(() => {
    if (characters) {
      const options: SelectOptionType[] = characters.map((character) => ({
        label: `${CharactersData[character.type - 1].name}`,
        value: character.id.toString(),
      }));
      setCharacterOptions(options);
    }

    if (activeCharacter) {
      const active: SelectOptionType = {
        value: activeCharacter.id.toString(),
        label: `${CharactersData[activeCharacter.type - 1].name}`,
      };
      setActiveOption(active);
    }
  }, [characters, activeCharacter]);

  useEffect(() => {
    setActivePill(pills[soundSetting ? 1 : 0]);
  }, [soundSetting]);

  const handleActiveCharacterChange = async (characterId: string) => {
    if (jwt == null || jwt === "") return;

    const newActiveCharacter = characters.find(
      (character) => character.id.toString() === characterId
    );
    if (newActiveCharacter) {
      try {
        const reqBody = {
          type: newActiveCharacter.type,
        };
        await fetch(SERVER_URL + "/main/selectCharacter", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify(reqBody),
        });

        await updateUserInfo(jwt);
      } catch (e) {
        // ignore
      }

      //changeActiveCharacterOnBackend(Number(characterId));
      /*const active: SelectOptionType = {
        value: newActiveCharacter.id.toString(),
        label: `${CharactersData[newActiveCharacter.type - 1].name}`,
      };
      setActiveOption(active);*/
    }
  };

  const handleSoundChange = (value: string) => {
    if (value === "OFF") {
      setSoundSetting(false);
      localStorage.setItem("sound_setting", "off");
    } else {
      setSoundSetting(true);
      localStorage.setItem("sound_setting", "on");
    }
  };

  return (
    <div className="settings">
      <div className="settings__row">
        <div className="settings__row-name">{t("settingsModal.model")}:</div>
        <div className="settings__row-action settings__row-selectContainer">
          {activeOption && (
            <Select
              options={characterOptions}
              activeOption={activeOption}
              setActiveOption={(option) =>
                handleActiveCharacterChange(option.value)
              }
            />
          )}
        </div>
      </div>

      <div className="settings__row">
        <div className="settings__row-name">{t("settingsModal.sound")}:</div>
        <div className="settings__row-action settings__row-pillsContainer">
          <SlidingPills
            pills={pills}
            activePill={activePill}
            setActivePill={(option) => handleSoundChange(option.value)}
          />
        </div>
      </div>

      <div className="settings__row">
        <div className="settings__row-name">{t("settingsModal.graphic")}:</div>
        <div className="settings__row-action settings__row-selectContainer">
          <Select
            options={graphics}
            activeOption={activeGraphics}
            setActiveOption={setActiveGraphics}
          />
        </div>
      </div>

      <div className="settings__row">
        <div className="settings__row-name">{t("settingsModal.language")}:</div>
        <div className="settings__row-action settings__row-selectContainer">
          <Select
            options={language}
            withIcon={true}
            activeOption={activeLanguage}
            setActiveOption={setActiveLanguage}
          />
        </div>
      </div>

      {!characters.length && sessionCount! <= 5 ? null : (
        <div className="settings__row">
          <div className="settings__row-name">
            {t("settingsModal.tutorial")}:
          </div>
          <div className="settings__row-action settings__row-selectContainer">
            <CuttedButton
              text={t("settingsModal.runTutorial")}
              callback={() => {
                restartTutorial!();
                closeModal!();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
