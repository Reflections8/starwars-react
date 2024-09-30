import { FC, useEffect, useState } from "react";
import { useSound } from "../../../../context/SeaContexts";
import { useBattleships } from "../../../../context/BattleshipsContext";
import { useModal } from "../../../../context/ModalContext";
import { ClearedTimer } from "../../SeaBattle/components/ClearedTimer/ClearedTimer";

const initialSeconds = 60;
export const Timer: FC<{
  onRandom: () => void;
}> = ({ onRandom }) => {
  const {
    handshakeTimer,
    isInitial,
    setMyBoardState,
    setBlockedState,
    gameboard,
    setHandshakeTimer,
  } = useBattleships();
  const { closeModal } = useModal();
  const { startBackgroundAudio } = useSound();

  const handleStartGame = () => {
    setMyBoardState((prev: any) => ({
      ...prev,
      ships: gameboard.ships.map((s: any) => {
        return {
          ship: s.ship,
          pos: s.pos,
        };
      }),
    }));
    startBackgroundAudio();
    closeModal!();
    setBlockedState(false);
  };

  const [remainTime, setRemainTime] = useState(initialSeconds * 1000);
  useEffect(() => {
    if (!isInitial) {
      setRemainTime(5 * 1000);
      return;
    }
    if (handshakeTimer.state === 3 || handshakeTimer.state === 4) {
      setRemainTime(handshakeTimer.time * 1000);
      setHandshakeTimer({ time: 0, state: 0 });
    }
  }, [isInitial, handshakeTimer]);

  return (
    <ClearedTimer
      remainTime={remainTime}
      callback={() => (isInitial ? onRandom() : handleStartGame())}
    />
  );
};
