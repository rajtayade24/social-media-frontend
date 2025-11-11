import React, { useEffect } from 'react'
import { BASE_URL } from '../../service/api';

import { relativeTimeCompact } from '../../utils/dateUtils';
import FollowsBtn from '../buttons/FollowsBtn';
import { UserCircle2Icon } from 'lucide-react';
import normalizeUrl from '../../utils/urlUtils';
import useAuthStore from '../../store/useAuthStore';

export default function ProfileLists(props) {
  const userMainId = useAuthStore(s => s.userMainId)
  // props.profile,
  // props.handleProfileSection,
  // props.handleFollow,
  // props.handleUnfollow,
  // props.showFollowBtn = false,
  // props.setCurrentFollowSection,
  // props.markAsReadNotification
  // isPost = false

  useEffect(() => {
    console.log("ProfileLists re-render", props.profile);
  }, [props.profile]);

  return (
    <li
      key={props.profile?.userid || props.profile?.id}
      className={`profiles flex justify-between items-center py-4 px-3 cursor-pointer text-[14px]
        dark:hover:bg-gray-950
      ${props.profile?.read !== undefined && !props.profile?.read ? "bg-blue-50 hover:bg-blue-100 " : "  hover:bg-gray-200"}
      `}>
      {/* Left: profile info */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          if (props.handleProfileSection) props.handleProfileSection(props.profile)
          if (props.setCurrentFollowSection) props.setCurrentFollowSection(null)
          if (props.handleOpenConversation && !props.markAsReadNotification) props.handleOpenConversation(props.profile)
          if (props.markAsReadNotification) props.markAsReadNotification(props.profile?.id)
        }}
        className="flex gap-2 w-full"
      >
        <span className='h-[45px] w-[45px] relative'>
          {props.profile?.profilePhotoUrl ?
            <img
              className="h-[45px] w-[45px] rounded-full"
              src={normalizeUrl(props.profile?.profilePhotoUrl)}
              alt="user profile"
            />
            : <UserCircle2Icon />
          }

          {(props.profile?.read !== undefined && !props.profile?.read) && (
            < span className='absolute right-1 bottom-1 h-2 w-2 bg-red-400 rounded-full'></span>
          )}
        </span>
        <div className="flex flex-col">
          <div>

            <span className="username font-bold mr-2">
              {props.profile?.username}
            </span>

            {props.markAsReadNotification && (
              <span>
                <span className=' mr-2'>
                  {props.profile?.message}
                </span>
                <span className="text-xs text-gray-500">
                  {relativeTimeCompact(props.profile?.createdAt)}
                </span>
              </span>
            )}

          </div>

          {!props.markAsReadNotification && (
            <div className="name text-gray-500">{props.profile?.name}</div>
          )}
        </div>
      </div>

      {props.showFollowBtn && (
        <FollowsBtn
          profile={props.profile}
          userMainId={props.userMainId}
          handleFollow={props.handleFollow}
          handleUnfollow={props.handleUnfollow}
        />
      )}

      {props.isMessagesSection &&
        <div className="text-right">
          <div className="text-xs text-gray-500">{props.profile?.lastMessageAt ? new Date(props.profile?.lastMessageAt).toLocaleString() : ''}</div>
          {props.profile?.unreadCount > 0 && <div className="text-xs bg-red-500 text-white rounded px-2">{props.profile?.unreadCount}</div>}
        </div>
      }
    </li >
  )
}
