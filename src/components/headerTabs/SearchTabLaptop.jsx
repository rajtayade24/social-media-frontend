import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import ProfileLists from "../lists/ProfileLists"
import useAuthStore from '../../store/useAuthStore';
import { getAllUsers } from '../../service/userService';

export default function SearchTabLaptop(props) {
  const [searchValue, setSearchValue] = useState("");
  const [showAll, setShowAll] = useState(false)

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

  return (
    <div
      onClick={() => props.handleBackdropClick}
      className={`search-section bg-white rounded-r-3xl shadow-[1px_0px_7px_0px_gray] transition-all duration-[500ms] ease-out overflow-hidden dark:bg-[#1e1c21]
       ${props.isDisplaySearchSection ? "w-[350px]" : "w-0"}
          `}>
      <div className={`search`}>
        <div className='text-2xl p-6'>Search</div>
      </div>

      <div className='input flex items-center relative w-full p-4 border-b-1 border-gray-400'>
        <input
          ref={props.inputRef}
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
          className='w-full py-2 px-4 bg-gray-100 border-0 rounded-[8px] outline-none dark:bg-[#1e1c21] dark:text-[#fafafa]'
          type="text"
          placeholder='Search'
          value={searchValue}
        />

        {searchValue.length > 0 ? (
          <button
            onClick={() => setSearchValue("")}
            className="h-8 w-8 flex items-center justify-center absolute right-8 bg-gray-300 rounded-full cursor-pointer dark:bg-gray-500  "
          >
            &times;
          </button>
        ) : (
          <button
            onClick={props.inputHandler}
            className="h-8 w-8 flex items-center justify-center absolute right-8 bg-gray-300 rounded-full cursor-pointer dark:bg-gray-500 "
          >
            <i className="bi bi-search text-[10px]"></i>
          </button>
        )}
      </div>

      <div className="user-list-cont overflow-y-auto h-[calc(100vh-152px)]">
        <ul className="user-list list-none">
          {searchValue !== "" &&
            usersToShow?.map((profile, index) => (
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

        {/* Show more button */}
        {searchValue !== "" && filteredUsers?.length > 10 && (
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

  )
}