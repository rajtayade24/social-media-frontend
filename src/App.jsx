import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useState, useEffect, useRef, } from 'react'
import { BrowserRouter, Routes, Route, useLocation, data, useNavigate } from "react-router-dom";
import { apiFetch, BASE_URL } from "./service/api";

import Header from './layout/Header'
import Main from './layout/Main'
import MyProfile from './pages/MyProfile'
import UserVarificationForm from './pages/UserVarificationForm'
import UploadTab from './components/headerTabs/UploadTab'
import useAuthStore from './store/useAuthStore';
import useChatStore from './store/useChatStore';
import useNotificationStore from './store/useNotificationStore ';
import { useUserFollowings } from './hooks/useUserFollowings';
import { getFollowersCount, getFollowingCount, getPostCount } from './service/userService';
import { getAllFollowerIds, getAllFollowingIds, getUnreadCountMessage } from './service/authService';
import { fetchUnreadNotificationCount } from './service/notificationService';


const mobileWidth = 600;

function AppContent() {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user)
  const setUser = useAuthStore(s => s.setUser)
  const userMainId = useAuthStore(s => s.userMainId)
  const setUserMainId = useAuthStore(s => s.setUserMainId)

  const setProfile = useAuthStore(s => s.setProfile)
  const profileId = useAuthStore(s => s.profileId)
  const setProfileId = useAuthStore(s => s.setProfileId)

  const token = useAuthStore(s => s.token)
  const setToken = useAuthStore(s => s.setToken)

  const { setUnreadCountMessage } = useAuthStore();

  const setMyFollowers = useAuthStore(s => s.setMyFollowers)
  const setMyFollowings = useAuthStore(s => s.setMyFollowings)
  const removeFollower = useAuthStore(s => s.removeFollower)
  const myFollowings = useAuthStore(s => s.myFollowings)
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const setAuthenticated = useAuthStore(s => s.setAuthenticated)

  const {
    userImageSrc,
    allFollowers,

    darkMode,
    setUserImageSrc,
    setAllFollowers,
    setAllFollowings,
  } = useAuthStore()

  const {
    postCount,
    followerCount,
    followingCount,
    setPostCount,
    setFollowerCount,
    setFollowingCount,
  } = useAuthStore();

  const {
    verificationSuccess,
    verificationStatus,
    updateSuccess,
    updateStatus,
    setVerificationSuccess,
    setVerificationStatus,
    setUpdateSuccess,
    setUpdateStatus,
  } = useAuthStore();

  // MESSAGE TAB
  const {
    loadingMessagedUsers,
    conversations,
    conversationId,
    activeConversation,
    messages,
    otherUserTyping,
    setLoadingMessagedUsers,
    setConversations,
    setConversationId,
    setActiveConversation,
    setMessages,
    setOtherUserTyping,
  } = useChatStore();

  // AppContent — use selectors (replace the previous destructuring for activeSection / isProfileSectionShown)
  const activeSection = useAuthStore(s => s.activeSection);
  const setActiveSection = useAuthStore(s => s.setActiveSection);

  // IMPORTANT: treat this as a boolean selector (don't use the function stored in the store)
  const isProfileSectionShown = useAuthStore(s => s.activeSection === "profile");
  const setProfileSectionShown = useAuthStore(s => s.setProfileSectionShown);

  const { allUsers, recs, setAllUsers, setRecs } = useAuthStore();
  const { allPosts, myPosts, setAllPosts, } = useAuthStore();

  const { selectedFiles, caption, setSelectedFiles, setCaption } = useAuthStore();

  const { windowWidth, setWindowWidth } = useAuthStore();

  useEffect(() => {
    if (typeof window === "undefined") return;

    let timerId = null;
    const handleResize = () => {
      if (timerId) clearTimeout(timerId);
      timerId = setTimeout(() => {
        setWindowWidth(window.innerWidth);
        timerId = null;
      }, 100); // adjust delay as needed
    };

    handleResize(); // initial
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (timerId) clearTimeout(timerId);
    };
  }, [setWindowWidth]);


  useEffect(() => {
    console.log(darkMode ? "dark mode is applied" : "dark mode is applied");
    document.documentElement.classList.toggle("dark", darkMode);
    try { localStorage.setItem("dark", darkMode ? "true" : "false"); } catch (e) { }
  }, [darkMode]);

  useEffect(() => {
    if (!isAuthenticated) return; // only connect once logged in

    const jwtToken = localStorage.getItem("token");
    if (!jwtToken) return;

    const sock = new SockJS(`${BASE_URL.replace(/\/+$/, '')}/ws?token=${jwtToken}`);

    const stompClient = new Client({
      webSocketFactory: () => sock,
      reconnectDelay: 5000,
      debug: str => console.log("[STOMP]", str),
      onConnect: () => {
        console.log("WebSocket connected");
        stompClient.subscribe("/user/queue/notifications", msg => {
          try {
            const payload = JSON.parse(msg.body);
            console.log("📩 Notification:", payload);
          } catch (err) {
            console.error("Bad notification JSON", err);
          }
        });
      },
    });

    stompClient.activate();

    return () => {
      console.log("🔌 disconnect WS");
      stompClient.deactivate();
    };
  }, [isAuthenticated]);

  useEffect(() => {
    try {
      // read directly from localStorage (works on cold start)
      const storedToken = localStorage.getItem("token");
      const stored = JSON.parse(localStorage.getItem("currentUser") || "null");
      const followings = JSON.parse(localStorage.getItem("myFollowingIds") || "null");
      const followers = JSON.parse(localStorage.getItem("myFollowerIds") || "null");
      const profile = JSON.parse(localStorage.getItem("profile") || "null");

      console.log("restoring from localStorage:", { storedToken, stored, followings, followers, profile, profileId });

      if (storedToken && stored) {
        // set store values directly
        setToken(storedToken);
        setUser(stored);

        setAuthenticated(true);
        setUserMainId(stored.id);

      }
    } catch (e) {
      console.warn("Failed to restore session:", e);
    }
  }, []);

  useEffect(() => {
    const fetchStarterData = async () => {
      setMyFollowings(await getAllFollowingIds(userMainId));
      setMyFollowers(await getAllFollowerIds(userMainId));
      setUnreadCountMessage(await getUnreadCountMessage(userMainId))
    }
    if (userMainId) {
      fetchStarterData()
    }
  }, [userMainId])


  useEffect(() => {
    const fetchProfileData = async () => {
      if (!isProfileSectionShown) return;

      const [postCnt, followersCnt, followingCnt] = await Promise.all([
        getPostCount(profileId),
        getFollowersCount(profileId),
        getFollowingCount(profileId),
      ]);
      setPostCount(postCnt)
      setFollowerCount(followersCnt);
      setFollowingCount(followingCnt);
    };
    fetchProfileData();
  }, [isProfileSectionShown, profileId]);

  //PROFILE SECTION
  const handleProfileSection = async (item = null) => {
    let currentUserId;
    if (item !== null) {
      currentUserId = item.userId ?? item.recipientId ?? item.id;
      setProfile(item)
    } else {
      currentUserId = userMainId;
      setProfile(user)
    }

    if (currentUserId) {
      navigate(`/profile/${currentUserId}`);
      console.log("navigated to profile:", currentUserId);
    }
    setProfileId(currentUserId)
    setActiveSection("profile");

    setProfileSectionShown(true)
  }

  const { followingMutation, deleteFollowingMutation } = useUserFollowings(userMainId);
  const handleFollow = async (targetId) => {
    followingMutation.mutate(targetId);
  };
  const handleUnfollow = async (targetId) => {
    deleteFollowingMutation.mutate(targetId);
  };

  const handleRemoveFollower = async (targetId) => {
    if (!userMainId || !targetId) return;
    if (!targetId) {
      console.warn("handleRemoveFollower called with falsy targetId", targetId);
      return;
    }
    console.log("Removing follower:", { targetId, userMainId });
    try {
      const res = await fetch(
        `${BASE_URL}/api/follow/${targetId}/remove?userId=${userMainId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error(`Remove failed: ${res.status}`);

      try { await res.json(); } catch (e) { /* ignore */ }

      removeFollower(targetId)

      console.log("Removed follower locally:", targetId);
    } catch (err) {
      alert(err)
      console.error("handleRemoveFollower error:", err);
    }
  };

  const messagesEndRef = useRef(null);
  const pageSize = 50;
  const refreshInterval = 5000; // ⏱ every 5 seconds

  // ----------------- AUTO-SCROLL -----------------
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]);

  // ----------------- EMOJI HANDLER -----------------
  const handleEmojiClick = (emojiData) => {
    setMessageText((prev) => prev + emojiData.emoji);
  };

  // ----------------- CREATE CONVERSATION -----------------
  async function createConversation(participantId = conversationId ? conversationId : null) {
    console.log("participantId: ", participantId);
    try {
      const res = await apiFetch(`/api/conversations/${userMainId}`, {
        method: 'POST',
        body: JSON.stringify({ participantIds: [participantId] }),
      });
      return res;
    } catch (err) {
      console.error('createConversation error', err);
      return null;
    }
  }

  // ----------------- FETCH MESSAGES -----------------
  async function fetchMessages(conversationId, reset = true) {
    if (!conversationId) return;
    try {
      const res = await apiFetch(
        `/api/conversations/${conversationId}/messages/${userMainId}?page=${reset ? 0 : page}&size=${pageSize}`
      );
      const pageContent = Array.isArray(res?.content)
        ? res.content
        : Array.isArray(res)
          ? res
          : [];
      if (reset) {
        setMessages(pageContent);
      } else {
        setMessages((prev) => [...prev, ...pageContent]);
      }
    } catch (err) {
      console.error('Failed to fetch messages', err);
    }
  }

  async function sendMessageToConversation(conversationId, content) {
    if (!conversationId) throw new Error('conversationId missing');
    const body = { content };
    return apiFetch(`/api/conversations/${conversationId}/messages/${userMainId}`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async function sendMessageToUser(targetUser, messageText = 0) {
    console.log(targetUser);
    if (!userMainId || !targetUser) return;
    if (!messageText.trim()) return;
    try {
      const conv = await createConversation(targetUser?.id);
      if (!conv?.id) throw new Error('Failed to create or get conversation');

      const sent = await sendMessageToConversation(conv.id, messageText.trim());
      setMessages(prev => [...prev, sent]);
      setActiveConversation({
        id: conv.id,
        participant: targetUser,
      });

      const convs = await apiFetch(`/api/users/${userMainId}/messaged-users`);
      setConversations(convs || []);
      return true
    } catch (err) {
      console.error('Failed to send message', err);
    }
  }

  async function handleOpenConversation(c) {
    if (!c) {
      console.warn('handleOpenConversation called with undefined "c". Using pofile id fallback.');
    }
    console.log("open conv: ", c);

    try {
      const conv = await createConversation(c?.userId ?? c?.id);
      setActiveConversation({
        id: conv.id,
        participant: {
          id: c?.userId ?? c?.id,

          username: c?.username ?? c?.username,
          name: c?.name ?? c?.name,
          profilePhotoUrl: c?.profilePhotoUrl ?? c?.profilePhotoUrl,
          bio: c.bio ?? c?.bio
        },
      });
      console.log("conv: ", conv);
      await setReadConv(conv.id)
      await fetchMessages(conv.id, true);
    } catch (err) {
      console.error('Failed to open conversation', err);
    }
  }

  async function setReadConv(conversationId) {
    if (!conversationId) console.log("conv id is required!!");
    try {
      const res = await fetch(`${BASE_URL}/api/conversations/${conversationId}/read/${userMainId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      })
      if (!res.ok) throw new Error(`read failed: ${res.status}`);
      console.log(await res.text());
      console.log("conversaation is readed");
    } catch (err) {
      console.error("read error:", err);
    }
  }

  useEffect(() => {
    if (activeSection !== "messages" || !userMainId) return;
    let mounted = true;
    setLoadingMessagedUsers(true);
    (async () => {
      try {
        const convs = await apiFetch(`/api/users/${userMainId}/messaged-users`);
        if (mounted) setConversations(convs || []);
      } catch (err) {
        console.error('Failed to load messaged users', err);
      } finally {
        if (mounted) setLoadingMessagedUsers(false);
      }
    })();
    return () => (mounted = false);
  }, [activeSection, userMainId]);


  useEffect(() => {
    if (!activeConversation?.id) return;
    const interval = setInterval(() => {
      fetchMessages(activeConversation.id, true);
    }, refreshInterval);
    return () => clearInterval(interval);
  }, [activeConversation?.id]);

  useEffect(() => {
    if (!activeConversation) return;
    // fake random typing to illustrate
    const simulateTyping = setInterval(() => {
      if (Math.random() > 0.8) {
        setOtherUserTyping(true);
        setTimeout(() => setOtherUserTyping(false), 1500);
      }
    }, 8000);
    return () => clearInterval(simulateTyping);
  }, [activeConversation]);

  const {
    notifications,
    notificationPage,
    notificationSize,
    notificationLoading,
    hasMoreNotification,
    unreadNotificationCount,
    notificationError,

    setNotifications,
    setNotificationPage,
    setNotificationLoading,
    setHasMoreNotification,
    setUnreadNotificationCount,
    setNotificationError,
  } = useNotificationStore();
  const eventSourceRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    if (userMainId) {
      fetchUnreadNotificationCount(mountedRef);
      fetchNotifications(0, true);
      connectSse();
    }
    return () => {
      mountedRef.current = false;
      disconnectSse();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userMainId, token]);

  // Keep SSE alive & reconnect simple backoff on failure
  const connectSse = () => {
    disconnectSse();
    if (!userMainId) return;

    try {
      // inside connectSse()
      const base = BASE_URL.replace(/\/+$/, ''); // strip trailing slash
      const url = `${base}/api/users/${userMainId}/notifications/stream${token ? `?token=${encodeURIComponent(token)}` : ''}`;
      const es = new EventSource(url);

      eventSourceRef.current = es;

      es.onopen = () => {
        // console.log("SSE connected");
      };

      es.onerror = (err) => {
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
          eventSourceRef.current = null;
        }
        // reconnect after 3s
        setTimeout(() => {
          if (mountedRef.current) connectSse();
        }, 3000);
      };

      // server sends an initial "connected" event — handle generically
      es.addEventListener("connected", (ev) => {
        // no-op
      });

      es.addEventListener("notification", (ev) => {
        try {
          const payload = JSON.parse(ev.data);
          // prepend incoming notification
          setNotifications((prev) => {
            // avoid duplicates by id
            if (prev.find((p) => p.id === payload.id)) return prev;
            return [payload, ...prev];
          });
          setUnreadNotificationCount((c) => c + 1);
        } catch (e) {
          // ignore parse errors
        }
      });
    } catch (e) {
      // ignore: server might not support SSE or network notificationError
    }
  };

  const disconnectSse = () => {
    if (eventSourceRef.current) {
      try {
        eventSourceRef.current.close();
      } catch (e) {
        // ignore
      }
      eventSourceRef.current = null;
    }
  };

  const buildFetchOptions = (tok = null) => {
    const headers = { "Content-Type": "application/json" };
    const JWTtoken = tok || localStorage.getItem("token");
    if (JWTtoken) headers["Authorization"] = `Bearer ${JWTtoken}`;
    return { headers };
  };

  async function postNotification(payload) {
    const actorId = payload?.actorId;
    const recipientId = payload?.recipientId;

    console.log("actorId: ", actorId, "recipientId:", recipientId);
    if (!actorId || !recipientId) {
      console.warn("postNotification: actorId and recipientId required");
      return null;
    }

    if (payload.actorId === payload.recipientId) return;

    const opts = buildFetchOptions(token);
    try {
      const res = await fetch(`${BASE_URL}/api/notifications`, {
        ...opts,
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("postNotification failed", res.status, text); return null;
      }
      const created = await res.json();

      // optimistic UI: prepend notification in parent state
      setNotifications((prev) => {
        if (prev.find((p) => p.id === created.id && p.recipientId !== userMainId)) return prev; // avoid duplicates
        return [created, ...prev];
      });

      // if (!created.read) setUnreadNotificationCount((c) => (typeof c === "number" ? c + 1 : 1));
      return created;
    } catch (err) {
      console.error("postNotification error", err);
      return null;
    }
  }

  async function deleteNotificationById(notificationId) {
    if (!notificationId) return false;
    // adjust unread count conservatively: if removed item was unread decrement

    const opts = buildFetchOptions(token);
    try {
      const res = await fetch(`${BASE_URL}/api/users/${userMainId}/notifications/${notificationId}`, { method: "DELETE", ...opts });
      if (res.ok || res.status === 204) {
        setNotifications((list) => list.filter((n) => n.id !== notificationId));
        setUnreadNotificationCount(count => count - 1);
        return true;
      } else if (res.status === 404) {
        // try next fallback
      } else {
        // non-404 error: rollback and return false
        throw new Error(`Delete returned ${res.status}`);
      }
    } catch (err) {
      console.log(err);
    }
    return false;
  }

  async function deleteAllNotifications() {
    if (!userMainId) return false;

    const opts = buildFetchOptions(token);
    try {
      const res = await fetch(`${BASE_URL}/api/users/${userMainId}/notifications`, { method: "DELETE", ...opts });
      if (res.ok || res.status === 204) {
        setNotifications([]);
        setUnreadNotificationCount(0);
        return true;
      } else if (res.status === 404) {
      } else {
        throw new Error(`Delete all returned ${res.status}`);
      }
    } catch (err) {
      // try next
    }
    return false;
  }

  const handleLoadMore = () => fetchNotifications(notificationPage + 1, false);
  const fetchNotifications = async (pageToFetch = 0, replace = false) => {
    if (!userMainId) return;
    setNotificationLoading(true);
    setNotificationError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/users/${userMainId}/notifications?notificationPage=${pageToFetch}&notificationSize=${notificationSize}`, buildFetchOptions(token));
      if (!res.ok) throw new Error(`Failed to load notifications: ${res.status}`);
      const pageData = await res.json(); // expects a Page<NotificationDto> object
      // PageImpl shape: { content: [...], totalElements, ... } OR some backends return the notificationPage array directly.
      let items = [];
      if (Array.isArray(pageData.content)) items = pageData.content;
      else if (Array.isArray(pageData)) items = pageData;
      else if (Array.isArray(pageData._embedded?.notifications)) items = pageData._embedded.notifications; // HATEOAS fallback

      if (replace) setNotifications(items);
      else setNotifications((prev) => [...prev, ...items]);

      // determine if more pages exist
      const total = pageData.totalElements ?? null;
      if (total !== null) {
        const loaded = (pageToFetch + 1) * notificationSize;
        setHasMoreNotification(loaded < total);
      } else {
        // if pageData.notificationSize or content length equals notificationPage notificationSize assume more
        setHasMoreNotification(items.length === notificationSize);
      }
      setNotificationPage(pageToFetch);
    } catch (e) {
      setNotificationError(e.message || "Failed to load notifications");
    } finally {
      if (mountedRef.current) setNotificationLoading(false);
    }
  };

  const markAsReadNotification = async (notificationId) => {
    if (!userMainId) return;
    // optimistic update
    setNotifications((prev) => prev.map(n => n.id === notificationId ? ({ ...n, read: true }) : n));
    setUnreadNotificationCount((c) => Math.max(0, c - 1));

    try {
      const res = await fetch(`${BASE_URL}/api/users/${userMainId}/notifications/${notificationId}/read`, {
        method: "POST",
        ...buildFetchOptions(token)
      });
      if (!res.ok) {
        throw new Error("Failed to mark read");
      }
      const updated = await res.json();
      setNotifications((prev) => prev.map(n => n.id === updated.id ? updated : n));
    } catch (e) {
      fetchNotifications(0, true);
      fetchUnreadNotificationCount(mountedRef);
    }
  };

  const markAllRead = async () => {
    console.log(userMainId);
    if (!userMainId) return;
    // optimistic update
    setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
    setUnreadNotificationCount(0);
    try {
      const BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";
      const res = await fetch(`${BASE}/api/users/${userMainId}/notifications/read-all`, {
        method: "PUT",
        ...buildFetchOptions(token)
      });
      if (!res.ok) {
        throw new Error("Failed to mark all read");
      }
    } catch (e) {
      // rollback: refetch
      fetchNotifications(0, true);
      fetchUnreadNotificationCount(mountedRef);
    }
  };

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/*" element={
          <UserVarificationForm
            setAuthenticated={setAuthenticated}
            verificationSuccess={verificationSuccess}
            setVerificationSuccess={setVerificationSuccess}
            verificationStatus={verificationStatus}
            setVerificationStatus={setVerificationStatus}
            BASE_URL={BASE_URL}
            userImageSrc={userImageSrc}
            setUserImageSrc={setUserImageSrc}
            navigate={navigate}
          />
        } />
      </Routes>
    );
  }
  return (
    <>
      <Header
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isProfileSectionShown={isProfileSectionShown}
        setProfileSectionShown={setProfileSectionShown}
        setAuthenticated={setAuthenticated}
        myPosts={myPosts}
        BASE_URL={BASE_URL}
        apiFetch={apiFetch}
        allUsers={allUsers}
        setAllUsers={setAllUsers}
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
        caption={caption}
        setCaption={setCaption}
        userMainId={userMainId}

        darkMode={darkMode}
        mobileWidth={mobileWidth}

        handleFollow={handleFollow}
        handleUnfollow={handleUnfollow}
        myFollowings={myFollowings}

        handleProfileSection={handleProfileSection}

        loadingMessagedUsers={loadingMessagedUsers}
        conversations={conversations}
        activeConversation={activeConversation}
        messages={messages}
        otherUserTyping={otherUserTyping}

        setLoadingMessagedUsers={setLoadingMessagedUsers}
        setConversations={setConversations}
        setActiveConversation={setActiveConversation}
        setMessages={setMessages}
        setOtherUserTyping={setOtherUserTyping}

        messagesEndRef={messagesEndRef}
        pageSize={pageSize}
        refreshInterval={refreshInterval}


        notifications={notifications}
        notificationPage={notificationPage}
        notificationSize={notificationSize}
        notificationLoading={notificationLoading}
        hasMoreNotification={hasMoreNotification}
        unreadNotificationCount={unreadNotificationCount}
        notificationError={notificationError}

        eventSourceRef={eventSourceRef}
        mountedRef={mountedRef}
        connectSse={connectSse}
        disconnectSse={disconnectSse}
        buildFetchOptions={buildFetchOptions}
        fetchNotifications={fetchNotifications}
        handleLoadMore={handleLoadMore}
        markAsReadNotification={markAsReadNotification}
        markAllRead={markAllRead}

        handleOpenConversation={handleOpenConversation}
        handleEmojiClick={handleEmojiClick}
        sendMessageToUser={sendMessageToUser}

        deleteNotificationById={deleteNotificationById}
        deleteAllNotifications={deleteAllNotifications}

        setReadConv={setReadConv}
      />

      <div
        className={`w-screen dark:bg-[#1e1c21] dark:text-[#fafafa] 
              ${windowWidth > mobileWidth
            ? "min-h-screen"
            : "max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide pb-20 absolute top-[60px] z-10" /* CHANGED: removed spaces in calc() so Tailwind generates this class; use overflow-y-auto and pb-20 to prevent content hiding under fixed bottom nav */
          }
              `}>
        {!isProfileSectionShown ? (
          <Main
            userMainId={userMainId}
            isProfileSectionShown={isProfileSectionShown}
            setProfileSectionShown={setProfileSectionShown}
            allPosts={allPosts}
            setAllPosts={setAllPosts}

            allUsers={allUsers}
            setAllUsers={setAllUsers}
            myPosts={myPosts}
            setRecs={setRecs}
            recs={recs}
            handleFollow={handleFollow}
            handleUnfollow={handleUnfollow}
            allFollowers={allFollowers}
            setAllFollowers={setAllFollowers}
            setAllFollowings={setAllFollowings}
            myFollowings={myFollowings}
            BASE_URL={BASE_URL}
            apiFetch={apiFetch}

            handleProfileSection={handleProfileSection}

            navigate={navigate}
          />
        ) : (
          <MyProfile
            isProfileSectionShown={isProfileSectionShown}
            setProfileSectionShown={setProfileSectionShown}
            myPosts={myPosts}
            userMainId={userMainId}

            recs={recs}

            followerCount={followerCount}
            followingCount={followingCount}
            allFollowers={allFollowers}
            setAllFollowers={setAllFollowers}
            myFollowings={myFollowings}

            setAllFollowings={setAllFollowings}


            setRecs={setRecs}

            handleFollow={handleFollow}
            handleUnfollow={handleUnfollow}
            handleRemoveFollower={handleRemoveFollower}
            BASE_URL={BASE_URL}
            apiFetch={apiFetch}

            handleProfileSection={handleProfileSection}

            setConversationId={setConversationId}
            setActiveSection={setActiveSection}
            handleOpenConversation={handleOpenConversation}

            updateSuccess={updateSuccess}
            updateStatus={updateStatus}
            navigate={navigate}

          />
        )}
      </div>

      {activeSection === "upload" && (
        <UploadTab
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
          caption={caption}
          setCaption={setCaption}
          BASE_URL={BASE_URL}
          userMainId={userMainId}
          setActiveSection={setActiveSection}

          apiFetch={apiFetch}
          mobileWidth={mobileWidth}
          navigate={navigate}
        />
      )}
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
