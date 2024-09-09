import { useEffect, useState } from "react";
import { Select } from "../../../ui/Select/Select";
import { SlidingPills } from "../../../ui/SlidingPills/SlidingPills";
import { PillType } from "../../../ui/SlidingPills/types";
import "./styles/settings.css";
import { SelectOptionType } from "./types";
import { CharactersData, useUserData } from "../../../UserDataService.tsx";
import { SERVER_URL } from "../../../main.tsx";

const pills: PillType[] = [
  {
    label: "OFF",
    value: "OFF",
  },
  {
    label: "ON",
    value: "ON",
  },
];

const graphics: SelectOptionType[] = [
  {
    label: "AUTO",
    value: "AUTO",
  },
];

export function Settings() {
  const { characters, activeCharacter, jwt, soundSetting, setSoundSetting } =
    useUserData();
  const [activePill, setActivePill] = useState(pills[0]);
  const [activeGraphics, setActiveGraphics] = useState(graphics[0]);

  const [characterOptions, setCharacterOptions] = useState<SelectOptionType[]>(
    []
  );
  const [activeOption, setActiveOption] = useState<SelectOptionType | null>(
    null
  );

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
        <div className="settings__row-name">Model:</div>
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
        <div className="settings__row-name">Sound:</div>
        <div className="settings__row-action settings__row-pillsContainer">
          <SlidingPills
            pills={pills}
            activePill={activePill}
            setActivePill={(option) => handleSoundChange(option.value)}
          />
        </div>
      </div>
      <div className="settings__row">
        <div className="settings__row-name">Graphic:</div>
        <div className="settings__row-action settings__row-selectContainer">
          <Select
            options={graphics}
            activeOption={activeGraphics}
            setActiveOption={setActiveGraphics}
          />
        </div>
      </div>
    </div>
  );
}
