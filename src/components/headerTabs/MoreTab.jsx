// src/components/headerTabs/MenuTab.jsx
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import useAuthStore from "../../store/useAuthStore";

import { Moon, Sun, } from "lucide-react";

export default function MenuTab(props) {
  const logout = useAuthStore(s => s.logout)

  const toggleDarkMode = useAuthStore(s => s.toggleDarkMode)
  const [portalEl] = useState(() =>
    typeof document !== "undefined" ? document.createElement("div") : null
  );

  const handleLogout = () => {
    logout()
  }
  const { windowWidth } = useAuthStore()

  // Mount portal element into body
  useEffect(() => {
    if (!portalEl) return;
    portalEl.className = "more-modal-portal"; // optional class for global styling
    document.body.appendChild(portalEl);
    return () => {
      if (document.body.contains(portalEl)) document.body.removeChild(portalEl);
    };
  }, [portalEl]);

  const modal = (
    < div className={`fixed z-[999] w-56 bg-white py-2 rounded-2xl shadow-2xl cursor-pointer dark:bg-gray-800 dark:text-[#fafafa]
      ${windowWidth > props.mobileWidth ? "left-20 bottom-20" : "top-20 right-2"} 
      `} onClick={props.handleBackdropClick} >

      <div className="border-b-2 border-gray-500">
        <button
          onClick={() => toggleDarkMode()}
          className="flex items-center p-2 w-full cursor-pointer dark:hover:bg-gray-700"
          aria-pressed={props.darkMode}
        >
          <span className="border-2 rounded-full text-gray-500 p-1.5 dark:invert">

            {props.darkMode ? <Moon /> : <Sun />}
          </span>

          <span className="ml-2 select-none">Switch appearance</span>
        </button>
      </div>

      <div>
        <button
          onClick={() => handleLogout()}
          className="flex items-center p-2 w-full cursor-pointer dark:hover:bg-gray-700"
        >
          Log out
        </button>
        <button
          onClick={() => handleLogout()}
          className="flex items-center p-2 w-full cursor-pointer dark:hover:bg-gray-700"
        >

        </button>
      </div>


    </div >
  )
  return createPortal(modal, portalEl)

}