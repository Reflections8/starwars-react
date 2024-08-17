import "./styles/FriendsList.css";
import userIcon from "./img/User.svg";

export function FriendsList() {
  const friends = [];

  for (let i = 0; i < 50; i++) {
    friends.push({
      link: "#",
      name: "@1pashadu123123123rov",
      profit: 321,
    });
  }

  return (
    <div className="friendsList">
      <div className="friendsList__header">
        <div className="friendsList__header-name">Name</div>
        <div className="friendsList__header-profit">Profit</div>
      </div>

      <div className="friendsList__list">
        {friends.map((row) => {
          return (
            <div className="friendsList__list-item">
              <div className="friendsList__list-item-nameBlock">
                <img
                  src={userIcon}
                  alt="user"
                  className="friendsList__list-item-nameBlock-icon"
                />
                <a
                  href={row.link}
                  className="friendsList__list-item-nameBlock-name"
                >
                  {row.name}
                </a>
              </div>

              <div className="friendsList__list-item-profit">
                {row.profit} TON
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
