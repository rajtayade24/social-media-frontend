// import React, { useEffect } from 'react'
// import useAuthStore from '../../store/useAuthStore';

// export default function PostMenu(props) {

//   const userMainId = useAuthStore(s => s.userMainId)

//   const handleBackdropClick = (e) => {
//     if (e.target === e.currentTarget) handleClose();
//   };
//   const handleClose = () => { props.setShowPostMenu(false) }

// console.log("postmenu");
//   return (
//     <div onClick={handleBackdropClick} className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-[999] " >
//       <div className="bg-white w-[400px] max-h-[300px] rounded-2xl shadow-lg flex flex-col">

//         <button
//           className='btn border-b-3 border-gray-300 text-red-600 rounded-t-2xl py-4 '>Report</button>

//         {userMainId === props.post.userId && (
//           <button
//             onClick={() => {
//               props.handleDeletePost(props.post.id)
//               props.setShowPostMenu(false)
//             }}
//             className='btn border-b-3 border-gray-300 text-red-600 rounded-b-2xl py-4 '>
//             Delete</button>
//         )
//         }
//       </div>

//       <button
//         type='button'
//         onClick={() => handleClose()}
//         className='absolute top-6 right-6 text-5xl cursor-pointer text-white '
//       >
//         &times;
//       </button>
//     </div>

//   )
// }


import React, { useEffect, useState } from 'react'
import useAuthStore from '../../store/useAuthStore';
import { createPortal } from 'react-dom';

export default function PostMenu(props) {

  const userMainId = useAuthStore(s => s.userMainId)

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };
  const handleClose = () => { props.setShowPostMenu(false) }

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


  const modal = (
    <div onClick={handleBackdropClick} className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-[99] " >
      <div className="bg-white w-[400px] max-h-[300px] rounded-2xl shadow-lg flex flex-col">

        <button
          className='btn border-b-3 border-gray-300 text-red-600 rounded-t-2xl py-4 '>Report</button>

        {userMainId === props.post.userId && (
          <button
            onClick={() => {
              props.handleDeletePost(props.post.id)
              props.setShowPostMenu(false)
            }}
            className='btn border-b-3 border-gray-300 text-red-600 rounded-b-2xl py-4 '>
            Delete</button>
        )
        }
      </div>

      <button
        type='button'
        onClick={() => handleClose()}
        className='absolute top-6 right-6 text-5xl cursor-pointer text-white '
      >
        &times;
      </button>
    </div>

  )
  return createPortal(modal, portalEl);

}

