import React, { useEffect, useRef, useState } from "react";
import DeleteFollows from '../confirm/DeleteFollows'
import { BASE_URL } from "../../service/api";
import ProfileLists from "../lists/ProfileLists";
import useAuthStore from "../../store/useAuthStore";
import { useUserFollowings } from "../../hooks/useUserFollowings";

export default function MyFollowings(props) {
  const profileId = useAuthStore(s => s.profileId)

  const inputRef = useRef(null)
  const [searchValue, setSearchValue] = useState("");

  const inputHandler = () => {
    inputRef.current?.focus()
  }

  const {
    allFollows,
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useUserFollowings(profileId)

  useEffect(() => {
    if (profileId && !isLoading) refetch();
  }, [profileId]);

  const filteredFollows = allFollows?.filter(
    (f) =>
      f?.username.toLowerCase().includes(searchValue.toLowerCase()) ||
      f?.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  if (isLoading) return <div>Loading followings?...</div>;
  if (isError) return <div>Error loading following: {String(error)}</div>;

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-[400px] min-h-[400px] max-h-[500px] rounded-2xl shadow-lg flex flex-col  dark:bg-[#2c2932]">

        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h2 className="text-lg font-semibold">Followings</h2>
          <button
            type="button"
            onClick={() => props.setCurrentFollowSection(null)}
            className="text-gray-500 hover:text-black text-5xl cursor-pointer"
          >&times;</button>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b relative flex items-center">
          <input
            ref={inputRef}
            onChange={(e) => setSearchValue(e.target.value)}
            className='w-full py-2 px-4 bg-gray-100 border-0 rounded-[8px] outline-none dark:bg-[#1e1c21]'
            type="text"
            placeholder='Search'
            value={searchValue}
          />

          {searchValue.length > 0 ? (
            <button
              onClick={() => setSearchValue("")}
              className="h-8 w-8 flex items-center justify-center absolute right-8 bg-gray-300 rounded-full cursor-pointer dark:bg-[#2c2932]"
            >
              &times;
            </button>
          ) : (
            <button
              onClick={inputHandler}
              className="h-8 w-8 flex items-center justify-center absolute right-8 bg-gray-300 rounded-full cursor-pointer dark:bg-[#2c2932]"
            >
              <i className="bi bi-search text-[10px]"></i>
            </button>
          )}
        </div>

        {/* Followers List */}
        <ul className="flex-1 overflow-y-auto">
          {filteredFollows.map((profile) => (
            <ProfileLists
              profile={profile}
              handleProfileSection={props.handleProfileSection}
              handleFollow={props.handleFollow}
              handleUnfollow={props.handleUnfollow}

              showFollowBtn={true}

              setCurrentFollowSection={props.setCurrentFollowSection}
              key={profile?.userid || profile?.id}
            />
          ))}
        </ul>
      </div>
    </div >
  );
};
