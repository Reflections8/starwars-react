import "./styles/cuttedButton.css";

type CuttedButtonProps = {
  className: string;
  text: string;
  size?: string;
  callback: () => void;
  iconSrc?: string;
};

export function CuttedButton({
  className,
  text,
  size = "medium",
  callback,
  iconSrc,
}: Partial<CuttedButtonProps>) {
  return (
    <div className={`cuttedButtonContainer ${className}`}>
      <div className={`cuttedButtonFrame`} onClick={callback}>
        <button className={`cuttedButton ${size}`}>
          {iconSrc ? (
            <img src={iconSrc} alt="icon" className="cuttedButton__icon" />
          ) : null}
          <div className="cuttedButton__text">{text}</div>
        </button>
      </div>
    </div>
  );
}
