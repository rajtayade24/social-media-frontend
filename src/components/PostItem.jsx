// src/components/PostItem.jsx
import React from "react";
import PostsProfileCard from "./profile/PostsProfileCard";
import MediaCardMain from "./cards/mediaCardMain";
import CommentSection from "./CommentSection";
import PostMenu from "./menu/PostMenu";
import PostActionIcons from "./cards/PostActionIcons";

export default function PostItem({
  post,
  index,
  fileRefs,
  fileParentRef,
  handlers,
  state,
  propsForMenu,
  assets,
}) {
  const {
    handleLike,
    toggleSave,
    openCommentSection,
    handleSound,
    handleDeletePost,
    setOpeningCommentSection,
  } = handlers;

  const {
    isLikedByUser,
    isSavedByUser,
    animate,
    likes,
    activeCommentSection,
    sounded,
    showPostMenu,
    isOpeningCommentSection,
  } = state;

  const { sound, soundMuted, } = assets;

  return (
    <li key={`${index}-${post.id}`}>
      <div className="card border-b-2 border-gray-300 pb-5 mb-5 dark:border-gray-700">
        <PostsProfileCard
          post={post}
          handleProfileSection={handlers.handleProfileSection}
          setShowPostMenu={propsForMenu.setShowPostMenu}
        />

        <div
          className="bg-black relative min-h-[475px] flex items-center"
          ref={(el) => (fileParentRef.current[index] = el)}
        >
          {post.fileUrl && (
            <MediaCardMain
              fileRefs={fileRefs}
              fileUrl={post.fileUrl}
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
          isOpeningCommentSection={isOpeningCommentSection}
          setOpeningCommentSection={setOpeningCommentSection}
          openCommentSection={() => openCommentSection(index)}
          toggleSave={() => toggleSave(index)}
          handleLike={() => handleLike(post, index)}
          index={index}
        />

        <div>
          <div className="font-[500]">{likes[index]} likes</div>
          <p className="my-2">{post.caption}</p>
          <input
            className="w-[100%] outline-none"
            type="text"
            placeholder="Add a comment..."
            autoComplete="off"
          />
        </div>
      </div>

      {activeCommentSection[index] && (
        <CommentSection
          fileRefs={fileRefs.current[index]}
          fileParentRef={fileParentRef.current[index]}
          index={index}
          post={post}
          sounded={sounded}
          sound={sound}
          soundMuted={soundMuted}
          handleSound={handleSound}
          isVideo={post?.fileUrl?.endsWith(".mp4")}
          openCommentSection={openCommentSection}
          id={post.id}
          userId={post.userId}
          userMainId={propsForMenu.userMainId}
          setOpeningCommentSection={setOpeningCommentSection}
          BASE_URL={propsForMenu.BASE_URL}
          showPostMenu={showPostMenu}
          setShowPostMenu={propsForMenu.setShowPostMenu}
        />
      )}

      {showPostMenu && (
        <PostMenu
          post={post}
          showPostMenu={showPostMenu}
          setShowPostMenu={propsForMenu.setShowPostMenu}
          handleDeletePost={handleDeletePost}
        />
      )}
    </li>
  );
}
