import { useEffect, useState } from "react";
import { SlidingPills } from "../../../ui/SlidingPills/SlidingPills";
import { PillType } from "../../../ui/SlidingPills/types";
import "./styles/partners.css";
import { Info } from "./components/Info/Info";
import { Clans } from "./components/Clans/Clans";
import { FriendsList } from "./components/FriendsList/FriendsList";
import { JoinClan } from "./components/JoinClan/JoinClan";
import { ClanRequests } from "./components/ClanRequests/ClanRequests";
import { ClanMembers } from "./components/ClanMembers/ClanMembers";
import { CreateClan } from "./components/CreateClan/CreateClan";
import { useTranslation } from "react-i18next";

export function Partners() {
  const { t } = useTranslation();

  const pills: PillType[] = [
    {
      label: t("partnersModal.infoTab.title"),
      value: "INFO",
      component: <Info handleOuterPills={handleOuterPills} />,
    },
    {
      label: t("partnersModal.clansTab.title"),
      value: "CLANS",
      component: <Clans handleOuterPills={handleOuterPills} />,
    },
  ];
  const [activePill, setActivePill] = useState(pills[0]);

  const outerPills: PillType[] = [
    {
      label: t("partnersModal.clansTab.friendsList"),
      value: "FRIENDS_LIST",
      component: <FriendsList />,
    },
    {
      label: t("partnersModal.clansTab.joinClan"),
      value: "JOIN_CLAN",
      component: <JoinClan />,
    },
    {
      label: t("partnersModal.clansTab.clanRequests"),
      value: "CLAN_REQUESTS",
      component: <ClanRequests />,
    },
    {
      label: t("partnersModal.clansTab.clanMembers"),
      value: "CLAN_MEMBERS",
      component: <ClanMembers />,
    },
    {
      label: t("partnersModal.clansTab.createClan"),
      value: "CREATE_CLAN",
      component: <CreateClan />,
    },
  ];

  function handleOuterPills(pillValue: string) {
    const matchedPill = outerPills.find((pill) => pill.value === pillValue);
    if (matchedPill) {
      setActivePill(matchedPill);
    }
  }

  useEffect(() => {}, []);

  return (
    <div className="partners">
      <div className="partners__pills">
        <SlidingPills
          pills={pills}
          activePill={activePill}
          setActivePill={setActivePill}
        />
      </div>

      <div className="modal__scrollContainer">{activePill.component}</div>
      <div className="modal__scrollContainer__bottomGradient"></div>
    </div>
  );
}
