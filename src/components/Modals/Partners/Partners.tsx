import "./styles/partners.css";
import userIcon from "./img/user.svg";

export function Partners() {
  const partners = [];

  // TODO: mock data
  for (let i = 0; i < 50; i++) {
    partners.push({
      link: "#",
      name: "@1pashadu123123123rov",
      model: "1droid",
      profit: 321,
    });
  }

  return (
    <div className="partners">
      <div className="partners__header">
        <div className="partners__header-name">Name</div>
        <div className="partners__header-model">Model</div>
        <div className="partners__header-profit">Profit</div>
      </div>

      <div className="modal__scrollContainer">
        <div className="partners__list">
          {partners.map((row) => {
            return (
              <div className="partners__list-item">
                <div className="partners__list-item-nameBlock">
                  <img
                    src={userIcon}
                    alt="user"
                    className="partners__list-item-nameBlock-icon"
                  />
                  <a
                    href={row.link}
                    className="partners__list-item-nameBlock-name"
                  >
                    {row.name}
                  </a>
                </div>

                <div className="partners__list-item-model">{row.model}</div>

                <div className="partners__list-item-profit">{row.profit}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="modal__scrollContainer__bottomGradient"></div>
    </div>
  );
}
