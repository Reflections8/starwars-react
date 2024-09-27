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

export async function fetchUserPhoto(username: string) {
  const url = `https://t.me/i/userpic/160/${username}.jpg`;

  try {
    const res = await fetch(url, { redirect: "manual" });

    if (res.status === 302) {
      const location = res.headers.get("Location");
      if (location) {
        return location;
      }
    } else if (res.ok) {
      return url;
    }

    return null;
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
