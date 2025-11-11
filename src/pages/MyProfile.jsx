import React, { useEffect, useState } from "react";
import { UserCheck2Icon } from "lucide-react";
import MyPosts from '../components/profile/MyPosts'
import MyFollowers from '../components/profile/MyFollowers'
import MyFollowings from '../components/profile/Myfollowings'
import EditProfile from '../components/profile/EditProfile';

import { useNavigate } from "react-router-dom";
import FollowsBtn from "../components/buttons/FollowsBtn";
import useAuthStore from "../store/useAuthStore";
import normalizeUrl from "../utils/urlUtils";

const mobileWidth = 600;
export default function MyProfile(props) {
  const windowWidth = useAuthStore(s => s.windowWidth)
  const isFollowing = useAuthStore(s => s.isFollowing)
  const postCount = useAuthStore(s => s.postCount)

  const navigate = useNavigate()

  const [editProfile, setEditProfile] = useState(false);
  const [showPosts, setShowPosts] = useState(true);
  const [currentFollowSection, setCurrentFollowSection] = useState(null)

  const profile = useAuthStore(s => s.profile)

  useEffect(() => {
    if (props.updateSuccess === true)
      setEditProfile(false);
  }, [props.updateSuccess]);

  return (
    <section
      className={`flex justify-center p-4 relative w-[calc(100%-70px)] min-h-screen xl:w-[calc(100%-250px)] max-[600px]:w-[100%] dark:bg-[#1e1c21] dark:text-[#fafafa]
              ${windowWidth > mobileWidth ? "ml-auto" : "mx-auto"}`}
    >

      <div className="max-w-5xl mx-auto py-8">

        <div className={`max-w-[500px] grid grid-cols-[1fr_2fr] mx-auto gap-4
                     ${windowWidth > mobileWidth && " px-6 "}`}>

          <div className="flex justify-center items-center row-span-2 max-[800px]:min-w-20">
            {profile?.profilePhotoUrl ?
              <img
                src={normalizeUrl(profile?.profilePhotoUrl)}
                alt="Profile"
                className="w-36 h-36 rounded-full border-2 border-gray-300 object-cover max-[800px]:h-16 max-[800px]:w-16"
              />
              : <UserCheck2Icon />
            }
          </div>

          <div className="relative flex flex-wrap gap-x-4 gap-y-2">
            <div className="flex flex-wrap gap-2">

              <h2 className="text-2xl font-bold inline ">
                {profile?.username}
              </h2>

              {(props.userMainId === profile?.userId || props.userMainId === profile?.recipientId || props.userMainId === profile?.id) ? (
                <div className="flex gap-3">
                  <button
                    onClick={() => setEditProfile(true)}
                    className="bg-gray-200 hover:bg-gray-300 px-4 py-1 rounded text-sm font-semibold  cursor-pointer dark:bg-[#2c2932] dark:hover:bg-gray-800"
                  >
                    Edit profile
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <FollowsBtn
                    isFollowing={isFollowing(profile?.id)}
                    profile={profile}
                    userMainId={props.userMainId}
                    handleFollow={props.handleFollow}
                    handleUnfollow={props.handleUnfollow}
                  />

                  <button
                    onClick={() => {
                      props.handleOpenConversation()

                      props.setActiveSection(props.activeSection === "messages" ? null : "messages");
                      if (props.activeSection !== "messages") navigate("/messages", { state: { background: location } });
                    }}

                    type="button"
                    className="bg-gray-200 hover:bg-gray-300 px-4 py-1 rounded text-sm font-semibold cursor-pointer dark:bg-[#2c2932] dark:hover:bg-gray-800"
                  >
                    Messages
                  </button>
                </div>
              )}
            </div>

            <div className="name mt-2" >
              <span className="">{profile?.name}</span>
            </div>

            <div className="flex gap-8 text-sm mt-2">
              <button className="font-semibold ">
                <span className="font-semibold">{postCount}</span> posts
              </button>
              <button
                type="button"                            // <- ensure this
                onClick={() => {
                  console.log("Follower button clicked"); // debug
                  setCurrentFollowSection("follower")

                }}
                className="font-semibold cursor-pointer "
              >
                <span>{props.followerCount}</span> followers
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentFollowSection("following")
                }}
                className="font-semibold cursor-pointer">
                <span >{props.followingCount}</span> followings
              </button>
            </div>

            <div className="mt-3 text-sm">
              <p>{profile?.bio}</p>
            </div>

          </div>

        </div>

        {/* Tabs */}
        <div className="flex justify-center mt-12 border-b border-gray-300">
          <div className="flex gap-12 text-sm uppercase font-semibold tracking-wider mt-2">
            <button className="pb-2 border-black  border-b-2">Posts</button>
          </div>
        </div>

        {/* Empty posts */}
        <div className="flex flex-col items-center justify-center py-20 text-center">
          {showPosts && (
            <MyPosts
              isLoginSection={props.isLoginSection}
              username={profile?.username}
              selectedFiles={props.selectedFiles} setSelectedFiles={props.setSelectedFiles} caption={props.caption} setCaption={props.setCaption}
              myPosts={props.myPosts}
              userMainId={props.userMainId}

              BASE_URL={props.BASE_URL}
              relativeTimeCompact={props.relativeTimeCompact}
              navigate={props.navigate}
            />
          )}
        </div>
      </div>

      {currentFollowSection === "following" && (
        <MyFollowings
          setCurrentFollowSection={setCurrentFollowSection}
          currentFollowSection={currentFollowSection}
          setAllFollows={props.setAllFollowings}
          myFollowings={props.myFollowings}

          handleFollow={props.handleFollow}
          handleUnfollow={props.handleUnfollow}
          handleProfileSection={props.handleProfileSection}
        />
      )}

      {currentFollowSection === "follower" && (
        <MyFollowers
          setCurrentFollowSection={setCurrentFollowSection}
          currentFollowSection={currentFollowSection}
          allFollows={props.allFollowers}
          setAllFollows={props.setAllFollowers}
          myFollowers={props.myFollowers}

          handleRemoveFollower={props.handleRemoveFollower}
          handleProfileSection={props.handleProfileSection}
        />
      )}


      {editProfile && (
        <EditProfile
          setEditProfile={setEditProfile}
          handleEditProfile={props.handleEditProfile}
          updateStatus={props.updateStatus}
        />
      )}
    </section>
  );
}
