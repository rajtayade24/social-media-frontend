import CurrentConversationSection from "./CurrentConversationSection"
import ProfileLists from '../lists/ProfileLists';
import { createElement, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft } from "lucide-react";

export default function MessageTabMobile(props) {
  const { isMessagesSection } = props;

  // portalEl is only created when the modal should open
  const [portalEl, setPortalEl] = useState(null);

  useEffect(() => {
    if (!isMessagesSection) {
      // if modal is closed, make sure portal is removed
      if (portalEl && document.body.contains(portalEl)) {
        document.body.removeChild(portalEl);
        setPortalEl(null);
      }
      return;
    }

    // Create and append portal when opening
    const el = document.createElement("div");
    el.className = "messages-modal-portal absolute top-0 left-0 z-[999] min-w-[100vw] h-[calc(100vh-56px)] bg-white dark:bg-[#1e1c21]";
    document.body.appendChild(el);
    setPortalEl(el);

    // Cleanup: remove portal when closed / unmounted
    return () => {
      if (document.body.contains(el)) document.body.removeChild(el);
      setPortalEl(null);
    };
  }, [isMessagesSection]); // run when isMessagesSection toggles

  // Don't render if not open or SSR
  if (!portalEl || !isMessagesSection) return null; 

  const handleClose = () => {
    props.setActiveSection(null)
  }

  const modal = (
    <div className={`flex bg-white dark:bg-[#1e1c21] overflow-hidden h-full`}>

      {!props.activeConversation ? (
        <div className={`message-section p-4 transition-all duration-500 ease-out h-full w-full`}>

          <div className="flex gap-2 items-center justify-center relative">
            <ChevronLeft size={32}
              onClick={() => handleClose()}
              className=" absolute left-1"
            />
            <div className="text-2xl p-2 font-semibold">Messages</div>
          </div>

          <div className="overflow-auto scrollbar-hide w-full">
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
      ) :
        <CurrentConversationSection
          isMessagesSection={isMessagesSection}
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
      }
    </div >
  );

  return createPortal(modal, portalEl);
}

