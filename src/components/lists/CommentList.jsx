import React, { useEffect, useState } from 'react'
import { apiFetch, BASE_URL } from "../../service/api";

import { relativeTimeCompact } from "../../utils/dateUtils";
import { Heart } from 'lucide-react';


export default function CommentLists(props) {
  const [hearted, setHeart] = useState(props.allComments.map(p => p.likedByUser || false));
  const [likes, setLikes] = useState(props.allComments.map(v => v.likes));
  const [animate, setAnimate] = useState(Array(props.allComments.length).fill(false));
  const [commentLikeProcessingIndexes, setCommentLikeProcessingIndexes] = useState(
    new Set()
  );

  // sync when props.allComments updates (handles newly uploaded comments)
  useEffect(() => {
    const comments = props.allComments || [];
    setHeart(comments.map((c) => !!c.likedByUser));
    setLikes(comments.map((c) => Number(c.likes || 0)));
    setAnimate(Array(comments.length).fill(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.allComments]);

  const toggleCommentLike = async (item, index) => {
    if (!item || typeof index !== "number") return;

    // prevent double-clicks for the same comment
    if (commentLikeProcessingIndexes.has(item.id)) return;

    // mark index as processing
    setCommentLikeProcessingIndexes((prev) => new Set(prev).add(item.id));

    setHeart((prev) => {
      const newHeart = [...prev];
      newHeart[index] = !newHeart[index];

      // update likes at the same time based on newHeart[index]
      setLikes((prevLikes) => {
        const newLikes = [...prevLikes];
        newLikes[index] += newHeart[index] ? 1 : -1;
        return newLikes;
      });

      return newHeart;
    });

    setAnimate((prev) => {
      const newAnim = [...prev];
      newAnim[index] = true;
      return newAnim;
    });

    setTimeout(() => {
      setAnimate((prev) => {
        const newAnim = [...prev];
        newAnim[index] = false;
        return newAnim;
      });
    }, 200);

    try {
      const token = localStorage.getItem("token"); // JWT if you have it
      const userId = Number(localStorage.getItem("userId")) || props.userMainId;
      const postId = Number(localStorage.getItem("postId")) || props.postId;

      if (!userId) {
        throw new Error("userId is missing (store it in localStorage or pass via props)");
      }
      if (!postId) {
        throw new Error("userId is missing (store it in localStorage or pass via props)");
      }

      const res = await fetch(`${BASE_URL}/api/posts/comments/${item.id}/like`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ postId, userId }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Failed: ${res.status}`);
      }

      const data = await res.json();
      console.log("like response:", data);

      //  update hearted[] and likes[] based on backend response
      setHeart((prev) => {
        const newHeart = [...prev];
        newHeart[index] = data.likedByUser; // backend truth
        return newHeart;
      });

      setLikes((prevLikes) => {
        const newLikes = [...prevLikes];
        newLikes[index] = Number(data.likes); // backend count
        return newLikes;
      });
    } catch (err) {
      console.error("Error toggling like:", err);
    } finally {
      setCommentLikeProcessingIndexes((prev) => {
        const copy = new Set(prev);
        copy.delete(item.id);
        return copy;
      });
    }
  };

  return (
    <>
      {props.allComments.map((comment, index) => (

        <li key={`${comment.id}-${index}`}
          className=" p-4">

          <div className='flex justify-between items-center'>
            <div className='flex gap-4'>
              <span className="rounded-full min-w-12">
                <img className="rounded-full h-12 w-12 "
                  alt="profile"
                  src={comment.profilePhotoUrl}
                />
              </span>

              <div className=''>
                <div
                  className='text-left'>
                  <strong>{comment.username}</strong>: {comment.comment}

                </div>
                <div className='flex gap-4 mt-3'>
                  <span>{relativeTimeCompact(comment.createdAt)}</span>
                  <span> {likes[index] ?? 0} like{(likes[index] ?? 0) !== 1 ? "s" : ""}</span>
                  {/* <span> Reply</span> */}
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                toggleCommentLike(comment, index);
              }}
              disabled={commentLikeProcessingIndexes.has(comment.id)}
              className='min-w-6 flex justify-center items-center'
            >
              <Heart
                size={16}
                className={`cursor-pointer transition-transform duration-200
                ${props.animate ? "scale-150" : "scale-100"} hover:opacity-50 dark:invert`}
                color={hearted[index] ? "red" : "gray"} // <-- set the color here
                fill={hearted[index] ? "red" : "none"}  // fill the heart when liked
              />

            </button>

          </div>
        </li>
      ))}
    </>
  )
}


