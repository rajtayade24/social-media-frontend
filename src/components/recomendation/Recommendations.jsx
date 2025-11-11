// inside a component (or a custom hook)
import React, { useEffect, useState } from "react";
import { apiFetch, BASE_URL } from "../../service/api";
import useAuthStore from "../../store/useAuthStore";


export default function Recommendations(props) {
  const userMainId = useAuthStore(s => s.userMainId)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isFollowing = useAuthStore(s => s.isFollowing)
  const getRecommendations = async (id, limit = 10) => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch(`/api/users/${id}/recommendations?limit=${limit}`);
      props.setRecs(Array.isArray(data) ? data : []);

      console.log("recomendataion section", data);
    } catch (err) {
      console.error("getRecommendations error:", err);
      setError(err.message || "Failed to load recommendations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (props.userMainId) getRecommendations(props.userMainId, 10);
  }, [props.userMainId]);


  if (loading) return <div>Loading recommendations…</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div>
      <h3 className="font-semibold mb-2">People you may know</h3>
      <ul className="space-y-3">
        {props.recs.map((u) => (
          <li key={u.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="cursor-pointer">
                <img
                  className="w-10 h-10 rounded-full object-cover"
                  src={u.profilePhotoUrl ? `${u.profilePhotoUrl.startsWith("http") ? "" : ""}${u.profilePhotoUrl}` : "/placeholder.png"}
                  alt="userprofile"
                />
              </span>
              <div>
                <div className="font-medium text-sm cursor-pointer">
                  {u.username}
                </div>
                <div className="text-xs text-gray-500 cursor-pointer">
                  {u.name}
                </div>
              </div>
            </div>

            <div>
              {isFollowing(u.id) ? (
                <button
                  className="px-3 py-1 rounded-full bg-gray-300 text-gray-800 cursor-pointer"
                  onClick={() => {
                    props.handleUnfollow(u.id)

                    props.setMyFollowings((prev) => {
                      const next = new Set(prev);
                      next.delete(u.id);
                      return next
                    })
                  }}
                >
                  Following
                </button>
              ) : (
                <button
                  className="px-3 py-1 rounded-full bg-blue-600 text-white cursor-pointer"
                  onClick={() => {
                    props.handleFollow(u.id)

                    props.setMyFollowings((prev) => {
                      const next = new Set(prev);
                      next.add(u.id);
                      return next
                    })

                  }}
                >Follow</button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div >
  );
}
