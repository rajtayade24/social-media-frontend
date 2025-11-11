import React from 'react'

export default function MessageList({ m, mine }) {
  return (
    <li
      className={`mb-2 flex ${mine ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`p-2 rounded-lg max-w-[70%] break-words shadow-sm 
      ${mine
            ? "bg-blue-500 text-white"
            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
          }`}
      >
        <div className="text-sm">{m.content}</div>
        <div
          className={`text-[10px] mt-1 ${mine ? "text-blue-200" : "text-gray-500 dark:text-gray-400"
            }`}
        >
          {new Date(m.createdAt).toLocaleString()}
        </div>
      </div>
    </li>

  )
}
