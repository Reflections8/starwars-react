import stormtrooperImg from "../img/characters/imperial-stormtrooper.png";
import anotherImg from "../img/characters/another.png";
import pedestalImg from "../img/pedestal.png";
import ringsImg from "../img/rings.png";
import '../styles/characterModel.css'

type CharacterModelProps = {
  type: string;
};

export function CharaсterModel({ type }: CharacterModelProps) {
  function defineModel() {
    if (type === "stormtrooper") {
      return stormtrooperImg;
    }
    if (type === "another") {
      return anotherImg;
    }
  }

  return (
    <div className="characterBlock">
      <img
        src={pedestalImg}
        alt="pedestal"
        className="characterBlock__pedestal"
      />
      <img src={ringsImg} alt="pedestal" className="characterBlock__rings" />

      <img src={defineModel()} className="characterBlock__model" />
    </div>
  );
}
