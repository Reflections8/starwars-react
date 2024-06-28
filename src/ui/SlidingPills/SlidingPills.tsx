/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect } from "react";
import "./styles/slidingPills.css";
import { PillType } from "./types";

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
  useEffect(() => {
    const pills = document.querySelectorAll(".pills");
    pills.forEach((item) => {
      const pillsLabels = item.querySelectorAll(".pills__label");
      const pillsGlider = item.querySelector(".pills__glider");

      function updateGlider(label: HTMLLabelElement) {
        const labelWidth = label.clientWidth;
        const labelOffsetLeft = label.offsetLeft;

        pillsGlider!.setAttribute(
          "style",
          `width: ${labelWidth}px;
				  transform: translateX(${labelOffsetLeft - 5}px)`
        );
      }

      // Define an object, to prevent 'let' usage
      const currentLabel = {
        domNode: null,
      };

      pillsLabels.forEach((label) => {
        label.addEventListener("click", (e) => {
          const currentLink = (e.currentTarget as HTMLElement).closest("a");
          currentLink?.click();

          e.preventDefault();

          const currentForAttr = (e.currentTarget as HTMLElement).getAttribute(
            "for"
          );
          const currentInput = item.querySelector(
            `#${currentForAttr}`
          ) as HTMLInputElement;
          currentInput.checked = true;

          // @ts-ignore
          currentLabel.domNode = e.currentTarget;
          updateGlider(e.currentTarget as HTMLLabelElement);
        });
      });

      const findCheckedLabel = () => {
        for (const label of pillsLabels) {
          const inputId = label.getAttribute("for") as string;
          const input = document.getElementById(inputId) as HTMLInputElement;
          if (input && input.checked) {
            return label;
          }
        }
        return pillsLabels[0];
      };

      const checkedLabel = findCheckedLabel();

      // Resize glider to default checked label
      setTimeout(() => {
        updateGlider(checkedLabel as HTMLLabelElement);
      }, 300);

      // Set glider to current checked input
      window.addEventListener("resize", () => {
        setTimeout(() => {
          if (currentLabel.domNode) {
            updateGlider(currentLabel.domNode);
          } else {
            // if current pills component is not clicked yet we set glider to default label[0] element
            updateGlider(findCheckedLabel() as HTMLLabelElement);
          }
        }, 0);
      });
    }); // forEach
  }, []);

  return (
    <div className="pills disciplines__pills-container bg-accent-secondary">
      {pills.map((pill) => {
        return (
          <a
            className={`pills__link ${pill.value}`}
            key={pill.value}
            onClick={() => {
              setActivePill(pill);
            }}
          >
            <input
              type="radio"
              id={pill.value}
              name="tabs"
              className="pills__input"
              checked={activePill.value === pill.value}
            />
            <label className="pills__label" htmlFor={pill.value}>
              <span className="pills__label-text">{pill.label}</span>
            </label>
          </a>
        );
      })}

      <span className="pills__glider disciplines__pills-container-glider bg-warning"></span>
    </div>
  );
}
