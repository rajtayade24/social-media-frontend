// Header.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ig_icon from "../assets/ig-icon.png"
import SearchTabLaptop from "../components/headerTabs/SearchTabLaptop"
import SearchTabMobile from "../components/headerTabs/SearchTabMobile";
import NotificationTab from "../components/headerTabs/NotificationTab";
import MoreTab from "../components/headerTabs/MoreTab";
import MessageTab from "../components/headerTabs/MessageTab";

import useAuthStore from "../store/useAuthStore";
import { UserCircle2Icon } from "lucide-react";
import normalizeUrl from "../utils/urlUtils";
import NotificationTabMobile from "../components/headerTabs/NotificationTabMobile";
import MessageTabMobile from "../components/headerTabs/MessageTabMobile";

function Header(props) {
  const user = useAuthStore(s => s.user)
  const activeSection = useAuthStore(s => s.activeSection);
  const setActiveSection = useAuthStore(s => s.setActiveSection);
  const unreadCountMessage = useAuthStore(s => s.unreadCountMessage);

  const { windowWidth, setWindowWidth } = useAuthStore();

  const navigate = useNavigate();
  const location = useLocation();


  const mobileWidth = 600

  const [isDisplayedNavLabels, setDisplayedNavLabels] = useState(true);

  // useEffect(() => {
  //   if (location.pathname === "/upload") setActiveSection("upload");
  //   else if (location.pathname === "/messages") setActiveSection("messages");
  //   else if (location.pathname === "/notifications") setActiveSection("notifications");
  //   else setActiveSection("profile");
  // }, [location.pathname]);

  useEffect(() => {
    if (activeSection === "search") {
      setDisplayedNavLabels(false);
    } else setDisplayedNavLabels(windowWidth > 1280);
  }, [activeSection, windowWidth]);

  const go = (path) => {
    navigate(path);
    if (typeof props.setProfileSectionShown === "function") props.setProfileSectionShown(false);
  };

  const handleClose = () => {
    setActiveSection(null)
    navigate(-1);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const inputRef = useRef(null)
  const inputHandler = () => {
    inputRef.current?.focus()
  }

  return (
    <header
      className={`header fixed h-full flex overflow-y-visible bg-white dark:bg-[#2c2932] dark:text-[#fafafa] top-0 left-0
           ${windowWidth > 600 ? "top-0 left-0 z-50  px-2 "
          : "-z-50 inset-0 w-full"}
              `}>
      <div className={`h-full border-r-2 border-r-gray-300 relative dark:border-r-gray-700
          ${windowWidth > 600 ? "" : "w-full "}
          `}>

        {/* Logo */}
        <div
          className={`logo flex items-center mx-1 cursor-pointer
                    ${windowWidth > 600 ? " my-6 " : "absolute z-50 top-2 left-0"}
              `}
          onClick={() => {
            go("/");
            if (windowWidth > mobileWidth) setDisplayedNavLabels(true);
            props.setProfileSectionShown(false);
            setActiveSection(null)
          }}
        >
          <div

            className={`${windowWidth > mobileWidth ? "w-10 h-10" : "w-8 h-8"} bg-gray-200 flex justify-center items-center m-3 rounded-xl ${isDisplayedNavLabels ? "hidden" : "block"
              }`}
          >
            <img src={ig_icon} alt="logo" />
          </div>
          <div
            className={`font-[Pacifico] text-[28px] ig-logo py-3 px-5 font-bold ${isDisplayedNavLabels ? "block" : "hidden"
              } active:text-gray-500`}
          >
            ReelJolly
          </div>
        </div>

        {/* Nav */}
        <nav
          className={`flex
              ${windowWidth > 600 ? "flex-col  justify-center px-2.5"
              : "flex-row absolute z-[99] bottom-0 w-full left-0 bg-white dark:bg-[#1e1c21] justify-evenly"}
              `}>
          <div
            onClick={() => {
              go("/");
              if (windowWidth > mobileWidth) setDisplayedNavLabels(true);
              props.setProfileSectionShown(false);
              setActiveSection(null)
            }}
            className={`nav-link p-2.5 flex gap-3 items-center rounded-xl cursor-pointer active:scale-95 ${isDisplayedNavLabels ? "w-[230px]" : "w-auto justify-center"
              } ${activeSection === null ? "bg-gray-300 font-bold dark:bg-gray-700" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
          >
            <i className={`bi mx-1 bi-house-door text-[24px]`}></i>
            <span className={isDisplayedNavLabels ? "block" : "hidden"}>Home</span>
          </div>

          {windowWidth > mobileWidth && (
            <div
              onClick={() => {
                setActiveSection(activeSection === "search" ? null : "search");
                inputHandler()
              }}
              className={`nav-link p-2.5 flex gap-3 items-center rounded-xl cursor-pointer active:scale-95 ${isDisplayedNavLabels ? "w-[230px]" : "w-auto justify-center"
                } ${activeSection === "search" ? "bg-gray-300 font-bold dark:bg-gray-700" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
            >
              <i className={`bi mx-1 bi-search text-[24px] `}></i>
              <span className={isDisplayedNavLabels ? "block" : "hidden"}>Search</span>
            </div>
          )}

          {/* <div
              onClick={() => {
                go("/explore");
                if (windowWidth > mobileWidth) setDisplayedNavLabels(true);
                setActiveSection(null)
              }}
              className={`nav-link p-2.5 flex gap-3 items-center rounded-xl cursor-pointer active:scale-95 ${isDisplayedNavLabels ? "w-[230px]" : "w-auto justify-center" 
              } ${activeSection === "explore" ? "bg-gray-300 font-bold dark:bg-gray-700" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
              >
              <i className={`bi mx-1 bi-compass text-[24px] `}></i>
              <span className={isDisplayedNavLabels ? "block" : "hidden"}>Explore</span>
              </div> */}

          {/* <div
              onClick={() => {
                go("/reels");
                if (windowWidth > mobileWidth) setDisplayedNavLabels(true);
                setActiveSection(null)
                }}
                className={`nav-link p-2.5 flex gap-3 items-center rounded-xl cursor-pointer active:scale-95 ${isDisplayedNavLabels ? "w-[230px]" : "w-auto justify-center" 
                } ${activeSection === "reels" ? "bg-gray-300 font-bold dark:bg-gray-700" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
                >
                <i className={`bi mx-1 bi-camera-reels text-[24px]`}></i>
                <span className={isDisplayedNavLabels ? "block" : "hidden"}>Reels</span>
                </div> */}

          <div
            onClick={() => {
              setActiveSection(activeSection === "messages" ? null : "messages");
              if (activeSection !== "messages") navigate("/messages", { state: { background: location } });
              else navigate(-1);
            }}

            className={`nav-link p-2.5 flex gap-3 items-center rounded-xl cursor-pointer active:scale-95  
                ${isDisplayedNavLabels ? "w-[230px]" : "w-auto justify-center"} 
                
                ${activeSection === "messages" ? "bg-gray-300 font-bold dark:bg-gray-700" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
          >
            <span className="flex justify-center items-center relative">
              {Number(unreadCountMessage) > 0 && (
                <span className="w-5 h-5 text-[12px] flex justify-center items-center bg-red-600 absolute top-[-4px] right-[-4px] p-0.5 rounded-[50%]"
                >{unreadCountMessage}</span>
              )}
              <i className={`bi mx-1 bi-chat-left text-[24px]`}></i>
            </span>
            <span className={isDisplayedNavLabels ? "block" : "hidden"}>Messages</span>
          </div>

          <div
            onClick={() => {
              if (activeSection === "notifications") {
                navigate(-1); // close overlay and go back to previous route
              } else {
                setActiveSection("notifications");
                navigate("/notifications", { state: { background: location } }); // open overlay
              }
            }}
            className={`nav-link p-2.5 flex gap-3 items-center rounded-xl cursor-pointer active:scale-95  
                   ${isDisplayedNavLabels ? "w-[230px]" : "w-auto justify-center"}
                   ${activeSection === "notifications" ? "bg-gray-300 font-bold dark:bg-gray-700"
                : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
          >
            <span className="flex justify-center items-center relative">
              {Number(props.unreadNotificationCount) > 0 && (
                <span className="w-5 h-5 text-[12px] flex justify-center items-center bg-red-600 absolute top-[-4px] right-[-4px] p-0.5 rounded-[50%]"
                >{props.unreadNotificationCount}</span>
              )}
              <i className="bi mx-1 bi-heart text-[24px]" />
            </span>
            <span className={isDisplayedNavLabels ? "block" : "hidden"}>Notifications</span>
          </div>

          <div
            onClick={() => {
              if (windowWidth > mobileWidth) setDisplayedNavLabels(true);
              navigate("/upload", { state: { background: location } });
              setActiveSection("upload");
            }}
            className={`nav-link p-2.5 flex gap-3 items-center rounded-xl cursor-pointer active:scale-95 ${isDisplayedNavLabels ? "w-[230px]" : "w-auto justify-center"
              } ${activeSection === "upload" ? "bg-gray-300 font-bold dark:bg-gray-700" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
          >
            <i className={`bi mx-1 bi-plus-square text-[24px]`}></i>
            <span className={isDisplayedNavLabels ? "block" : "hidden"}>Upload</span>
          </div>

          <div
            onClick={() => {
              if (windowWidth > mobileWidth) setDisplayedNavLabels(true);
              props.handleProfileSection(null)
            }}
            className={`nav-link p-2.5 flex gap-3 items-center rounded-xl cursor-pointer active:scale-95 ${isDisplayedNavLabels ? "w-[230px]" : "w-auto justify-center"
              } ${activeSection === "profile" ? "bg-gray-300 font-bold dark:bg-gray-700" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
          >
            {user?.profilePhotoUrl ?
              <img
                src={normalizeUrl(user?.profilePhotoUrl)}
                alt="profile"
                className="img w-8 h-8 border-2 rounded-[50%] border-gray-500"
              />
              : <UserCircle2Icon />
            }
            <span className={isDisplayedNavLabels ? "block" : "hidden"}>Profile</span>
          </div>
        </nav>

        <div
          onClick={() => {
            setActiveSection(activeSection === "more" ? null : "more");
          }}
          className={`nav-link p-2.5 flex gap-3 items-center rounded-xl cursor-pointer active:scale-95 
               ${isDisplayedNavLabels ? "w-[230px]" : "w-auto justify-center"}
               ${windowWidth > mobileWidth ? "absolute bottom-4" : "absolute z-50 top-2 right-2"}
              //  ${activeSection === "more" ? "bg-gray-300 font-bold dark:bg-gray-700" : "hover:bg-gray-100 dark:hover:bg-gray-800"}
              `}
        >
          <i className={`bi mx-1 bi-list text-[24px] `}></i>
          <span className={isDisplayedNavLabels ? "block" : "hidden"}>More</span>
        </div>
      </div>


      {windowWidth > mobileWidth ? (
        < SearchTabLaptop
          inputRef={inputRef}
          inputHandler={inputHandler}
          isDisplayedNavLabels={isDisplayedNavLabels}
          isDisplaySearchSection={activeSection === "search"}
          BASE_URL={props.BASE_URL}
          allUsers={props.allUsers}
          setAllUsers={props.setAllUsers}

          mobileWidth={props.mobileWidth}
          handleBackdropClick={handleBackdropClick}

          userMainId={props.userMainId}
          handleFollow={props.handleFollow}
          handleUnfollow={props.handleUnfollow}
          myFollowings={props.myFollowings}

          handleProfileSection={props.handleProfileSection}
        />
      ) : (
        < SearchTabMobile
          inputRef={inputRef}
          inputHandler={inputHandler}
          isDisplaySearchSection={windowWidth <= mobileWidth}
          BASE_URL={props.BASE_URL}
          allUsers={props.allUsers}
          setAllUsers={props.setAllUsers}

          mobileWidth={props.mobileWidth}
          handleBackdropClick={handleBackdropClick}

          userMainId={props.userMainId}
          handleFollow={props.handleFollow}
          handleUnfollow={props.handleUnfollow}
          myFollowings={props.myFollowings}

          handleProfileSection={props.handleProfileSection}
        />
      )}
      {activeSection === "notifications" && (
        windowWidth > mobileWidth ? (
          <NotificationTab
            isDisplayedNavLabels={isDisplayedNavLabels}
            isNotificationsSection={activeSection === "notifications"}
            handleBackdropClick={handleBackdropClick}
            userMainId={props.userMainId}

            notifications={props.notifications}
            notificationPage={props.notificationPage}
            notificationSize={props.notificationSize}
            notificationLoading={props.notificationLoading}
            hasMoreNotification={props.hasMoreNotification}
            unreadNotificationCount={props.unreadNotificationCount}
            notificationError={props.notificationError}
            eventSourceRef={props.eventSourceRef}
            mountedRef={props.mountedRef}
            connectSse={props.connectSse}
            disconnectSse={props.disconnectSse}
            fetchOptions={props.fetchOptions}
            fetchNotifications={props.fetchNotifications}
            handleLoadMore={props.handleLoadMore}
            markAsReadNotification={props.markAsReadNotification}
            markAllRead={props.markAllRead}
            deleteNotificationById={props.deleteNotificationById}
            deleteAllNotifications={props.deleteAllNotifications}
            handleProfileSection={props.handleProfileSection}
          />
        ) : (
          <NotificationTabMobile
            isNotificationsSection={activeSection === "notifications" && windowWidth <= mobileWidth}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            handleBackdropClick={handleBackdropClick}
            userMainId={props.userMainId}

            notifications={props.notifications}
            notificationPage={props.notificationPage}
            notificationSize={props.notificationSize}
            notificationLoading={props.notificationLoading}
            hasMoreNotification={props.hasMoreNotification}
            unreadNotificationCount={props.unreadNotificationCount}
            notificationError={props.notificationError}
            eventSourceRef={props.eventSourceRef}
            mountedRef={props.mountedRef}
            connectSse={props.connectSse}
            disconnectSse={props.disconnectSse}
            fetchOptions={props.fetchOptions}
            fetchNotifications={props.fetchNotifications}
            handleLoadMore={props.handleLoadMore}
            markAsReadNotification={props.markAsReadNotification}
            markAllRead={props.markAllRead}
            deleteNotificationById={props.deleteNotificationById}
            deleteAllNotifications={props.deleteAllNotifications}
            handleProfileSection={props.handleProfileSection}
          />
        )
      )}
      {activeSection === "messages" && (
        windowWidth > mobileWidth ? (
          <MessageTab
            isDisplayedNavLabels={isDisplayedNavLabels}
            isMessagesSection={activeSection === "messages"}
            handleBackdropClick={handleBackdropClick}

            userMainId={props.userMainId}
            allUsers={props.allUsers}
            setAllUsers={props.setAllUsers}

            conversationId={props.conversationId}
            handleProfileSection={props.handleProfileSection}

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
            
            handleOpenConversation={props.handleOpenConversation}
            handleEmojiClick={props.handleEmojiClick}
            sendMessageToUser={props.sendMessageToUser}
            darkMode={props.darkMode}
          />
        ) : (
          <MessageTabMobile
          isMessagesSection={activeSection === "messages" && windowWidth <= mobileWidth}
          handleBackdropClick={handleBackdropClick}
          
          userMainId={props.userMainId}
          allUsers={props.allUsers}
          setAllUsers={props.setAllUsers}
          
          setActiveSection={setActiveSection}
            conversationId={props.conversationId}
            handleProfileSection={props.handleProfileSection}

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

            handleOpenConversation={props.handleOpenConversation}
            handleEmojiClick={props.handleEmojiClick}
            sendMessageToUser={props.sendMessageToUser}
            darkMode={props.darkMode}
          />
        )
      )}

      {activeSection === "more" && (
        <MoreTab
          setActiveSection={setActiveSection}
          darkMode={props.darkMode}

          windowWidth={props.windowWidth}
          mobileWidth={props.mobileWidth}
          handleBackdropClick={handleBackdropClick}
        />
      )}
    </header>
  );
}

export default Header;
