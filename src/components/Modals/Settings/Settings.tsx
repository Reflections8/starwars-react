import { useEffect, useState } from "react";
import { Select } from "../../../ui/Select/Select";
import { SlidingPills } from "../../../ui/SlidingPills/SlidingPills";
import { PillType } from "../../../ui/SlidingPills/types";
import "./styles/settings.css";
import { SelectOptionType } from "./types";
import { CharactersData, useUserData } from "../../../UserDataService.tsx";

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

/*const graphics: SelectOptionType[] = [
  {
    label: "MAXIMUM",
    value: "MAXIMUM",
  },
  {
    label: "MEDIUM",
    value: "MEDIUM",
  },
  {
    label: "LOW",
    value: "LOW",
  },
];*/

export function Settings() {
  const { characters, activeCharacter, sendSocketMessage, jwt } = useUserData();
  const [activePill, setActivePill] = useState(pills[0]);
  //const [activeGraphics, setActiveGraphics] = useState(graphics[0]);

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

  const handleActiveCharacterChange = (characterId: string) => {
    if (jwt == null || jwt === "") return;

    const newActiveCharacter = characters.find(
      (character) => character.id.toString() === characterId
    );
    if (newActiveCharacter) {
      const json = JSON.stringify({
        type: newActiveCharacter.type,
        jwt_token: jwt,
      });
      sendSocketMessage("selectCharacter:" + json);

      //changeActiveCharacterOnBackend(Number(characterId));
      /*const active: SelectOptionType = {
        value: newActiveCharacter.id.toString(),
        label: `${CharactersData[newActiveCharacter.type - 1].name}`,
      };
      setActiveOption(active);*/
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
            setActivePill={setActivePill}
          />
        </div>
      </div>
      {/*<div className="settings__row">
        <div className="settings__row-name">Graphic:</div>
        <div className="settings__row-action settings__row-selectContainer">
          <Select
            options={graphics}
            activeOption={activeGraphics}
            setActiveOption={setActiveGraphics}
          />
        </div>
      </div>*/}
    </div>
  );
}
