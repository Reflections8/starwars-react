export async function fetchTasks() {
  const token = localStorage.getItem("auth_jwt");
  if (!token || token == "") return [];
  try {
    const res = await fetch("https://socket.akronix.io/tasks/getTasks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await res.json();
    return result || [];
  } catch (e) {
    return [];
  }
}

export async function fetchClaimReward(id: number) {
  const token = localStorage.getItem("auth_jwt");
  if (!token || token === "") return { status: 401, result: [] };
  try {
    const res = await fetch("https://socket.akronix.io/tasks/claimTaskReward", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({ id }),
    });
    const result = await res.json();
    return { status: res.status, result: result || null };
  } catch (e) {
    return { result: null };
  }
}

export async function fetchTaskComplete(id: number) {
  const token = localStorage.getItem("auth_jwt");
  if (!token || token === "") return { status: 401, result: [] };
  try {
    const res = await fetch("https://socket.akronix.io/tasks/completeTask", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({ id }),
    });
    const result = await res.json();
    return { status: res.status, result: result || null };
  } catch (e) {
    return { result: null };
  }
}
