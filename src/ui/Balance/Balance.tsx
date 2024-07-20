import "./styles/Balance.css";

type BalanceProps = {
  icon1: string;
  name1: string;
  value1: string | number;

  icon2: string;
  name2: string;
  value2: string | number;

  icon3: string;
  name3: string;
  value3: string | number;
};

export function Balance({
  icon1,
  name1,
  value1,

  icon2,
  name2,
  value2,

  icon3,
  name3,
  value3,
}: BalanceProps) {
  return (
    <div className="balance">
      <div className="balance-box">
        <div className="balance-box-key">
          <img src={icon1} alt="icon" className="balance-box-key-icon" />
          <div className="balance-box-key-title">{name1}</div>
        </div>

        <div className="balance-box-value">{value1}</div>
      </div>

      <div className="balance-box">
        <div className="balance-box-key">
          <img src={icon2} alt="icon" className="balance-box-key-icon" />
          <div className="balance-box-key-title">{name2}</div>
        </div>

        <div className="balance-box-value">{value2}</div>
      </div>

      <div className="balance-box">
        <div className="balance-box-key">
          <img src={icon3} alt="icon" className="balance-box-key-icon" />
          <div className="balance-box-key-title">{name3}</div>
        </div>

        <div className="balance-box-value">{value3}</div>
      </div>
    </div>
  );
}
