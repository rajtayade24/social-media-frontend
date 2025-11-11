import React, { useRef, useEffect, useState, forwardRef, isValidElement, useMemo } from 'react';

import CommentSection from '../components/CommentSection';
import PostsProfileCard from '../components/profile/PostsProfileCard';
import PostMenu from "../components/menu/PostMenu"
import MediaCardMain from '../components/cards/mediaCardMain.jsx';

import { BASE_URL } from '../service/api';

import useAuthStore from '../store/useAuthStore';
import { useInView } from 'react-intersection-observer';
import PostActionIcons from '../components/cards/PostActionIcons.jsx';
import { useUserPosts } from '../hooks/useUserPosts.js';
import { stopOverflow } from '../general/StopOverflow.js';

function Section(props) {
  const token = useAuthStore(s => s.token)
  const userMainId = useAuthStore(s => s.userMainId)

  const showPostMenu = useAuthStore(s => s.showPostMenu);
  const setShowPostMenu = useAuthStore(s => s.setShowPostMenu);
  const closePostMenu = useAuthStore(s => s.closePostMenu);

  const [currentUserId, setCurrentUserId] = useState(props.userMainId ?? userMainId);
  const [sounded, setSound] = useState(false);

  const handleSound = () => { setSound(prev => !prev); };

  useEffect(() => { setCurrentUserId(props.userMainId ?? userMainId); }, [props.userMainId, userMainId]);


  const [likes, setLikes] = useState([])
  const [isLikedByUser, setLikedByUser] = useState([])
  const [animate, setAnimate] = useState([])
  const [isSavedByUser, setSavedByUser] = useState([])

  const [activeCommentSection, setActiveCommentSection] = useState([])
  const [activeCommentIndex, setActiveCommentIndex] = useState(null); // currently active video index

  const videoRefs = useRef([]);
  const [activeVideoIndex, setActiveVideoIndex] = useState(null); // currently active video index
  const [videoStates, setVideoStates] = useState({}); // { postId: { currentTime, paused } }

  const {
    posts,
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    deletePostMutation
  } = useUserPosts(currentUserId);

  useEffect(() => {
    setSavedByUser(posts?.map(() => false));
    setLikedByUser(posts?.map(p => p?.likedByUser));
    setAnimate(posts?.map(() => false));
    setActiveCommentSection(posts?.map(() => false));
    setLikes(posts?.map(p => p?.likes ?? 0));
  }, [posts]);

  useEffect(() => {
    if (!videoRefs.current.length) return;

    const observer = new IntersectionObserver((entries) => {
      let best = null;
      entries.forEach(e => {
        if (!best || e.intersectionRatio > best.intersectionRatio) best = e;
      });

      if (best && best.intersectionRatio >= 0.5) {
        const idx = Number(best.target.dataset.index);
        setActiveVideoIndex(idx);
      } else {
        setActiveVideoIndex(null);
      }
    }, { threshold: [0, 0.25, 0.5, 0.75, 1] });

    videoRefs.current.forEach(v => v && observer.observe(v));

    return () => observer.disconnect();
  }, [posts?.length]);

  useEffect(() => {
    videoRefs.current.forEach((el, i) => {
      if (!el) return;

      if (el.tagName === "VIDEO") {
        if (i === activeVideoIndex) {
          el.play().catch(() => { });
        } else {
          el.pause();
        }
        el.muted = !sounded;
      }
    });
  }, [activeVideoIndex, sounded]);

  const toggleSave = (i) => {
    setSavedByUser((prev) => { const n = [...prev]; n[i] = !n[i]; return n; });
  };

  // open comment modal
  const openCommentSection = (index) => {
    const post = posts[index];
    const video = videoRefs.current[index];
    if (!video) {
      // nothing to sync; still open modal
      setActiveCommentIndex(index);
      return;
    }

    // store current playback state
    const state = { currentTime: video.currentTime, paused: video.paused };
    setVideoStates(prev => ({ ...prev, [post.id]: state }));

    // pause + mute background video
    try { video.pause(); } catch (e) { /* ignore */ }
    video.muted = true;

    setActiveCommentIndex(index);
    props.navigate("comments")
  };

  // stopOverflow([activeCommentIndex !== null])

  // close comment modal
  const closeCommentSection = () => {
    if (activeCommentIndex !== null) {
      const post = posts[activeCommentIndex];
      const video = videoRefs.current[activeCommentIndex];
      const modalState = videoStates[post.id];
      if (video && modalState) {
        // restore time and play with sound
        try {
          video.currentTime = modalState.currentTime;
          video.muted = !sounded;
          video.play().catch(() => { });
        } catch (e) { /* ignore */ }
      }
    }
    props.navigate("/")
    setActiveCommentIndex(null);
  };

  // updateVideoState: callback that CommentSection will call before closing
  const updateVideoState = (postId, state) => {
    setVideoStates(prev => ({ ...prev, [postId]: { ...(prev[postId] || {}), ...state } }));
  };

  const [processingLike, setProcessingLike] = useState({}); // object keyed by postId
  const handleLike = async (post, index) => {
    if (!post || !post?.id) {
      console.warn("Invalid post passed to handleLike", post);
      return;
    }
    if (processingLike[post?.id]) return;
    setProcessingLike(prev => ({ ...prev, [post?.id]: true }));
    setAnimate((prev) => { const n = [...prev]; n[index] = true; return n; });
    setTimeout(() => setAnimate((prev) => { const n = [...prev]; n[index] = false; return n; }), 200);

    try {
      const token = localStorage.getItem("token");
      const userId = Number(localStorage.getItem("userId")) || props.userMainId;
      if (!userId) throw new Error("userId is missing (store it in localStorage or pass via props)");
      const res = await fetch(`${BASE_URL}/api/posts/${post?.id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Failed: ${res.status}`);
      }
      const data = await res.json();
      setLikedByUser((prev) => { const n = [...prev]; n[index] = data.likedByUser; return n; });
      setLikes((prevLikes) => { const n = [...prevLikes]; n[index] = Number(data.likes); return n; });

    } catch (err) {
      console.error("Error toggling like:", err);
    } finally {
      setProcessingLike(prev => {
        const next = { ...prev };
        delete next[post?.id];
        return next;
      });
    }
  }

  const handleDeletePost = async (id) => {
    deletePostMutation.mutate({ id, token });
  };

  const { ref: loadMoreSentinelRef, inView: loadMoreInView } = useInView({
    root: null,
    rootMargin: "200px",
    threshold: 0.1,
  });

  useEffect(() => {
    if (loadMoreInView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [loadMoreInView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    console.log(posts);
  }, [posts?.length]);

  if (isLoading) return <div>Loading posts?...</div>;
  if (isError) return <div>Error loading posts: {String(error)}</div>;
  return (
    <>
      <section className="reel-section px-12 max-[600px]:p-0">
        <ul className="cards-cont max-w-140 pb-3 mb-4 my-8 max-[600px]:m-0">
          {posts?.length === 0 && <div>No posts yet</div>}

          {posts?.map((post, index) => (
            <li key={`${index}-${post?.id}`}>

              <div className="card border-b-2 border-gray-300 pb-5 mb-5 dark:border-gray-700">

                <PostsProfileCard
                  post={post}
                  handleProfileSection={props.handleProfileSection}
                  setShowPostMenu={() => setShowPostMenu(post?.id)}
                />

                <div
                  className="bg-black relative min-h-[475px] flex items-center"
                >
                  {post?.fileUrl && (
                    <MediaCardMain
                      videoRef={(el) => (videoRefs.current[index] = el)} // <<< FIX
                      fileUrl={post?.fileUrl}
                      index={index}
                      handleSound={handleSound}
                      sounded={sounded}
                    />
                  )}
                </div>

                <PostActionIcons
                  post={post}
                  isLikedByUser={isLikedByUser[index]}
                  isSavedByUser={isSavedByUser[index]}
                  animate={animate[index]}
                  openCommentSection={openCommentSection}
                  toggleSave={toggleSave}
                  handleLike={handleLike}
                  index={index}
                />

                <div>
                  <div className='font-[500]'>{likes[index]} likes</div>
                  <p className="my-2">{post?.caption}</p>
                  <input className="w-[100%] outline-none" type="text" placeholder="Add a comment..." autoComplete="off" />
                </div>
              </div>

              {showPostMenu === post?.id && (
                <PostMenu
                  post={post}
                  showPostMenu={showPostMenu === post?.id}
                  setShowPostMenu={setShowPostMenu}
                  handleDeletePost={handleDeletePost}
                />
              )}

            </li>
          ))}

          {/* loader trigger */}
          <li ref={loadMoreSentinelRef} style={{ padding: 20, textAlign: "center" }}>
            {isFetchingNextPage && <div className="p-4">Loading more posts...</div>}

            {hasNextPage ? (
              <div className="p-4">
                <button
                  onClick={() => fetchNextPage()} disabled={isFetchingNextPage} className="mt-4 px-4 py-2 bg-gray-200 rounded">
                  {isFetchingNextPage ? 'Loading...' : 'Load more'}
                </button>
              </div>
            ) : (
              data && !isLoading && <div className='w-full h-1 bg-gray-700'></div>
            )}
          </li>


        </ul>
      </section >

      {/* RENDER COMMENT SECTION ONCE for the active index only -> FIX */}
      {activeCommentIndex !== null && posts?.[activeCommentIndex] && (
        <CommentSection
          post={posts[activeCommentIndex]}
          index={activeCommentIndex}
          sounded={sounded}
          handleSound={handleSound}

          showPostMenu={showPostMenu}
          setShowPostMenu={setShowPostMenu}

          handleProfileSection={props.handleProfileSection}
          videoState={videoStates[posts[activeCommentIndex]?.id]}
          updateVideoState={updateVideoState} // <<< FIX: callback so modal reports currentTime
          closeCommentSection={closeCommentSection}
          handleDeletePost={handleDeletePost}
        />
      )}
    </>
  );
}


export default Section
