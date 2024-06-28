/* eslint-disable @typescript-eslint/ban-ts-comment */
import { SelectOptionType } from "../../components/Modals/Settings/types";
import "./styles/select.css";
import arrowSvg from "./img/arrow.svg";
import { useEffect, useState } from "react";

type SelectProps = {
  options: SelectOptionType[];
  activeOption: SelectOptionType;
  setActiveOption: (option: SelectOptionType) => void;
};

export function Select({
  options,
  activeOption,
  setActiveOption,
}: SelectProps) {
  const [isOpened, setIsOpened] = useState(false);

  function selectOption(selected: SelectOptionType) {
    setActiveOption(selected);
    setIsOpened(false);
  }

  // @ts-ignore
  function handleOpenState(e) {
    if (!e.target.closest(".dropdown") && !e.target.closest(".select")) {
      setIsOpened(false);
    }
  }

  useEffect(() => {
    document.addEventListener("click", handleOpenState);
    return () => {
      document.addEventListener("click", handleOpenState);
    };
  }, []);

  return (
    <div className="selectWrapper">
      <div
        className="select"
        onClick={() => {
          setIsOpened(!isOpened);
        }}
      >
        <div className="select__value">{activeOption.label}</div>
        <img src={arrowSvg} alt="" className="select__arrow" />
      </div>

      <div className={`dropdown ${!isOpened ? "dropdown--Hidden" : ""}`}>
        {options.map((option) => {
          const selected = option.value === activeOption.value;
          return (
            <div
              className={`dropdown__option ${
                selected ? "dropdown__option--Selected" : ""
              }`}
              onClick={() => {
                selectOption(option);
              }}
            >
              {option.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
