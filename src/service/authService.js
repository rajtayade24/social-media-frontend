import { apiFetch, BASE_URL } from "./api";

export async function loginRequest({ identifier, userPassword }) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, userPassword }),
  });

  // try parse JSON safely
  let payload;
  try {
    payload = await res.json();
    console.log("login user:", payload);
  } catch (e) { payload = null; }

  return { ok: res.ok, status: res.status, payload };
}

export async function signupRequest(formData) {
  try {
    const res = await fetch(`${BASE_URL}/users`, {
      method: "POST",
      body: formData,
    });
    const contentType = res.headers.get("content-type") || "";
    const data = contentType.includes("application/json") ? await res.json() : await res.text();
    console.log(data);

    if (!res.ok) {
      return { ok: false, status: res.status, data };
    }

    return { ok: true, status: res.status, data };
  } catch (err) {
    console.error("signupRequest error:", err);
    return { ok: false, status: 0, error: err?.message || String(err) };
  }
}

export const getUnreadCountMessage = async (userId) => {
  try {
    const data = await apiFetch(`/api/users/${userId}/conversations/unread-count`); console.log(data);
    return data.unreadConversations || 0;
  } catch (err) {
    console.error("Error fetching follower IDs:", err);
    return [];
  }
};

export const getAllFollowerIds = async (userId) => {
  try {
    const data = await apiFetch(`/api/followers/${userId}`); console.log(data);
    return data.followers || [];
  } catch (err) {
    console.error("Error fetching follower IDs:", err);
    return [];
  }
};

export const getAllFollowingIds = async (userId) => {
  try {
    const data = await apiFetch(`/api/following/${userId}`); console.log(data);
    return data.following || [];
  } catch (err) {
    console.error("Error fetching following IDs:", err);
    return [];
  }
};
