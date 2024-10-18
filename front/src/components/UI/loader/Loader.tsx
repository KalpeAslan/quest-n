import { Backdrop, CircularProgress } from "@mui/material";
import { CSSProperties } from "react";

type Props = {
  backgroundColor?: string;
  width?: string;
  size?: number;
  style?: CSSProperties;
};

const Loader = ({ backgroundColor, width, size, style }: Props) => {
  return (
    <>
      <Backdrop
        sx={{
          color: "var(--scrollbar-background-color)",
          backgroundColor: backgroundColor,
          position: "absolute",
          zIndex: theme => theme.zIndex.drawer + 1,
          width,
          ...style
        }}
        open={true}
        transitionDuration={0}
      >
        <CircularProgress color="inherit" size={size || 40} />
      </Backdrop>
    </>
  );
};

export default Loader;

Loader.defaultProps = {
  backgroundColor: "var(--app-background-color)",
} as Partial<Props>;
