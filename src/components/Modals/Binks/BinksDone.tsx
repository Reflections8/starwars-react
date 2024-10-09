import { useTranslation } from "react-i18next";
import { useBackgroundVideo } from "../../../context/BackgroundVideoContext";
import { useModal } from "../../../context/ModalContext";
import { CuttedButton } from "../../../ui/CuttedButton/CuttedButton";
import "./styles/Binks.css";
import { useLoader } from "../../../context/LoaderContext";

export function BinksDone() {
  const { setTutorialClicked } = useLoader();
  const { t } = useTranslation();
  const { closeModal } = useModal();
  const { setActiveVideo, repeatCount, setRepeatCount } = useBackgroundVideo();
  return (
    <div className="binks">
      <div className="binks__text">{t("binksModal.doneText")}</div>

      <div className="binksDone__footer">
        <CuttedButton
          text={t("binksModal.repeat")}
          size="small"
          className="binksDone__footer-repeat"
          callback={(e) => {
            e.stopPropagation();
            setRepeatCount!((repeatCount as number) + 1);
            setActiveVideo!("2");
            closeModal!();
          }}
        />

        <CuttedButton
          text={t("binksModal.finish")}
          size="small"
          className="binksDone__footer-finish"
          callback={(e) => {
            e.stopPropagation();
            setActiveVideo!("3");
            setTutorialClicked!(true);
            closeModal!();
          }}
        />
      </div>
    </div>
  );
}
