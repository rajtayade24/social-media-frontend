import React from 'react'

import { Heart, Send, MessageCircle, Save, } from "lucide-react";

const PostActionIcons = (props) => {

  return (
    <div className="flex justify-between items-center my-2">
      {/* <div className="flex gap-6"> */}

      <button onClick={() => props.handleLike(props.post, props.index)}>
        <Heart
          size={24}
          className={`cursor-pointer transition-transform duration-200
            ${props.animate ? "scale-150" : "scale-100"} hover:opacity-50 `}
          color={props.isLikedByUser ? "red" : "gray"} // <-- set the color here
          fill={props.isLikedByUser ? "red" : "none"}  // fill the heart when liked
        />
      </button>


      <button onClick={() => {
        props.openCommentSection(props.index)
      }}
      ><MessageCircle />
      </button>
      <button>
        <Send />
      </button>

      {/* </div> */}
      <button onClick={() => props.toggleSave(props.index)}>
        <Save fill={props.isSavedByUser ? 'black' : "none"} />
      </button>

    </div>

  )
}

export default PostActionIcons