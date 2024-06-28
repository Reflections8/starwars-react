import "./styles/cuttedButton.css";

type CuttedButtonProps = {
  className: string;
  text: string;
  size?: string;
  callback: () => void;
};

export function CuttedButton({
  className,
  text,
  size = "medium",
  callback,
}: Partial<CuttedButtonProps>) {
  return (
    <div className={`cuttedButtonContainer ${className}`}>
      <div className={`cuttedButtonFrame`} onClick={callback}>
        <button className={`cuttedButton ${size}`}>
          <div className="cuttedButton__text">{text}</div>
        </button>
      </div>
    </div>
  );
}
