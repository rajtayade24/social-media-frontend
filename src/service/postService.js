import { InfiniteQueryObserver, useQueryClient, QueryClient, useMutation } from "@tanstack/react-query";
import useAuthStore from "../store/useAuthStore";
import { apiFetch, BASE_URL } from "./api";

// export const fetchAllPosts = async ({ userId, page = 0, size = 10 }) => {
//   console.log("fetchAllPosts userId:", userId);
//   if (!userId) throw new Error("userId is required");
//   const path = `/posts/${userId}?page=${page}&size=${size}`;
//   return apiFetch(path);
// };

// export const fetchMyPosts = async (userId, page = 0, size = 10) => {
//   if (!userId) throw new Error("Userid is required");
//   const path = `/users/${userId}/posts`;
//   return await apiFetch(path)
// }

export const uploadPost = async (formData) => {
  try {
    const res = await fetch(`${BASE_URL}/posts`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const ct = res.headers.get("content-type") || "";
      const errBody = ct.includes("application/json") ? await res.json().catch(() => null) : await res.text().catch(() => null);
      const err = new Error((errBody && errBody.message) || `Upload failed: ${res.status}`);
      err.body = errBody;
      throw err;
    }

    return res.json();
  } catch (err) {
    console.log(err);
  }
};

export const deletePost = async (id, userId, tokenParam) => {
  if (!id) {
    console.warn("Post id is not found for detete", id);
    return;
  }
  const token = tokenParam ?? localStorage.getItem("token");
  try {
    const res = await fetch(`${BASE_URL}/api/posts/${id}/delete/${userId}`, {
      method: "DELETE", headers: { "Authorization": `Bearer ${token}`, },
    });

    if (!res.ok) throw new Error(`Unfollow failed: ${res.status}`);
    try { await res.json(); } catch (e) { }
    console.log("post delete result: ", res);
    // setAllFollowings(prev => prev.filter(f => f.followingId !== targetId));
  } catch (err) {
    console.error("Post delete error:", err);
  }
}


