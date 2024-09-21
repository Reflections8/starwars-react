/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useRef } from "react";
import "./styles/slidingPills.css";
import { PillType } from "./types";
import { useTranslation } from "react-i18next";

type SlidingPillProps = {
  pills: PillType[];
  activePill: PillType;
  setActivePill: (activePill: PillType) => void;
};

export function SlidingPills({
  pills,
  activePill,
  setActivePill,
}: SlidingPillProps) {
  const { i18n } = useTranslation();
  const pillsContainerRef = useRef<HTMLDivElement>(null);
  const gliderRef = useRef<HTMLSpanElement>(null);

  const updateGlider = (label: HTMLLabelElement) => {
    if (gliderRef.current) {
      const labelWidth = label.clientWidth;
      const labelOffsetLeft = label.offsetLeft;

      gliderRef.current.style.width = `${labelWidth}px`;
      gliderRef.current.style.transform = `translateX(${
        labelOffsetLeft - 5
      }px)`;
    }
  };

  useEffect(() => {
    const pillsContainer = pillsContainerRef.current;
    const pillsLabels = pillsContainer?.querySelectorAll(".pills__label");

    const currentLabel = Array.from(pillsLabels || []).find((label) => {
      const inputId = label.getAttribute("for") as string;
      return activePill?.value === inputId;
    });

    if (currentLabel) {
      requestAnimationFrame(() =>
        updateGlider(currentLabel as HTMLLabelElement)
      );
    }

    const handleResize = () => {
      if (currentLabel) {
        updateGlider(currentLabel as HTMLLabelElement);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [activePill, i18n.language]);

  return (
    <div
      className="pills disciplines__pills-container bg-accent-secondary"
      ref={pillsContainerRef}
    >
      {pills.map((pill) => (
        <a
          className={`pills__link ${pill.value}`}
          key={pill.value}
          onClick={() => setActivePill(pill)}
        >
          <input
            type="radio"
            id={pill.value}
            name="tabs"
            className="pills__input"
            checked={activePill?.value === pill?.value}
          />
          <label className="pills__label" htmlFor={pill.value}>
            <span className="pills__label-text">{pill.label}</span>
          </label>
        </a>
      ))}
      {pills.some((item) => item?.value === activePill?.value) ? (
        <span
          className="pills__glider disciplines__pills-container-glider bg-warning"
          ref={gliderRef}
        />
      ) : null}
    </div>
  );
}
