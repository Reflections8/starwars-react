import { Link } from "react-router-dom";

export function Auth() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: "1rem",
      }}
    >
      <div style={{ fontSize: "12px" }}>AUTH PAGE IF NEEDED</div>
      <Link to={"/"}>To home page</Link>
    </div>
  );
}
