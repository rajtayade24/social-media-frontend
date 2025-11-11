import React from 'react'

import { Volume2, VolumeOff } from 'lucide-react';

const MediaCardMain = ({ videoRef, fileUrl, index, sounded, handleSound, isCommentSection, isFromMyProfile }) => {

  if (fileUrl.endsWith(".mp4"))
    return (
      <>
        <video
          ref={videoRef}
          data-index={index}
          className={`${isCommentSection && isCommentSection ? "h-full max-w-[650px]" : "max-h-170 m-auto"}`}
          loop
          playsInline
          autoPlay={isFromMyProfile ? true : index === 0}
          muted={!sounded}
          src={fileUrl}
        >
        </video>
        <span
          className='absolute sound w-10 h-10 bottom-5 right-5 rounded-full bg-gray-700 flex justify-center items-center p-2.5 cursor-pointer'
          onClick={() => handleSound(index)}
        >

          {sounded ? <Volume2 size={24} color='white' /> : <VolumeOff size={24} color='white' />}
        </span>

      </>
    )
  else
    return (
      <img
        ref={videoRef}
        data-index={index}
        className="w-[350px] min-h-[475px] m-auto"
        src={fileUrl} alt="post" />
    )
}

export default MediaCardMain
