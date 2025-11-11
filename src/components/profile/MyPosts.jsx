import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import CommentSection from "../CommentSection";
import useAuthStore from "../../store/useAuthStore";
import { useAuthPosts } from "../../hooks/useAuthPosts";
import { useInView } from "react-intersection-observer";
import { useUserPosts } from "../../hooks/useUserPosts";

export default function MyPosts(props) {
  const profileId = useAuthStore(s => s.profileId)
  const userMainId = useAuthStore(s => s.userMainId)

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useAuthPosts(profileId);
  const posts = data?.pages.flatMap(page => page.content || []);

  const [activeCommentIndex, setActiveCommentIndex] = useState(null); // currently active video index
  const [activeCommentSection, setActiveCommentSection] = useState(Array(props.myPosts.length).fill(false));
  const fileRefs = useRef([]);

  const [sounded, setSound] = useState(false);
  const handleSound = (index) => { setSound(prev => !prev); };

  useEffect(() => {
    if (profileId && !isLoading) refetch();
  }, [profileId]);

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

  const openCommentSection = (i) => {
    setActiveCommentSection((prev) => { const n = [...prev]; n[i] = !n[i]; return n; })
    setActiveCommentIndex(i);
    props.navigate(`comment`)
  }
  
  const closeCommentSection = () => {
    if (activeCommentIndex !== null) {
      setActiveCommentSection([])
      setActiveCommentIndex(null)
    }
  }

  const { deletePostMutation } = useUserPosts(userMainId)

  const handleDeletePost = async (id) => {
    deletePostMutation.mutate({ id, token });
  };

  if (isLoading) return <p>Loading posts...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <>
      <div className="grid grid-cols-3 gap-1 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
        {Array.isArray(posts) && posts.length > 0 && (
          posts.map((post, index) => (
            <div
              key={post.id || index}
              className="flex items-center gap-2 border-b"
            >
              <div
                onClick={() => openCommentSection(index)}
                className="w-[350px] min-h-[425px] bg-black"
              >
                {post.fileUrl.endsWith(".mp4") ? (
                  <>
                    <video
                      ref={el => fileRefs.current[index] = el}
                      data-index={index}
                      className="w-[350px] h-[425px] "
                      loop
                      muted
                      autoPlay={false}
                      src={post.fileUrl}>
                    </video>
                  </>
                ) : (
                  <img
                    ref={el => fileRefs.current[index] = el}
                    data-index={index}
                    className="w-[350px] min-h-[425px] h-[425px]"
                    src={post.fileUrl} alt="post" />
                )}
              </div>
              {activeCommentSection[index] && ( //In JavaScript, A && B means: If A is truthy → return B.
                <CommentSection
                  post={posts[activeCommentIndex]}
                  index={activeCommentIndex}
                  sounded={sounded}
                  handleSound={handleSound}

                  isMyPost={true}

                  handleProfileSection={props.handleProfileSection}
                  handleDeletePost={handleDeletePost}
                  closeCommentSection={closeCommentSection}

                  isFromMyProfile={true}
                />
              )}
            </div>
          ))
        )}

        < div ref={loadMoreSentinelRef} style={{ padding: 20, textAlign: "center" }}>
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
        </div >
      </div>
    </>
  )
}
