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
  const url = `https://t.me/i/userpic/160/${username}.jpg`;
  const url2 = `
    https://cdn4.cdn-telegram.org/file/JTm996sF1M2cKijtvnzy1e0V3P4J5jysUXM-kBSgh1lVyrTNLRfj-3Hizt5sPBmBkC-FF32ZTDWo5RCv2MmmGwyvyDTRSbvwkDrHKxvmFJa7U45CQ7E2rDs0wZ4frzNGRc2t8CXNUwSFe_2y2ZVZsn_JVZzcvUL4g25eXrIjx3-Eq1xEHhGxhIuxU4DxPHYt7nDYGJQPk0ambu6VtQeLDWVtrvoOqKDenWLublwnV3bHTcaa_-EKql_CpUJEFhTaLGurn6m5vOhm9cO4gK99hZjNJv3Hb7O-R8VtY6S0F4heZpYm8mA5uW-2zCgyMnDAAgb6gfg5X-iLD4fFFj5few.jpg`;

  try {
    const res = await fetch(url, { redirect: "follow" });
    console.log({ resAva: res });

    if (res.status === 302) {
      const location = res.headers.get("Location");
      if (location) {
        return location;
      }
    } else if (res.ok) {
      console.log({ resOkAva: res });
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
