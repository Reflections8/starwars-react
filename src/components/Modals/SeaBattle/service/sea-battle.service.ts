export async function fetchRooms() {
  const token = localStorage.getItem("auth_jwt");
  try {
    const res = await fetch("https://socket.akronix.io/shipBattle/getRooms", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch (e) {
    return [];
  }
}

export async function getMe() {
  const token = localStorage.getItem("auth_jwt");
  try {
    const res = await fetch("https://socket.akronix.io/main/getUsername", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch (e) {
    return [];
  }
}
