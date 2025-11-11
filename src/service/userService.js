// // src/service/userService.js
import { apiFetch, BASE_URL } from "./api";

export const getAllUsers = async (id) => {
  try {
    const users = await apiFetch(`/users/${id}`); console.log(users);
    return users;
  } catch (err) {
    console.log("Unable to get all users", err.message);
  }
}

export const getPostCount = async (userId) => {
  try {
    const data = await apiFetch(`/users/${userId}/posts/count`); console.log(data);
    return data; // returns number
  } catch (err) {
    console.error("Failed to get post count:", err);
    return 0;
  }
};

export const getFollowingCount = async (userId) => {
  try {
    const data = await apiFetch(`/api/users/${userId}/following/count`); console.log(data);
    return data.followings; // returns number
  } catch (err) {
    console.error("Failed to get following count:", err);
    return 0;
  }
};

export const getFollowersCount = async (userId) => {
  try {
    const data = await apiFetch(`/api/users/${userId}/followers/count`); console.log(data);
    return data.followers; // returns number
  } catch (err) {
    console.error("Failed to get followers count:", err);
    return 0;
  }
};

export const follow = async (targetId, userMainId, token) => {
  const userId = userMainId;
  console.log("following:", { targetId, userMainId });
  try {
    const res = await fetch(`${BASE_URL}/api/follow/${targetId}?userId=${userMainId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    }
    );

    if (!res.ok) throw new Error(`Follow failed: ${res.status}`);

    try { await res.json(); } catch (e) { }

  } catch (err) {
    console.error("handleFollow error:", err);
  }
};

export const unFollow = async (targetId, userMainId, token) => {
  const userId = userMainId;
  if (!userMainId || !targetId) return;
  if (!targetId) {
    console.warn("handleUnfollow called with falsy targetId", targetId);
    return;
  }
  console.log("Unfollowing:", { targetId, userMainId });

  try {
    const res = await fetch(`${BASE_URL}/api/follow/${targetId}?userId=${userMainId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error(`Unfollow failed: ${res.status}`);

    try { await res.json(); } catch (e) { }

  } catch (err) {
    console.error("handleUnfollow error:", err);
  }
};
