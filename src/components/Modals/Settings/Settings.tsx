import { useState } from "react";
import { Select } from "../../../ui/Select/Select";
import { SlidingPills } from "../../../ui/SlidingPills/SlidingPills";
import { PillType } from "../../../ui/SlidingPills/types";
import "./styles/settings.css";
import { SelectOptionType } from "./types";

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

const models: SelectOptionType[] = [
  {
    label: "DROID",
    value: "DROID",
  },
  {
    label: "ANOTHER",
    value: "ANOTHER",
  },
];

const graphics: SelectOptionType[] = [
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
];

export function Settings() {
  const [activePill, setActivePill] = useState(pills[0]);
  const [activeModel, setActiveModel] = useState(models[0]);
  const [activeGraphics, setActiveGraphics] = useState(graphics[0]);

  return (
    <div className="settings">
      <div className="settings__row">
        <div className="settings__row-name">Model:</div>
        <div className="settings__row-action settings__row-selectContainer">
          <Select
            options={models}
            activeOption={activeModel}
            setActiveOption={setActiveModel}
          />
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
