import React, { useState } from 'react'
import { ImageMinus, Smile } from 'lucide-react'
import EmojiPicker from 'emoji-picker-react';


const ChatForm = (props) => {
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        if (props.isCommentSection) {
          const done = await props.postComment(text)
          if (done) setText("")
        } else {
          const done = await props.sendMessageToUser(props.activeConversation?.participant, text);
          if (done) setText("")
        }
      }}

      method="POST"
      className='h-12 flex justify-between items-center gap-4 p-3'
    >
      <span
        onClick={() => setShowEmojiPicker((p) => !p)}
        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
      >
        <Smile size={24} />
      </span>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a message..."
        className="flex-1 border rounded px-3 py-2"
      />

      <button
        type="submit"
        disabled={text === ""}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300 cursor-pointer"
      >
        {props.isCommentSection ? "Post" : "Send"}
      </button>

      {showEmojiPicker && (
        <div className="absolute bottom-14 left-2 z-50">
          <EmojiPicker onEmojiClick={handleEmojiClick}
            theme={props.darkMode ? "dark" : "light"} />
        </div>
      )}
    </form>
  )
}

export default ChatForm;
