import React from 'react'
import { relativeTimeCompact } from '../../utils/dateUtils'
import {  MoreHorizontal, UserCircle2Icon } from 'lucide-react'
import normalizeUrl from '../../utils/urlUtils'

const PostsProfileCard = ({ post, handleProfileSection, setShowPostMenu }) => {

  return (
    <div className="profiles flex justify-between items-center my-4">
      <div
        onClick={() => handleProfileSection(post)}
        className="flex gap-2"
      >
        <span className='cursor-pointer'>
          {post?.profilePhotoUrl ?
            <img
              className="h-[45px] w-[45px] rounded-full"
              src={normalizeUrl(post?.profilePhotoUrl)}
              alt="user profile"
            />
            : <UserCircle2Icon />
          }
        </span>
        <div className="flex flex-col">
          <div className="username cursor-pointer">
            {post?.username}
            <span className="mx-1 ">·</span>
            <span className='text-gray-400 text-sm'>{relativeTimeCompact(post?.createdAt)}</span>
          </div>
        </div>
      </div>
      <button
        onClick={setShowPostMenu}
        className='cursor-pointer'
      >
        <MoreHorizontal />
      </button>
    </div>
  )
}

export default PostsProfileCard
