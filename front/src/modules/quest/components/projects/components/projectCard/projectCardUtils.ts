export const computeBackgroundTransform = (
  num: number,
  size: "desktop" | "tablet" | "mobile",
) => {
  if (size === "desktop") {
    if (isInSequence(1, 6, num)) return "transform: rotate(0);";
    if (isInSequence(2, 6, num)) return "transform: scaleX(-1);";
    if (isInSequence(3, 6, num))
      return "background: url(/images/quest/Explore_Cards1_bg.png) no-repeat center;";
    if (isInSequence(3, 6, num)) return "transform: scaleX(-1);";
    if (isInSequence(4, 6, num)) return "transform: scaleX(-1) rotate(180deg);";
    if (isInSequence(5, 6, num)) return "transform: scale(-1) rotate(0deg);";
    if (isInSequence(6, 6, num))
      return "transform: rotate(180deg); background: url(/images/quest/Explore_Cards1_bg.png) no-repeat center;";
  } else if (size === "tablet") {
    if (isInSequence(1, 4, num))
      return "transform: rotate(0); background: url(/images/quest/Explore_Cards_bg.webp) no-repeat center;";
    if (isInSequence(2, 4, num))
      return "transform: scaleX(-1) rotate(0deg); background: url(/images/quest/Explore_Cards_bg.webp) no-repeat center;";
    if (isInSequence(3, 4, num))
      return "transform: scaleX(-1) rotate(180deg); background: url(/images/quest/Explore_Cards_bg.webp) no-repeat center;";
    if (isInSequence(4, 4, num))
      return "transform: rotate(180deg); background: url(/images/quest/Explore_Cards_bg.webp) no-repeat center;";
  } else if (size === "mobile") {
    if (isInSequence(1, 2, num))
      return "transform: rotate(0); background: url(/images/quest/Explore_Cards1_bg.png) no-repeat center; z-index: 1;";
    if (isInSequence(2, 2, num))
      return "transform: rotate(180deg); background: url(/images/quest/Explore_Cards1_bg.png) no-repeat center; z-index: 1;";
    if (isInSequence(3, 2, num))
      return "transform: rotate(0deg); background: url(/images/quest/Explore_Cards1_bg.png) no-repeat center; z-index: 1;";
    if (isInSequence(4, 2, num))
      return "transform: rotate(180deg); background: url(/images/quest/Explore_Cards1_bg.png) no-repeat center; z-index: 1;";
  }
};

function isInSequence(current, add, num) {
  return (num - current) % add === 0;
}
