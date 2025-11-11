import { useEffect } from "react";

export const stopOverflow = (arr) => {
  useEffect(() => {
    console.log("stoping overflow");
    const html = document.documentElement; // <html> element
    const body = document.body;

    if (arr?.some(Boolean)) {
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
    } else {
      html.style.overflow = "";
      body.style.overflow = "";
    }

    // optional cleanup (in case component unmounts unexpectedly)
    return () => {
      html.style.overflow = "";
      body.style.overflow = "";
    };
  }, arr);
}