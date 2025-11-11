import useAuthStore from "../store/useAuthStore";
import useNotificationStore from "../store/useNotificationStore ";
import { apiFetch, BASE_URL } from "./api";

export const fetchUnreadNotificationCount = async (mountedRef) => {
  const userMainId = useAuthStore.getState().userMainId; // ✅ safe outside React
  const setUnreadNotificationCount = useNotificationStore.getState().setUnreadNotificationCount;

  if (!userMainId) return;

  try {
    const count = await apiFetch(`/api/users/${userMainId}/notifications/unread-count`);

    if (mountedRef.current) setUnreadNotificationCount(Number(count));
    return Number(count)
  } catch (e) {
    console.warn(e);
    return 0
  }
};

export const deleteNotificationByActorIdAndRecipientIdByTypeLike = async (payload) => {
  try {
    const res = await fetch(`${BASE_URL}/api/users/${payload.actorId}/notifications/${payload.recipientId}/by-type?type=LIKE`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`, // if using JWT
      },
    })
    if (res.ok) {
      console.log(`Notifications deleted for actor=${payload.actorId}, recipient=${payload.recipientId}`);
      return true;
    } else {
      const errorData = await res.json().catch(() => ({ status: res.status }));
      console.error("Failed to delete notifications:", errorData);
      return false;
    }
  } catch (err) {
    console.error("Error deleting notifications:", err);
    return false;
  }
}