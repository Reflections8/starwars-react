import { useBackgroundVideo } from "../../../context/BackgroundVideoContext";
import { useModal } from "../../../context/ModalContext";
import { CuttedButton } from "../../../ui/CuttedButton/CuttedButton";
import "./styles/Binks.css";

export function Binks() {
  const { closeModal } = useModal();
  const { setReadyState, setActiveVideo } = useBackgroundVideo();
  return (
    <div className="binks">
      <div className="binks__text">
        Приветствую тебя в Акроникс, на вашем кошельке не обнаружено НФТ
        персонажей, возможно вы новобранец, поэтому Бингс проведет для вас
        обучение. Включите звук и слушайте внимательно
      </div>

      <CuttedButton
        text={"Я готов"}
        size="small"
        className="binks__btnReady"
        callback={(e) => {
          e.stopPropagation();
          setReadyState!(true);
          setActiveVideo!("2");
          closeModal!();
        }}
      />
    </div>
  );
}
