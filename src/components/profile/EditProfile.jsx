import React, { useEffect, useState } from 'react'
import useAuthStore from '../../store/useAuthStore';
import { BASE_URL } from '../../service/api';

export default function EditProfile(props) {
  const { signup, userImageSrc, setUserImageSrc, setVerificationStatus, setVerificationSuccess, verificationStatus, verificationSuccess } = useAuthStore()
  const { updateStatus, setUpdateStatus, updateSuccess, setUpdateSuccess, user, token, setUser, setProfile } = useAuthStore()

  const [updatedUsername, setUpdatedUsername] = useState('')
  const [updatedName, setUpdatedName] = useState("")
  const [updatedBio, setUpdatedBio] = useState("")

  useEffect(() => {
    setUpdatedUsername(user?.username || "")
    setUpdatedName(user?.name || "")
    setUpdatedBio(user?.bio || "Add Bio")
  }, [user])

  const handleEditProfile = async (username, name, bio) => {
   const email = user.email
    if (!email) {
      alert("No user email available — please login.");
      return false;
    }
    console.log(username, name, bio);
    if (!username || username.length < 3) {
      alert("Username must be at least 3 characters");
      return false;
    }

    try {
      const encoded = encodeURIComponent(email || "");

      const res = await fetch(`${BASE_URL}/users/email/${encoded}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ username, name, bio })
      });

      // parse response
      const contentType = res.headers.get("content-type") || "";
      const data = contentType.includes("application/json") ? await res.json() : null;
      console.log(data);

      if (!res.ok) {
        console.error("Profile update failed", res.status, data);
        throw new Error(data?.message || `Update failed (${res.status})`);
      }

      console.log("Profile edited", data);
      if (data.success) {
        setUpdateSuccess(data.success)
        setUpdateStatus(data.status)
      }
      if (data.user) {
        setUser(prev => ({ ...prev, ...data.user }));
        setProfile(prev => ({ ...prev, ...data.user }));
      }

      try {
        const current = JSON.parse(localStorage.getItem("currentUser") || "{}");
        const merged = { ...current, ...data };
        localStorage.setItem("currentUser", JSON.stringify(merged));
      } catch (e) {
        console.warn("Failed to update currentUser in localStorage", e);
      }

      closeSection()
      return true;
    } catch (err) {
      setUpdateSuccess(err.success)
      setUpdateStatus(err.message)
      console.error("handleEditProfile error:", err);
      return false;
    }
  };

  const closeSection = () => {
    props.setEditProfile(false)
  }
  const handleBackdropClick = () => {
    closeSection()
  };

  return (
    <div
      onClick={() => handleBackdropClick}
      className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white w-[400px] min-h-[400px] max-h-[500px] rounded-2xl shadow-lg flex flex-col  dark:bg-[#2c2932]">
        <div className="form-cont w-96 p-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEditProfile(updatedUsername.trim(), updatedName.trim(), updatedBio.trim());
            }}
            className="flex flex-col gap-3"
          >
            <div className={`font-[Pacifico] text-[28px] ig-logo py-3 px-5 font-bold active:text-gray-500 text-center`}>ReelJolly</div>

            <input
              name="username"
              className="border rounded-sm px-3 py-2 text-sm"
              value={updatedUsername}
              onChange={(e) => setUpdatedUsername(e.target.value)}
              type="text"
              id="updateUsername"
              placeholder="Edit username"
              required
            />
            <input
              name="name"
              className="border rounded-sm px-3 py-2 text-sm"
              value={updatedName}
              onChange={(e) => setUpdatedName(e.target.value)}
              type="text"
              id="updateName"
              placeholder="Edit Name"
              required
            />

            <input
              name="bio"
              className="border rounded-sm px-3 py-2 text-sm"
              value={updatedBio}
              onChange={(e) => setUpdatedBio(e.target.value)}
              type="text"
              id="updateName"
              placeholder={`${updatedBio === "Add Bio" ? "Add Bio" : "Edti Bio"}`}
              required
            />
            <p>{updateStatus}</p>
            <button
              className="bg-blue-400 border rounded-sm px-3 py-2 text-sm cursor-pointer"
              type="submit"
            >
              Update
            </button>
          </form>
        </div>


        <button
          onClick={() => closeSection()}
          className="absolute top-5 right-10 px-4 py-2 rounded text-5xl cursor-pointer"
        >
          &times;
        </button>

      </div>
    </div >
  )
}
