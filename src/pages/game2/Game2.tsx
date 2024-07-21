import { useEffect } from "react";
import { Header } from "../../components/Header/Header";
import { useModal } from "../../context/ModalContext";
import { LeaveIcon } from "../../icons/Leave";
import { RulesIcon } from "../../icons/Rules";
import "./styles/game2.css";

export function Game2() {
  const { openModal } = useModal();

  useEffect(() => {
    //  openModal!("seaBattle");
  }, []);
  return (
    <div>
      <Header
        position={"bottom"}
        leftIcon={<RulesIcon />}
        leftText={"Правила"}
        leftAction={() => {
          openModal!("seaBattle", -1);
        }}
        rightIcon={<LeaveIcon />}
        rightText={"Сдаться"}
        rightAction={() => {}}
      />
    </div>
  );
}
