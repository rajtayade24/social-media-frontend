import React, { useEffect } from 'react'
import { BASE_URL } from '../../service/api';

import MessageList from '../lists/MessageList';
import ChatForm from '../form/ChatForm';
import { ChevronLeft } from 'lucide-react';

export default function CurrentConversationSection(props) {

  useEffect(() => {
    console.log(props?.activeConversation?.participant);
  }, [props.activeConversation])

  return (
    <div className="conversions mt-4 flex-1 flex flex-col p-2 relative">

      {props.activeConversation ? (
        <>
          <div className='flex gap-2'>
            <div className='flex items-center justify-center'>


              <ChevronLeft
                onClick={() => props.setActiveConversation(null)}
                size={32}
              />

            </div>
            <div
              onClick={() => props.handleProfileSection(props.activeConversation.participant)}
              className="flex items-center gap-3 p-2 border-b w-full">
              <img
                src={
                  props.activeConversation.participant.profilePhotoUrl?.startsWith('http')
                    ? props.activeConversation.participant.profilePhotoUrl
                    : BASE_URL + props.activeConversation.participant.profilePhotoUrl
                }
                alt="pf"
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <div className="font-semibold">{props.activeConversation.participant.username}</div>
                <div className="text-xs text-gray-500">{props.activeConversation.participant.name}</div>
              </div>
            </div>
          </div>

          <ul className="flex-1 overflow-auto scrollbar-hide p-2">
            {props.messages.length === 0 && <li className="text-sm text-gray-500">No messages yet. Say hi 👋</li>}
            {props.messages.map((m, i) => {
              return (
                <MessageList
                  key={m.id || i}
                  m={m}
                  mine={m.senderId === props.userMainId}
                />
              );
            })}
            {props.isTyping && (
              <div className="text-xs text-gray-400 italic mt-1 ml-2">You are typing...</div>
            )}
            {props.otherUserTyping && (
              <div className="text-xs text-gray-500 italic mb-2">typing...</div>
            )}
            <div ref={props.messagesEndRef} />
          </ul>

          <ChatForm
            sendMessageToUser={props.sendMessageToUser}
            activeConversation={props.activeConversation}
            darkMode={props.darkMode}
          />
        </>
      ) : (
        <div className="text-sm text-gray-500 p-4">Select or search a user to start messaging.</div>
      )}
    </div>
  )
}
