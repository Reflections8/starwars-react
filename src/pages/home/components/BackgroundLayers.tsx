import texture from "../../../components/Header/img/texture.png";

export function BackgroundLayers() {
  return (
    <>
      <div className="radialGradient" />

      {/* <div className="topLinearGradient" /> */}
      <img src={texture} className="topTexture" />

      {/* <div className="bottomLinearGradient" /> */}
      <img src={texture} className="bottomTexture" />
    </>
  );
}
