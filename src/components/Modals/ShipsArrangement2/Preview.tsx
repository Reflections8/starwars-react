import { useState } from "react";
import { Gameboard } from "./gameboard";
import Player from "./player";

export function Preview() {
  const [user, setUser] = useState(new Player("User"));
  const [userGameboard, setUserGameboard] = useState(new Gameboard());

  return <></>;
}
