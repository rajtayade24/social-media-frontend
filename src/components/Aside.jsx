import React, { useEffect, useState } from 'react'
import Recommendations from './recomendation/Recommendations'
import useAuthStore from '../store/useAuthStore'
import normalizeUrl from "../utils/urlUtils"
import { UserCircle2Icon } from 'lucide-react'

function Aside(props) {

  const user = useAuthStore(s => s.user)

  return (
    <>
      <aside className="aside h-12/12 w-[400px] pl-[60px] pt-[30px] text-[14px] hidden min-[1150px]:block">
        <div className="profile-sec">

          <div className="main-profile flex justify-between items-center my-5 mx-3">
            <div
              onClick={() => props.handleProfileSection()}
              className='flex gap-2 cursor-pointer'
            >

              <span>
                {user?.profilePhotoUrl ?
                  <img className="h-[45px] w-[45px] rounded-full" alt="user profile"
                    src={normalizeUrl(user?.profilePhotoUrl)} />
                  : <UserCircle2Icon />
                }
              </span>
              <div className="flex flex-col">
                <div className="username">{user?.username}</div>
                <div className="name text-gray-500">{user?.actualName}</div>
              </div>
            </div>
            {/* <button className='cursor-pointer'>switch</button> */}
          </div>

          <Recommendations
            userMainId={props.userMainId}
            handleFollow={props.handleFollow}
            handleUnfollow={props.handleUnfollow}
            myFollowings={props.myFollowings}
            recs={props.recs} setRecs={props.setRecs}




          />

          <div>

            <footer className='footer opacity-50 flex flex-wrap gap-3 leading-2'>
              <a className='text-[12px] text-gray-500'>About</a>
              <a className='text-[12px] text-gray-500'>Help</a>
              <a className='text-[12px] text-gray-500'>Press</a>
              <a className='text-[12px] text-gray-500'>API</a>
              <a className='text-[12px] text-gray-500'>Jobs</a>
              <a className='text-[12px] text-gray-500'>Privacy</a>
              <a className='text-[12px] text-gray-500'>Terms</a>
              <a className='text-[12px] text-gray-500'>Locations</a>
              <a className='text-[12px] text-gray-500'>Language</a>
              <a className='text-[12px] text-gray-500'>Meta Verified</a>
              <p className='mt-4'>© 2025 ReelJolly </p>
            </footer>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Aside