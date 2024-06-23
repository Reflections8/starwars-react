import "./styles/cuttedButton.css";

type CuttedButtonProps = {
  className: string;
  text: string;
  callback: () => void;
};

export function CuttedButton({
  className,
  text,
  callback,
}: Partial<CuttedButtonProps>) {
  return (
    <div className={`cuttedButtonContainer ${className}`}>
      <div className="cuttedButtonFrame" onClick={callback}>
        <button className="cuttedButton">
          <div className="cuttedButton__text">{text}</div>
        </button>
      </div>
    </div>
  );
}
