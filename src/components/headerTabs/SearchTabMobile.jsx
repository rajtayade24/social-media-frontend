import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import useAuthStore from "../../store/useAuthStore";
import { getAllUsers } from "../../service/userService";
import ProfileLists from "../lists/ProfileLists";

export default function SearchTabMobile(props) {
  const [searchValue, setSearchValue] = useState("");
  const [showAll, setShowAll] = useState(false);

  const userMainId = useAuthStore(s => s.userMainId)
  const { allUsers, setAllUsers } = useAuthStore()

  useEffect(() => {
    const fetchUsers = async (id) => {
      setAllUsers(await getAllUsers(id))
    }
    fetchUsers(userMainId);
  }, [userMainId])

  const filteredUsers = allUsers?.filter(
    (profile) =>
      profile?.username.toLowerCase().includes(searchValue.toLowerCase()) ||
      profile?.name.toLowerCase().includes(searchValue.toLowerCase())
  );
  const usersToShow = showAll ? filteredUsers : filteredUsers?.slice(0, 10)

  const [portalEl] = useState(() =>
    typeof document !== "undefined" ? document.createElement("div") : null
  );
  // Mount portal element into body
  useEffect(() => {
    if (!portalEl) return;
    portalEl.className = "search-modal-portal"; // optional class for global styling
    document.body.appendChild(portalEl);
    return () => {
      if (document.body.contains(portalEl)) document.body.removeChild(portalEl);
    };
  }, [portalEl]);

  // Don't render if not open or SSR
  if (!portalEl || !props.isDisplaySearchSection) return null;

  // Portal modal
  const modal = (
    <div
      className="absolute z-[9] left-18 top-3 w-[100vw-100px] max-w-[400px] max-h-[85vh] overflow-hidden 
       bg-white dark:bg-[#1e1c21] rounded-xl shadow-xl flex flex-col animate-[fadeIn_0.3s_ease]"
      onClick={props.handleBackdropClick}
    >
      <div className="w-[100%] input flex items-center relative p-1 border-b border-gray-400 dark:border-gray-600">
        <input
          ref={props.inputRef}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-[calc(100% - 50px)] py-2 px-4 bg-gray-300 border-0 rounded-[8px] outline-none dark:bg-[#2a282d] dark:text-[#fafafa]"
          type="text"
          placeholder="Search"
          value={searchValue}
        />

        {searchValue.length > 0 ? (
          <button
            onClick={() => setSearchValue("")}
            className="h-8 w-8 flex items-center justify-center absolute right-8 bg-gray-300 rounded-full cursor-pointer dark:bg-gray-500"
          >
            &times;
          </button>
        ) : (
          <button
            onClick={props.inputHandler}
            className="h-8 w-8 flex items-center justify-center absolute right-2 bg-gray-300 rounded-full cursor-pointer dark:bg-gray-500"
          >
            <i className="bi bi-search text-[10px]"></i>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <ul className="list-none">
          {searchValue !== "" &&
            usersToShow.map((profile) => (
              <ProfileLists
                profile={profile}
                handleProfileSection={props.handleProfileSection}
                handleFollow={props.handleFollow}
                handleUnfollow={props.handleUnfollow}

                showFollowBtn={true}
                key={profile?.id}
              />
            ))}
        </ul>

        {searchValue !== "" && filteredUsers.length > 10 && (
          <div className="p-4 text-center">
            <button
              onClick={() => setShowAll((prev) => !prev)}
              className="text-blue-500 hover:underline"
            >
              {showAll ? "Show Less" : "Show More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modal, portalEl);
}
