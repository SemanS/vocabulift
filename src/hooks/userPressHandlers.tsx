import { useState, useEffect, useRef } from "react";

function usePressHandlers(shortPress, longPress, delay = 500) {
  const [pressTimer, setPressTimer] = useState(null);

  const startPress = (event) => {
    event.preventDefault();
    const timerId = setTimeout(() => longPress(event), delay);
    setPressTimer(timerId);
  };

  const endPress = (event) => {
    if (pressTimer !== null) {
      clearTimeout(pressTimer);
      shortPress(event);
    }
  };

  const pressHandlers = {
    onTouchStart: startPress,
    onTouchEnd: endPress,
    onTouchMove: (e) => e.preventDefault(),
  };

  return pressHandlers;
}

export default usePressHandlers;
