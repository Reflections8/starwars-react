import { useTranslation } from "react-i18next";
import { useBackgroundVideo } from "../../../context/BackgroundVideoContext";
import { useModal } from "../../../context/ModalContext";
import { CuttedButton } from "../../../ui/CuttedButton/CuttedButton";
import bgImg from "./img/jar.png";
import "./styles/Binks.css";
import { useLoader } from "../../../context/LoaderContext";

export function Binks() {
  const { setTutorialClicked } = useLoader();
  const { t } = useTranslation();
  const { closeModal } = useModal();
  const { setReadyState, setActiveVideo } = useBackgroundVideo();

  return (
    <div className="binks">
      <img src={bgImg} alt="" className="binks__bgImg" />
      <div className="binks__title">{t("binksModal.greetingsTitle")}</div>
      <div className="binks__text">{t("binksModal.greetingsText")}</div>

      <CuttedButton
        text={t("binksModal.readyBtn")}
        size="small"
        className="binks__btnReady"
        callback={(e) => {
          e.stopPropagation();
          setReadyState!(true);
          setActiveVideo!("1");
          setTutorialClicked!(true);
          closeModal!();
        }}
      />
    </div>
  );
}
