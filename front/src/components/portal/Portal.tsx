import { LoggerService } from "@/services";
import { ReactNode, useState, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

type Props = {
  children: ReactNode;
  wrapperId: string;
};

const Portal = ({ children, wrapperId }: Props) => {
  const [wrapperElement, setWrapperElement] = useState<HTMLElement | null>(
    null,
  );

  useLayoutEffect(() => {
    let element = document.getElementById(wrapperId);
    let systemCreated = false;

    if (!element) {
      systemCreated = true;
      const wrapperElement = document.createElement("div");
      wrapperElement.setAttribute("id", wrapperId);
      document.body.appendChild(wrapperElement);
      element = wrapperElement;
    }

    setWrapperElement(element);

    return () => {
      if (systemCreated && element && element.parentNode) {
        try {
          element.parentNode.removeChild(element);
        } catch (error) {
          LoggerService.error("Error in removeChild operation", error);
        }
      }
    };
  }, [wrapperId]);

  if (wrapperElement === null) {
    return null;
  }

  return createPortal(children, wrapperElement);
};

export default Portal;
