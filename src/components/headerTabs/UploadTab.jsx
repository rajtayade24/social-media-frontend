import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import { useUserPosts } from "../../hooks/useUserPosts";

export default function uploadTab(props) {
  const navigate = useNavigate();
  const { selectedFiles, caption, setSelectedFiles, setCaption, setMyPosts, activeSection, setActiveSection, userMainId } = useAuthStore();

  const handleClose = () => {
    setCaption('')
    setSelectedFiles([])
    navigate("/");
    setActiveSection(null)
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files);
    props.setSelectedFiles(files);
  };

  const { postPostMutation } = useUserPosts(userMainId)

  const handleUpload = async (e) => {
    e.preventDefault()
    if (props.selectedFiles.length === 0) {
      alert("Please select files first!");
      return;
    }

    const formData = new FormData();
    formData.append("userId", userMainId);
    formData.append("type", "POST");
    formData.append("caption", props.caption);
    formData.append("likes", 0)
    formData.append("comments", 0)
    formData.append("shares", 0)

    // formData.append("file", props.selectedFiles[0]);
    props.selectedFiles.forEach((file) => {
      formData.append("file", file); // backend should accept multiple "file"
    });

    for (let [k, v] of formData.entries()) {
      console.log(k, v);
    }
    postPostMutation.mutate(formData);

    const { windowWidth } = useAuthStore()
    // Clear UI
    setSelectedFiles([]);
    setCaption("");
    navigate("/")
    // if (setActiveSection) setActiveSection(null);
  };
  return (
    <div className="fixed inset-0 bg-black/70 z-[999] flex items-center justify-center backdrop-blur-sm transition-all duration-300"
      onClick={handleBackdropClick}>
      <form
        onSubmit={(e) => handleUpload(e)}
        className="max-w-[80%] bg-white rounded-xl shadow-lg overflow-hidden flex items-center flex-col p-1 dark:bg-gray-800 dark:text-[#fafafa]"
      >
        <div className="w-full border-b border-gray-300 dark:bg-gray-900 py-3 text-center font-semibold text-lg">
          Upload new post
        </div>

        <div className={`${props.width > props.mobileWidth ? "flex justify-between gap-6 mt-4" : "mt-4 flex flex-col gap-4"}`}>

          <div
            className="flex flex-col items-center justify-center py-6 px-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 transition-colors"
            onDragOver={(e) => e.preventDefault()} // allow drop
            onDragEnter={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const files = Array.from(e.dataTransfer.files);
              props.setSelectedFiles(files);
            }}
          >
            {props.selectedFiles.length === 0 ? (
              <>
                <div className="mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16"> <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 9h18M4.5 21h15a1.5 1.5 0       001.5-1.5V7.5a1.5 1.5 0       00-1.5-1.5h-15A1.5 1.5 0       003 7.5v12a1.5 1.5 0 001.5 1.5z" />  </svg>
                </div>
                <p className="mb-6 text-gray-600 dark:text-gray-300">Drag photos and videos here</p>

                <label
                  htmlFor="file"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-shadow shadow hover:shadow-lg cursor-pointer"
                >
                  Select from computer
                </label>
                <input
                  type="file"
                  id="file"
                  className="hidden"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleFilesChange}
                />
              </>
            ) : (

              <div className="grid gap-4 h-[100%] overflow-y-auto justify-items-center">
                {props.selectedFiles.map((file, index) => {
                  const url = URL.createObjectURL(file);
                  return file?.type?.startsWith("image") ? (
                    <img
                      key={index}
                      src={url}
                      alt="preview"
                      className="w-[450px] max-h-[500px]  object-cover rounded-lg  shadow-md"
                    />
                  ) : (
                    <video
                      key={index}
                      src={url}
                      controls
                      className="w-[450px] max-h-[500px]  object-cover rounded-lg  shadow-md"
                    />
                  );
                })}
              </div>
            )}

          </div>

          {props.selectedFiles.length > 0 && (
            <div className="flex justify-center flex-col gap-4 mt-4 md:mt-0 md:w-[35%] pr-3">
              <label className="text-2xl font-semibold dark:text-gray-200">Caption:</label>
              <textarea className={`resize-y min-w-[200px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-[#fafafa]
              ${props.width > props.mobileWidth ? "" : "w-full"}
              `}
                name="caption"
                value={props.caption}
                onChange={(e) => props.setCaption(e.target.value)}
                placeholder="Write your caption here..."
                id="caption"
                rows={props.width > props.mobileWidth ? 16 : 2}
              >
              </textarea>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-shadow shadow hover:shadow-lg"
                type="submit"
              >
                Upload
              </button>
            </div>
          )}
        </div>

      </form>

      <span
        onClick={handleClose}
        className="absolute top-5 right-5 text-white text-4xl md:text-5xl cursor-pointer hover:text-red-500 transition-colors"
      >
        &times;
      </span>
    </div>
  );
}


