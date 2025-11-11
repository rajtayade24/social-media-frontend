import React, { useState, useEffect, useRef } from 'react'

import PostsProfileCard from './profile/PostsProfileCard';

import { apiFetch, BASE_URL } from "../service/api";
import CommentLists from './lists/CommentList';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import useAuthStore from '../store/useAuthStore';
import ChatForm from './form/ChatForm';
import MediaCardMain from './cards/MediaCardMain'
import PostMenu from './menu/PostMenu';

export default function CommentSection(props) {
  const userMainId = useAuthStore(s => s.userMainId)
  const windowWidth = useAuthStore(s => s.windowWidth)

  const videoRef = useRef(null);
  const showPostMenu = useAuthStore(s => s.showPostMenu)
  const setShowPostMenu = useAuthStore(s => s.setShowPostMenu)

  const postId = props.post?.id;
  const userId = props.post?.userId

  // when modal mounts: sync playback with stored state
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !props.post?.fileUrl.endsWith(".mp4")) return;

    const setup = async () => {
      try {
        v.currentTime = props.videoState?.currentTime || 0;
        v.muted = !props.sounded;
        if (!props.videoState?.paused) await v.play();
      } catch { }
    };
    setup();
  }, [props.videoState, props.sounded, props.post?.fileUrl]);



  // useEffect(() => {
  //   console.log(fileRefs.current);
  //   fileRefs.current.forEach((el, i) => {
  //     if (!el) return;

  //     if (el.tagName === "VIDEO") {
  //       if (i === activeCommentIndex) {
  //         el.play().catch(() => { });
  //       } else {
  //         el.pause();
  //       }
  //       el.muted = !sounded;
  //     }
  //   });
  // }, [activeCommentIndex, sounded]);

  const handleBackdropClick = e => {
    if (e.target === e.currentTarget) {
      // capture current time before closing and report it back to Section
      if (videoRef.current && typeof props.updateVideoState === 'function') {
        props.updateVideoState(postId, { currentTime: videoRef.current.currentTime, paused: videoRef.current.paused });
      }
      if (typeof props.closeCommentSection === 'function') props.closeCommentSection();
    }
  };

  // React Query
  const queryClient = useQueryClient();
  const pageSize = 10;

  const fetchCommentsPage = async ({ pageParam = 0 }) => {
    const path = `/api/posts/${encodeURIComponent(postId)
      }/comments?page=${encodeURIComponent(pageParam)
      }&size=${encodeURIComponent(pageSize)}`;

    const data = await apiFetch(path, { method: "GET" });
    return data;
  }

  const {
    data, // { pages: [pageObj, ...], pageParams: [...] }
    isLoading,
    isError,
    error,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    refetch
  } = useInfiniteQuery({
    queryKey: ['comments', postId],
    queryFn: fetchCommentsPage,
    getNextPageParam: (lastPage) => {
      if (lastPage && typeof lastPage.number === 'number' && typeof lastPage.totalPages === 'number') {
        return lastPage.number < lastPage.totalPages - 1 ? lastPage.number + 1 : undefined;
      }
      return undefined;
    },
    enabled: !!postId, // only run when we have a post id
    keepPreviousData: true,
    gcTime: 60000, //catch data stored for 1 second  By default, this is set to 5 minutes (300,000 ms). fetch req but
    staleTime: 2000, //  defaul = 0 the data is considered expired  even  data will not send req to backend
    // refetchInterval: 1000,
    // refetchIntervalInBackground: true
  });

  const allComments = (data?.pages || []).flatMap((p) => p.content || []);

  const postCommentFn = async ({ postId, commentValue, userId }) => {
    const path = `/api/posts/${encodeURIComponent(postId)}/comment`;
    const body = { userId, comment: commentValue };
    const created = await apiFetch(path, {
      method: 'POST',
      body: JSON.stringify(body)
    });
    return created;
  };

  // to perform the action on catched data -> use useMutation
  const postCommentMutation = useMutation({
    mutationFn: postCommentFn,
    onMutate: async ({ commentValue }) => {
    },
    onSuccess: (created) => {
      // Prepend the created comment to the first page in the cache
      queryClient.setQueryData(
        ['comments', postId] //key 
        , (old) => { // function

          console.log(old);
          if (!old) {
            // no cache yet — create a first page shape similar to backend
            return {
              pageParams: [0],
              pages: [
                {
                  content: [created],
                  number: 0,
                  totalPages: 1,
                  size: pageSize,
                  totalElements: 1
                }
              ]
            };
          }

          const newPages = [...old.pages];
          // Ensure pages[0] exists and has content array
          if (!newPages[0]) {
            newPages[0] = { content: [created], number: 0, totalPages: 1, size: pageSize, totalElements: 1 };
          } else {
            newPages[0] = {
              ...newPages[0],
              content: [created, ...(newPages[0].content || [])],
              // adjust totalElements if present
              totalElements: typeof newPages[0].totalElements === 'number' ? newPages[0].totalElements + 1 : undefined
            };
          }
          return { ...old, pages: newPages };
        }
      );
    },
    onError: (err) => {
      console.error('postComment error:', err);
      // you can show a toast or set a local error state if desired
    }
  });

  // Form submit
  const postComment = (comment = '') => {
    const commentValue = comment.trim();
    if (!commentValue) return;
    // call mutation
    postCommentMutation.mutate({ postId, commentValue, userId: userMainId });
    return true;
  };

  // When postId changes, refetch comments (useInfiniteQuery handles it, but ensure resetting any UI state if needed)
  useEffect(() => {
    if (postId) { refetch(); }
  }, [postId]);


  const { ref: sentinelRef, inView: loadMoreComment } = useInView({
    root: null,
    rootMargin: "100px",
    threshold: 0.1,
  })

  useEffect(() => {
    if (loadMoreComment && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  })

  if (isLoading) return <div>Loading messages...</div>;
  if (isError) return <div>Error loading messages: {String(error)}</div>;

  return (
    <div
      onClick={handleBackdropClick}
      className='comment-section fixed inset-0 z-[49] flex flex-wrap justify-center items-center bg-black/50'>

      <div className="comments-container bg-white flex h-[calc(100%-40px)] max-w-[calc(100%-120px)] w-auto items-center justify-center dark:bg-[#1e1c21]">

        {windowWidth > 1280 ? (
          <div className='left relative h-[100%] w-[fit-content] max-w-[650px] min-w-0 bg-black flex items-center max-[660px]:hidden'>
            <MediaCardMain
              videoRef={videoRef}
              fileUrl={props.post?.fileUrl}
              index={props.index}
              sounded={props.sounded}
              handleSound={props.handleSound}
              isCommentSection={true}
              isFromMyProfile={props.isFromMyProfile !== undefined ? props.isFromMyProfile : false}
            />
          </div>
        ) : null}


        <div className="right flex flex-col h-[100%] w-96 border-0 rounded-r-[8px] max-[450px]:w-[95%]">
          <div className='p-4 border-b-2 border-gray-600' >
            <PostsProfileCard
              post={props.post}
              handleProfileSection={props.handleProfileSection}
              setShowPostMenu={() => setShowPostMenu(props.post?.id)}
            />
          </div>
          <div className="comments-cont flex-1 max-h-[calc(100%-140px)] overflow-y-scroll scrollbar-hide border-b-2 border-gray-400  ">
            <div className="commment-list-cont">
              <ul className='comment-list overflow-y-auto scrollbar-hide'>
                {/* Loading / error states */}
                {isLoading && <div className="p-4">Loading comments...</div>}
                {isError && <div className="p-4 text-red-500">Error loading comments: {String(error?.message ?? error)}</div>}

                {allComments.length > 0 && (
                  <CommentLists
                    allComments={allComments}
                    userMainId={userMainId}
                    postId={postId}
                    BASE_URL={BASE_URL}
                  />
                )}

                <li ref={sentinelRef} className="h-6" />
                {isFetchingNextPage && <div className="p-4">Loading more comments...</div>}

                {hasNextPage ? (
                  <div className="p-4">
                    <button
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                      className="mt-4 px-4 py-2 bg-gray-200 rounded"
                    >
                      {isFetchingNextPage ? 'Loading...' : 'Load more'}
                    </button>
                  </div>
                ) : (
                  data && !isLoading && <div className="p-4 text-sm text-gray-500">No more comments</div>
                )}

              </ul>
            </div>
          </div>

          <ChatForm
            postComment={postComment}
            isCommentSection={true}
            darkMode={props.darkMode}
          />

        </div>
      </div>

      <button
        className='absolute top-6 right-6 text-5xl cursor-pointer '
        onClick={() => {
          props.closeCommentSection()
        }}
      >
        &times;
      </button>

      {showPostMenu === props.post?.id && (
        <PostMenu
          post={props.post}
          showPostMenu={showPostMenu === props.post?.id}
          setShowPostMenu={setShowPostMenu}
          handleDeletePost={props.handleDeletePost}
        />
      )}


    </div>

  )
}