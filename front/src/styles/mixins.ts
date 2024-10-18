import { css, CSSObject } from "@emotion/react";
import { CBreakpoints } from "@styles/variables";
import { CSSInterpolation } from "@emotion/serialize";

type TMedia = (
  first: CSSObject | TemplateStringsArray,
  ...interpolations: any[]
) => ReturnType<typeof css>;

type Media = {
  [key: string]: TMedia;
};

const mediaMinWidth =
  width =>
  (...args) =>
    css`
      @media (min-width: ${width}px) {
        ${css(...args)};
      }
    `;

export const mediaMaxWidth = width => (arg: CSSInterpolation | CSSObject) =>
  css`
    @media (max-width: ${width}px) {
      ${css(arg as any)};
    }
  `;
export const media: Media = {
  tabletMinWidth: mediaMinWidth(CBreakpoints.tablet),
};
