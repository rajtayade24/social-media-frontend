import React, { useRef, useState, useEffect } from "react";
import image1 from "../images/arjit.jpg";
import image2 from "../images/raj.jpg";
import image3 from "../images/english.jpg";

function StorySection() {
  null

  
  // const storyRef = useRef(null);

  // // Track scroll state
  // const [canScrollLeft, setCanScrollLeft] = useState(false);
  // const [canScrollRight, setCanScrollRight] = useState(false);
  // // Function to check scroll position
  // const checkScroll = () => {
  //   const el = storyRef.current;
  //   if (!el) return;
  //   setCanScrollLeft(el.scrollLeft > 0);
  //   setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
  // };
  // // Attach scroll listener
  // useEffect(() => {
  //   checkScroll();
  //   const el = storyRef.current;
  //   el.addEventListener("scroll", checkScroll);
  //   return () => el.removeEventListener("scroll", checkScroll);
  // }, []);

  // const scrollLeft = () => {
  //   storyRef.current.scrollBy({ left: -200, behavior: "smooth" });
  // };

  // const scrollRight = () => {
  //   storyRef.current.scrollBy({ left: 200, behavior: "smooth" });
  // };
  // return (
  //   <div className="relative max-w-[660px] mx-auto max-[800px]:w-[85vw] max-[95px]:w-[95px] max-[660px]:">
  //     <div
  //       ref={storyRef}
  //       className="story-section overflow-x-auto flex justify-evenly items-center gap-6 p-2 my-4 scroll-smooth scrollbar-hide"
  //     >
  //       {/* Your existing story items */}
  //       <div className="status-items active:scale-95 cursor-pointer transition-transform duration-300 whitespace-nowrap">
  //         <span className="rounded-full">
  //           <img
  //             className="rounded-full h-18 w-18 outline-4 outline-amber-700 outline-offset-3"
  //             src={image1}
  //             alt="story"
  //           />
  //         </span>
  //         <div className="mt-2">ai chatgpt</div>
  //       </div>

  //       <div className="status-items active:scale-95 cursor-pointer transition-transform duration-300 whitespace-nowrap">
  //         <span className="rounded-full">
  //           <img
  //             className="rounded-full h-18 w-18 outline-4 outline-amber-700 outline-offset-3"
  //             src={image2}
  //             alt="story"
  //           />
  //         </span>
  //         <div className="mt-2">ai chatgpt</div>
  //       </div>


  //       <div className="status-items active:scale-95 cursor-pointer transition-transform duration-300 whitespace-nowrap">
  //         <span className="rounded-full">
  //           <img
  //             className="rounded-full h-18 w-18 outline-4 outline-amber-700 outline-offset-3"
  //             src={image3}
  //             alt="story"
  //           />
  //         </span>
  //         <div className="mt-2">ai chatgpt</div>
  //       </div>

  //       <div className="status-items active:scale-95 cursor-pointer transition-transform duration-300 whitespace-nowrap">
  //         <span className="rounded-full">
  //           <img className="rounded-full h-18 w-18 outline-4 outline-amber-700 outline-offset-3"
  //             src={image1}
  //             alt="story"
  //           />
  //         </span>
  //         <div className="mt-2">ai chatgpt</div>
  //       </div>

  //       <div className="status-items active:scale-95 cursor-pointer transition-transform duration-300 whitespace-nowrap">
  //         <span className="rounded-full">
  //           <img
  //             className="rounded-full h-18 w-18 outline-4 outline-amber-700 outline-offset-3"
  //             src={image2}
  //             alt="story"
  //           />
  //         </span>
  //         <div className="mt-2">ai chatgpt</div>
  //       </div>

  //       <div className="status-items active:scale-95 cursor-pointer transition-transform duration-300 whitespace-nowrap">
  //         <span className="rounded-full">
  //           <img
  //             className="rounded-full h-18 w-18 outline-4 outline-amber-700 outline-offset-3"
  //             src={image3}
  //             alt="story"
  //           />
  //         </span>
  //         <div className="mt-2">ai chatgpt</div>
  //       </div>

  //       <div className="status-items active:scale-95 cursor-pointer transition-transform duration-300 whitespace-nowrap">
  //         <span className="rounded-full">
  //           <img className="rounded-full h-18 w-18 outline-4 outline-amber-700 outline-offset-3"
  //             src={image1}
  //             alt="story"
  //           />
  //         </span>
  //         <div className="mt-2">ai chatgpt</div>
  //       </div>

  //       <div className="status-items active:scale-95 cursor-pointer transition-transform duration-300 whitespace-nowrap">
  //         <span className="rounded-full">
  //           <img
  //             className="rounded-full h-18 w-18 outline-4 outline-amber-700 outline-offset-3"
  //             src={image2}
  //             alt="story"
  //           />
  //         </span>
  //         <div className="mt-2">ai chatgpt</div>
  //       </div>

  //       <div className="status-items active:scale-95 cursor-pointer transition-transform duration-300 whitespace-nowrap">
  //         <span className="rounded-full">
  //           <img
  //             className="rounded-full h-18 w-18 outline-4 outline-amber-700 outline-offset-3"
  //             src={image3}
  //             alt="story"
  //           />
  //         </span>
  //         <div className="mt-2">ai chatgpt</div>
  //       </div>

  //       <div className="status-items active:scale-95 cursor-pointer transition-transform duration-300 whitespace-nowrap">
  //         <span className="rounded-full">
  //           <img className="rounded-full h-18 w-18 outline-4 outline-amber-700 outline-offset-3"
  //             src={image1}
  //             alt="story"
  //           />
  //         </span>
  //         <div className="mt-2">ai chatgpt</div>
  //       </div>

  //       <div className="status-items active:scale-95 cursor-pointer transition-transform duration-300 whitespace-nowrap">
  //         <span className="rounded-full">
  //           <img
  //             className="rounded-full h-18 w-18 outline-4 outline-amber-700 outline-offset-3"
  //             src={image2}
  //             alt="story"
  //           />
  //         </span>
  //         <div className="mt-2">ai chatgpt</div>
  //       </div>

  //       <div className="status-items active:scale-95 cursor-pointer transition-transform duration-300 whitespace-nowrap">
  //         <span className="rounded-full">
  //           <img
  //             className="rounded-full h-18 w-18 outline-4 outline-amber-700 outline-offset-3"
  //             src={image3}
  //             alt="story"
  //           />
  //         </span>
  //         <div className="mt-2">ai chatgpt</div>
  //       </div>

  //       <div className="status-items active:scale-95 cursor-pointer transition-transform duration-300 whitespace-nowrap">
  //         <span className="rounded-full">
  //           <img className="rounded-full h-18 w-18 outline-4 outline-amber-700 outline-offset-3"
  //             src={image1}
  //             alt="story"
  //           />
  //         </span>
  //         <div className="mt-2">ai chatgpt</div>
  //       </div>

  //       <div className="status-items active:scale-95 cursor-pointer transition-transform duration-300 whitespace-nowrap">
  //         <span className="rounded-full">
  //           <img
  //             className="rounded-full h-18 w-18 outline-4 outline-amber-700 outline-offset-3"
  //             src={image2}
  //             alt="story"
  //           />
  //         </span>
  //         <div className="mt-2">ai chatgpt</div>
  //       </div>

  //       <div className="status-items active:scale-95 cursor-pointer transition-transform duration-300 whitespace-nowrap">
  //         <span className="rounded-full">
  //           <img className="rounded-full h-18 w-18 outline-4 outline-amber-700 outline-offset-3"
  //             src={image3}
  //             alt="story"
  //           />
  //         </span>
  //         <div className="mt-2">ai chatgpt</div>
  //       </div>
  //     </div>

  //     {/* Prev button (🆕 conditionally rendered) */}
  //     {canScrollLeft && (
  //       <button
  //         onClick={scrollLeft}
  //         className="absolute left-2 top-1/2 -translate-y-1/2 bg-white font-bold rounded-full p-2 shadow-md"
  //       >
  //         &#10094;
  //       </button>
  //     )}

  //     {/* Next button (🆕 conditionally rendered) */}
  //     {canScrollRight && (
  //       <button
  //         onClick={scrollRight}
  //         className="absolute right-2 top-1/2 -translate-y-1/2 bg-white font-bold rounded-full p-2 shadow-md">
  //         &#10095;
  //       </button>
  //     )}
  //   </div>
  // )
}

export default StorySection
