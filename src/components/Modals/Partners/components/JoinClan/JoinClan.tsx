import { CuttedButton } from "../../../../../ui/CuttedButton/CuttedButton";
import "./styles/JoinClan.css";
import rectImg from "./img/rect.svg";
import playersImg from "./img/players.svg";
import cupImg from "./img/cup.svg";
import { useTranslation } from "react-i18next";

export function JoinClan() {
  const { t } = useTranslation();
  return (
    <div className="joinClan">
      <div className="joinClan__item">
        <div className="joinClan__item-title">
          <img
            src={rectImg}
            alt="rect"
            className="joinClan__item-title-img joinClan__item-title-img--Left"
          />
          <div className="joinClan__item-title-text">samplename team</div>
          <img
            src={rectImg}
            alt="rect"
            className="joinClan__item-title-img joinClan__item-title-img--Right"
          />
        </div>

        <div className="joinClan__item-main">
          {/* BLOCK */}
          <div className="joinClan__item-main-block">
            <img
              src={playersImg}
              alt="playersImg"
              className="joinClan__item-main-block-img"
            />
            <div className="joinClan__item-main-block-info">
              <div className="joinClan__item-main-block-info-key">
                {t("parternsModal.clansTab.players")}:
              </div>
              <div className="joinClan__item-main-block-info-value">12345</div>
            </div>
          </div>

          {/* BLOCK */}
          <div className="joinClan__item-main-block">
            <img
              src={cupImg}
              alt="playersImg"
              className="joinClan__item-main-block-img"
            />
            <div className="joinClan__item-main-block-info">
              <div className="joinClan__item-main-block-info-key">
                {t("parternsModal.clansTab.victories")}:
              </div>
              <div className="joinClan__item-main-block-info-value">123</div>
            </div>
          </div>
          <CuttedButton
            className="joinClan__item-main-requestBtn"
            text="заявка"
            size="small"
            callback={(e) => {
              e.stopPropagation();
            }}
          />
        </div>
      </div>

      <div className="joinClan__item joinClan__item--Mine">
        <div className="joinClan__item-title">
          <img
            src={rectImg}
            alt="rect"
            className="joinClan__item-title-img joinClan__item-title-img--Left"
          />
          <div className="joinClan__item-title-text">samplename team</div>
          <img
            src={rectImg}
            alt="rect"
            className="joinClan__item-title-img joinClan__item-title-img--Right"
          />
        </div>

        <div className="joinClan__item-main">
          {/* BLOCK */}
          <div className="joinClan__item-main-block">
            <img
              src={playersImg}
              alt="playersImg"
              className="joinClan__item-main-block-img"
            />
            <div className="joinClan__item-main-block-info">
              <div className="joinClan__item-main-block-info-key">
                {t("parternsModal.clansTab.players")}:
              </div>
              <div className="joinClan__item-main-block-info-value">12345</div>
            </div>
          </div>

          {/* BLOCK */}
          <div className="joinClan__item-main-block">
            <img
              src={cupImg}
              alt="playersImg"
              className="joinClan__item-main-block-img"
            />
            <div className="joinClan__item-main-block-info">
              <div className="joinClan__item-main-block-info-key">
                {t("parternsModal.clansTab.victories")}:
              </div>
              <div className="joinClan__item-main-block-info-value">123</div>
            </div>
          </div>
          <CuttedButton
            className="joinClan__item-main-requestBtn"
            text="выйти"
            size="small"
            callback={(e) => {
              e.stopPropagation();
            }}
          />
        </div>
      </div>

      <div className="joinClan__item">
        <div className="joinClan__item-title">
          <img
            src={rectImg}
            alt="rect"
            className="joinClan__item-title-img joinClan__item-title-img--Left"
          />
          <div className="joinClan__item-title-text">samplename team</div>
          <img
            src={rectImg}
            alt="rect"
            className="joinClan__item-title-img joinClan__item-title-img--Right"
          />
        </div>

        <div className="joinClan__item-main">
          {/* BLOCK */}
          <div className="joinClan__item-main-block">
            <img
              src={playersImg}
              alt="playersImg"
              className="joinClan__item-main-block-img"
            />
            <div className="joinClan__item-main-block-info">
              <div className="joinClan__item-main-block-info-key">
                {t("parternsModal.clansTab.players")}:
              </div>
              <div className="joinClan__item-main-block-info-value">12345</div>
            </div>
          </div>

          {/* BLOCK */}
          <div className="joinClan__item-main-block">
            <img
              src={cupImg}
              alt="playersImg"
              className="joinClan__item-main-block-img"
            />
            <div className="joinClan__item-main-block-info">
              <div className="joinClan__item-main-block-info-key">
                {t("parternsModal.clansTab.victories")}:
              </div>
              <div className="joinClan__item-main-block-info-value">123</div>
            </div>
          </div>
          <CuttedButton
            className="joinClan__item-main-requestBtn"
            text="заявка"
            size="small"
            callback={(e) => {
              e.stopPropagation();
            }}
          />
        </div>
      </div>
    </div>
  );
}
