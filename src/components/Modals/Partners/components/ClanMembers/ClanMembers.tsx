import "./styles/ClanMemebers.css";
import userIcon from "./img/User.svg";
import xIcon from "./img/x.svg";

export function ClanMembers() {
  const clanMembers = [];

  for (let i = 0; i < 50; i++) {
    clanMembers.push({
      link: "#",
      name: "@1pashadu123123123rov",
      model: "shtormtropphwufeijds",
      action: () => null,
    });
  }

  return (
    <div className="clanMembers">
      <div className="clanMembers__header">
        <div className="clanMembers__header-name">Name</div>
        <div className="clanMembers__header-model">Model</div>
      </div>

      <div className="clanMembers__list">
        {clanMembers.map((row) => {
          return (
            <div className="clanMembers__list-item">
              <div className="clanMembers__list-item-nameBlock">
                <img
                  src={userIcon}
                  alt="user"
                  className="clanMembers__list-item-nameBlock-icon"
                />
                <a
                  href={row.link}
                  className="clanMembers__list-item-nameBlock-name"
                >
                  {row.name}
                </a>
              </div>

              <div className="clanMembers__list-item-model">{row.model}</div>

              <img
                src={xIcon}
                alt="x"
                className="clanMembers__list-item-xIcon"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
