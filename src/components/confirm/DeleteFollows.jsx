import React, { createElement, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import useAuthStore from '../../store/useAuthStore';
import { BASE_URL } from '../../service/api';
import { deleteNotificationByActorIdAndRecipientIdByTypeLike } from '../../service/notificationService';
export default function DeleteFollows(props) {
  const userMainId = useAuthStore(s => s.userMainId)

  const [portalEl] = useState(() =>
    typeof document !== "undefined" ? document.createElement("div") : null
  );
  useEffect(() => {
    if (!portalEl) return;
    portalEl.className = "postmenu-modal-portal"; // optional class for global styling
    document.body.appendChild(portalEl);
    return () => {
      if (document.body.contains(portalEl)) document.body.removeChild(portalEl);
    };
  }, [portalEl]);

  console.log(props.currentFollow);

  const modal = (
    <div className="fixed inset-0 bg-black/75 bg-opacity-50 flex items-center justify-center z-[99]">
      <div className="bg-white w-[400px] max-h-[300px] rounded-2xl shadow-lg flex flex-col p-6 dark:bg-[#1e1c21] dark:text-white ">

        <div className="flex items-center gap-3 mb-4">
          <img
            src={props.currentFollow.profilePhotoUrl.startsWith("http") ?
              props.currentFollow.profilePhotoUrl : BASE_URL + props.currentFollow.profilePhotoUrl
            }
            alt="profile"
            className="w-12 h-12 rounded-full"
          />
          <p className="text-sm">
            {props.desc}{" "}
            <span className="font-semibold">@{props.currentFollow.username}</span>?
          </p>
        </div>

        <div className="flex justify-around mt-4">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-full"
            onClick={() => {
              props.onConfirm(props.currentFollow?.userId ?? props.currentFollow?.id);

              if (deleteNotificationByActorIdAndRecipientIdByTypeLike) {
                deleteNotificationByActorIdAndRecipientIdByTypeLike({
                  recipientId: props.currentFollow.userId ?? props.currentFollow.id,
                  actorId: userMainId,
                  type: "FOLLOW"
                })
              }
              props.setConformation(null); // close modal
            }}
          >
            Unfollow
          </button>

          <button
            type="button"
            onClick={() => props.setConformation(null)} // close modal
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-full"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
  return createPortal(modal, portalEl);
}
