import { CSSProperties, useEffect, useRef } from "react";
import {
  OverlayScrollbarsComponent,
  OverlayScrollbarsComponentRef,
} from "overlayscrollbars-react";
import { OverflowBehavior } from "overlayscrollbars";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getForceScrollRerender } from "@/store/slices/system/system.selector";

interface Props {
  children: any;
  type?: "primary" | "table";
  overflowBehavior?:
    | {
        x?: OverflowBehavior | undefined;
        y?: OverflowBehavior | undefined;
      }
    | undefined;
  styles?: CSSProperties;
  shouldScrollTop?: boolean;
}

const Scroll = ({
  children,
  overflowBehavior,
  type,
  styles,
  shouldScrollTop,
}: Props) => {
  const scroll = useRef<OverlayScrollbarsComponentRef>(null);
  const router = useRouter();

  const forceScrollRerender = useTypedSelector(getForceScrollRerender);

  useEffect(() => {
    if (scroll.current && shouldScrollTop) {
      const osInstance = scroll.current.osInstance();
      const viewport = osInstance.elements().viewport;
      viewport.scrollTo({ top: 0, left: 0 });
    }
  }, [shouldScrollTop, router, forceScrollRerender]);

  return (
    <StyledOverlayScrollbarsComponent
      style={{
        width: "100%",
        ...styles,
      }}
      className={`scroll-${type}`}
      // @ts-ignore
      ref={scroll}
      options={{
        paddingAbsolute: true,
        overflow: overflowBehavior,
        scrollbars: {
          autoHide: "leave",
          dragScroll: true,
          clickScroll: true,
          theme: "os-theme-dark",
        },
      }}
    >
      {children}
    </StyledOverlayScrollbarsComponent>
  );
};

const StyledOverlayScrollbarsComponent = styled(OverlayScrollbarsComponent)`
  & > .os-viewport {
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
  }

  & .os-viewport {
    overflow-x: hidden !important;
    display: flex;
    flex-direction: column;
  }

  [data-overlayscrollbars-viewport],
  [data-overlayscrollbars-viewport="scrollbarHidden"] {
    overflow-x: hidden !important;
    display: flex;
    flex-direction: column;
  }
`;

Scroll.defaultProps = {
  overflowBehavior: {
    x: "hidden",
    y: "scroll",
  },
} as Partial<Props>;

export default Scroll;
