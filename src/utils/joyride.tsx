const getCombinedRect = (elements) => {
  const rects = elements.map((element) => element.getBoundingClientRect());
  const combinedRect = rects.reduce(
    (acc, rect) => ({
      top: Math.min(acc.top, rect.top),
      right: Math.max(acc.right, rect.right) + 11,
      bottom: Math.max(acc.bottom, rect.bottom),
      left: Math.min(acc.left, rect.left) + 1,
    }),
    {
      top: Infinity,
      right: -Infinity,
      bottom: -Infinity,
      left: Infinity,
    }
  );

  return {
    top: combinedRect.top + window.scrollY,
    left: combinedRect.left + window.scrollX,
    width: combinedRect.right - combinedRect.left,
    height: combinedRect.bottom - combinedRect.top,
  };
};

const createOverlay = (rect) => {
  const overlay = document.createElement("div");
  overlay.style.position = "absolute";
  overlay.style.top = `${rect.top}px`;
  overlay.style.left = `${rect.left}px`;
  overlay.style.width = `${rect.width}px`;
  overlay.style.height = `${rect.height}px`;
  overlay.style.pointerEvents = "none"; // Allow clicks to pass through
  //overlay.style.border = "2px solid red"; // Example styling
  overlay.setAttribute("id", "joyride-overlay");

  document.body.appendChild(overlay);
};

export const wrapMultiElements = (steps) => {
  steps.forEach((step, index) => {
    if (Array.isArray(step.target)) {
      const targets = step.target
        .map((selector) => document.querySelector(selector))
        .filter((el) => !!el);

      if (targets.length > 0) {
        const combinedRect = getCombinedRect(targets);
        createOverlay(combinedRect);

        // Update the step to target the overlay
        steps[index].target = "#joyride-overlay";
      }
    }
  });
};
