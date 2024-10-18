import { useLayoutEffect, useState } from "react";

export const useIsOverflow = ({
  ref,
  callback,
}: {
  ref: any;
  callback?: (isOverflow: boolean) => void;
}) => {
  const [isOverflow, setIsOverflow] = useState<boolean>(false);

  useLayoutEffect(() => {
    const { current } = ref;

    const trigger = () => {
      const hasOverflow = current.scrollWidth > current.clientWidth;

      setIsOverflow(hasOverflow);

      if (callback) callback(hasOverflow);
    };

    if (current) {
      trigger();
    }
  }, [callback, ref]);

  return isOverflow;
};
