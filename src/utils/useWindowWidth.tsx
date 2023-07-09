import { useState, useEffect } from "react";

export const useWindowWidth = () => {
  // Initialize state with window innerWidth if it exists
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : undefined
  );

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window's width to state
      setWindowWidth(window.innerWidth);
    }

    // Add event listener
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);

      // Call handler right away so state gets updated with initial window size
      handleResize();
    }

    // Remove event listener on cleanup
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return windowWidth;
};
