import { RefObject, useEffect, useState } from "react";

export const useObserver = (
  ref: RefObject<Element>,
  options: IntersectionObserverInit = {},
): [boolean, (val: boolean) => void] => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return [isIntersecting, setIsIntersecting];
};
