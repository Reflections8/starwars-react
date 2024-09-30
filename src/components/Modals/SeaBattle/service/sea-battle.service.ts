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

export async function fetchStats() {
  const token = localStorage.getItem("auth_jwt");
  try {
    const res = await fetch("https://socket.akronix.io/shipBattle/getStats", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch (e) {
    return [];
  }
}

export async function fetchUserPhoto(username: string) {
  const url = `https://socket.akronix.io/main/getTgImageLink?username=${username}`;

  try {
    const res = await fetch(url);
    const json = await res.json();
    if (json?.image) {
      return json?.image;
    } else {
      return null;
    }
  } catch (e) {
    return null;
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
