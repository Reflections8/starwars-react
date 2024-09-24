import { useTranslation } from "react-i18next";
import { useBackgroundVideo } from "../../../context/BackgroundVideoContext";
import { useModal } from "../../../context/ModalContext";
import { CuttedButton } from "../../../ui/CuttedButton/CuttedButton";
import "./styles/Binks.css";

export function Binks() {
  const { t } = useTranslation();
  const { closeModal } = useModal();
  const { setReadyState, setActiveVideo } = useBackgroundVideo();
  return (
    <div className="binks">
      <div className="binks__text">{t("binksModal.greetingsText")}</div>

      <CuttedButton
        text={t("binksModal.readyBtn")}
        size="small"
        className="binks__btnReady"
        callback={(e) => {
          e.stopPropagation();
          setReadyState!(true);
          setActiveVideo!("1");
          closeModal!();
        }}
      />
    </div>
  );
}
