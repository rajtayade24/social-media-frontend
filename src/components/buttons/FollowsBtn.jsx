import React, { useState } from 'react'
import useAuthStore from '../../store/useAuthStore';
import DeleteFollows from '../confirm/DeleteFollows';

export default function FollowsBtn(props) {
  const userMainId = useAuthStore(s => s.userMainId)

  const isFollowing = useAuthStore(s => s.isFollowing)

  const following = isFollowing(props.profile?.userId ?? props.profile?.id)

  const [selectedUnfollow, setSelectedUnfollow] = useState(null); // track modal follower

  return (
    <>
      <div>
        {!following ? (
          <button
            className="px-3 py-1 rounded-full bg-blue-600 text-white cursor-pointer"
            onClick={() => {
              props.handleFollow(props.profile?.userId ?? props.profile?.id, userMainId);

              // if (props.postNotification) {
              //   console.log(props.profile);
              //   props.postNotification({
              //     recipientId: props.profile?.userId ?? props.profile?.id,
              //     actorId: userMainId,
              //     type: "FOLLOW",
              //   });
              // }
            }}
          >
            Follow
          </button>
        ) : (
          <button
            className="px-3 py-1 rounded-full bg-gray-300 text-gray-800 cursor-pointer"
            onClick={() => {
              setSelectedUnfollow && setSelectedUnfollow(props.profile)
            }}
          >
            Following
          </button>
        )}
      </div>

      {selectedUnfollow && (
        <DeleteFollows
          setConformation={setSelectedUnfollow}
          onConfirm={props.handleUnfollow}
          currentFollow={selectedUnfollow}
          desc="Do you want to unfollow"
        />
      )}

    </>
  )
}
