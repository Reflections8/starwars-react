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

export function Partners() {
  const pills: PillType[] = [
    {
      label: "Инфо",
      value: "INFO",
      component: <Info handleOuterPills={handleOuterPills} />,
    },
    {
      label: "Кланы",
      value: "CLANS",
      component: <Clans handleOuterPills={handleOuterPills} />,
    },
  ];
  const [activePill, setActivePill] = useState(pills[0]);

  const outerPills: PillType[] = [
    {
      label: "Список друзей",
      value: "FRIENDS_LIST",
      component: <FriendsList />,
    },
    {
      label: "Вступить в клан",
      value: "JOIN_CLAN",
      component: <JoinClan />,
    },
    {
      label: "Заявки в клан",
      value: "CLAN_REQUESTS",
      component: <ClanRequests />,
    },
    {
      label: "Состав клана",
      value: "CLAN_MEMBERS",
      component: <ClanMembers />,
    },
    {
      label: "Создат клан",
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
