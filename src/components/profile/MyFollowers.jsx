import React, { useEffect, useRef, useState } from "react";
import DeleteFollows from '../confirm/DeleteFollows'
import useAuthStore from "../../store/useAuthStore";
import { BASE_URL } from "../../service/api";
import { useUserFollowers } from "../../hooks/useUserFollowers";
import { UserCircle2Icon } from "lucide-react";
import normalizeUrl from "../../utils/urlUtils";

export default function MyFollowers(props) {
  const profileId = useAuthStore(s => s.profileId)

  const myFollowers = useAuthStore(s => s.myFollowers)
  const isFollower = useAuthStore(s => s.isFollower)

  const inputRef = useRef(null)
  const [searchValue, setSearchValue] = useState("");
  const [selectedFollower, setSelectedFollower] = useState(null); // track modal follower

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
  } = useUserFollowers(profileId)

  useEffect(() => {
    if (profileId && !isLoading) refetch();
  }, [profileId]);

  const filteredFollowers = allFollows.filter(
    (f) =>
      f.username.toLowerCase().includes(searchValue.toLowerCase()) ||
      f.name.toLowerCase().includes(searchValue.toLowerCase())
  );
  const checkIsFollower = (profile) => {
    console.log(profile);
    return (isFollower(profile.userId ?? profile.id))
  }

  if (isLoading) return <div>Loading followings?...</div>;
  if (isError) return <div>Error loading following: {String(error)}</div>;

  return (
    <div className="fixed inset-0  bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-[400px] min-h-[400px] max-h-[500px] rounded-2xl shadow-lg flex flex-col dark:bg-[#2c2932]">
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h2 className="text-lg font-semibold">Followers</h2>
          <button
            type="button"
            onClick={() => props.setCurrentFollowSection(null)}
            className="text-gray-500 hover:text-black text-5xl cursor-pointer "
          >&times;</button>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b relative flex items-center">
          <input
            ref={inputRef}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
            className='w-full py-2 px-4 bg-gray-100 border-0 rounded-[8px] outline-none  dark:bg-[#1e1c21]'
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
          {filteredFollowers.map((f) => (
            <li
              key={f.id ?? f.userId}
              className="flex justify-between items-center px-4 py-2 hover:bg-gray-50 dark:hover:bg-[#1e1c21]"
            >
              <div className="flex items-center gap-3">
                {f.profilePhotoUrl ?

                  <img
                    src={normalizeUrl(f.profilePhotoUrl)}
                    alt={"profile"}
                    className="w-10 h-10 rounded-full"
                  />
                  : <UserCircle2Icon />
                }
                <div className="flex flex-col">
                  <div className="font-medium text-sm">
                    {f.username}
                  </div>
                  <span className="text-gray-500 text-xs">{f.name}</span>
                </div>
              </div>

              <button
                className={`px-4 py-1 text-sm font-medium rounded-full cursor-pointer transition
                  ${checkIsFollower(f) ? 'bg-gray-300 text-gray-900 hover:bg-blue-600' : 'bg-gray-200 text-gray-400'}`}
                onClick={() => {
                  if (checkIsFollower(f)) {
                    setSelectedFollower(f);
                  } else {
                  }
                }}
              >
                {checkIsFollower(f) ? 'Remove' : 'Removed'}
              </button>
            </li>
          ))}
        </ul>
      </div>


      {selectedFollower && (
        <DeleteFollows
          setConformation={setSelectedFollower}
          onConfirm={props.handleRemoveFollower}
          myFollows={myFollowers}
          currentFollow={selectedFollower}
          desc="Remove this follower? They won't be notified directly"
        />
      )}


    </div >
  );
};
