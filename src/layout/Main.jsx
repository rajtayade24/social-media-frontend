import Section from "../pages/Section"
import Aside from "../components/Aside"
import { useEffect, useRef, useState }
  from "react";

function Main(props) {

  return (
    <main className="main flex justify-center p-4 ml-auto relative w-[calc(100%-70px)] xl:w-[calc(100%-250px)] max-[600px]:w-[100%]">
      <Section
        userMainId={props.userMainId}
        allPosts={props.allPosts}
        setAllPosts={props.setAllPosts}
        userImageSrc={props.userImageSrc}

        myPosts={props.myPosts}
        handleFollow={props.handleFollow}
        handleUnfollow={props.handleUnfollow}
        followedUsers={props.followedUsers}
        setFollowedUsers={props.setFollowedUsers}
        BASE_URL={props.BASE_URL}

        navigate={props.navigate}

        handleProfileSection={props.handleProfileSection}
      />
      <Aside
        userMainId={props.userMainId}
        userImageSrc={props.userImageSrc}
        username={props.username}
        actualName={props.actualName}
        setProfileSectionShown={props.setProfileSectionShown}
        handleFollow={props.handleFollow}
        handleUnfollow={props.handleUnfollow}
        followedUsers={props.followedUsers}
        setFollowedUsers={props.setFollowedUsers}
        allUsers={props.allUsers}
        setAllUsers={props.setAllUsers}
        BASE_URL={props.BASE_URL}
        recs={props.recs}
        setRecs={props.setRecs}



        handleProfileSection={props.handleProfileSection}
      />
    </main>
  )
}


export default Main