import { useEffect, useState } from "react";
import "../styles/progressBas.css";

type ProgressLineType = {
  currentValue: number | string;
  maxValue: number | string;
  className: string;
};

export function ProgressBar({
  currentValue,
  maxValue,
  className,
}: Partial<ProgressLineType>) {
  const [gradientWidth, setGradientWidth] = useState(
    (Number(currentValue) / Number(maxValue)) * 100
  );

  useEffect(() => {
    setGradientWidth((Number(currentValue) / Number(maxValue)) * 100);
  }, [currentValue, maxValue]);

  return (
    <div className={`progressBarWrapper ${className}`}>
      <div className="progressBarInner">
        <div
          className="progressBarInnerGradient"
          style={{ maxWidth: `${gradientWidth}%` }}
        ></div>
        {currentValue}/{maxValue}
      </div>
    </div>
  );
}
