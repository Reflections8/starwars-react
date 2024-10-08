import { useTranslation } from "react-i18next";
import { useBackgroundVideo } from "../../../context/BackgroundVideoContext";
import { useModal } from "../../../context/ModalContext";
import { CuttedButton } from "../../../ui/CuttedButton/CuttedButton";
import bgImg from "./img/jar.png";
import "./styles/Binks.css";
import { useLoader } from "../../../context/LoaderContext";

export function BinksBack() {
  const { t } = useTranslation();
  const { setIsLoading } = useLoader();
  const { closeModal } = useModal();
  const { setReadyState, setActiveVideo } = useBackgroundVideo();

  return (
    <div className="binks">
      <img src={bgImg} alt="" className="binks__bgImg" />
      <div className="binks__title">{t("binksBackModal.title")}</div>
      <div className="binks__text">{t("binksBackModal.text")}</div>

      <CuttedButton
        text={"OK"}
        size="small"
        className="binksBack__btnReady"
        callback={(e) => {
          e.stopPropagation();
          setReadyState!(true);
          closeModal!();
          setIsLoading!(false);
          setActiveVideo!("3");
        }}
      />
    </div>
  );
}
