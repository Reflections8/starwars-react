import "./styles/ClanRequests.css";
import avatar from "./img/ava.png";
import xIcon from "./img/x.svg";
import vIcon from "./img/v.svg";
import { useTranslation } from "react-i18next";

export function ClanRequests() {
  const { t } = useTranslation();
  const requests = [];

  for (let i = 0; i < 10; i++) {
    requests.push({
      link: "#",
      name: "@1pashadu123123123rov",
      model: "shtormtropphwufeijds",
    });
  }

  return (
    <div className="clanRequests">
      {requests.map((row) => {
        return (
          <div className="clanRequests__item">
            <img
              src={avatar}
              alt="avatar"
              className="clanRequests__item-avatar"
            />
            <div className="clanRequests__item-block clanRequests__item-block--Name">
              <div className="clanRequests__item-block-key">
                {t("partnersModal.clansTab.login")}:
              </div>
              <a href={row.link} className="clanRequests__item-block-value">
                {row.name}
              </a>
            </div>

            <div className="clanRequests__item-block clanRequests__item-block--Model">
              <div className="clanRequests__item-block-key">
                {t("partnersModal.clansTab.warrior")}:
              </div>
              <div className="clanRequests__item-block-value">{row.model}</div>
            </div>

            <div className="clanRequests__item-actions">
              <img
                src={vIcon}
                alt="v"
                className="clanRequests__item-block-actions-item"
              />
              <img
                src={xIcon}
                alt="x"
                className="clanRequests__item-block-actions-item"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
