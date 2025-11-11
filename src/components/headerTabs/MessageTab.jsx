import CurrentConversationSection from "./CurrentConversationSection"
import ProfileLists from '../lists/ProfileLists';

export default function MessageTab(props) {
  const { isMessagesSection } = props;

  return (
    <div className={`flex bg-white dark:bg-[#1e1c21] overflow-hidden ${isMessagesSection ? 'w-full' : 'w-0'}`}>
      
      {/* LEFT PANEL */}
      <div className={`search-section rounded-r-3xl shadow-[1px_0px_7px_0px_gray] p-4 transition-all duration-500 ease-out h-full ${isMessagesSection ? 'w-[350px]' : 'w-0'}`}>
        <div className="text-2xl p-2 font-semibold">Messages</div>

        <div className="overflow-auto scrollbar-hide">
          {props.loadingMessagedUsers && <div>Loading...</div>}
          {!props.loadingMessagedUsers && props.conversations.length === 0 && <div className="text-sm text-gray-500">No conversations yet.</div>}

          {props.conversations.map((c, i) => (
            <ProfileLists
              key={i}
              profile={c}
              isMessagesSection={true}
              handleOpenConversation={props.handleOpenConversation}
            />
          ))}
        </div>
      </div>

      {/* RIGHT PANEL (chat area) */}
      <CurrentConversationSection
        conversationId={props.conversationId}

        loadingMessagedUsers={props.loadingMessagedUsers}
        conversations={props.conversations}
        activeConversation={props.activeConversation}
        messages={props.messages}
        messageText={props.messageText}
        isTyping={props.isTyping}
        otherUserTyping={props.otherUserTyping}
        page={props.page}

        setLoadingMessagedUsers={props.setLoadingMessagedUsers}
        setConversations={props.setConversations}
        setActiveConversation={props.setActiveConversation}
        setMessages={props.setMessages}
        setMessageText={props.setMessageText}
        setIsTyping={props.setIsTyping}
        setOtherUserTyping={props.setOtherUserTyping}
        setPage={props.setPage}

        messagesEndRef={props.messagesEndRef}
        pageSize={props.pageSize}
        refreshInterval={props.refreshInterval}

        userMainId={props.userMainId}
        handleProfileSection={props.handleProfileSection}
        handleOpenConversation={props.handleOpenConversation}
        handleEmojiClick={props.handleEmojiClick}
        sendMessageToUser={props.sendMessageToUser}

        darkMode={props.darkMode}
      />
    </div >
  );
}

