import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)`
  .dropzone {
    position: relative;
    border-radius: 10px;
    border: 1px dashed rgba(255, 255, 255, 0.3);
    background: linear-gradient(
      123deg,
      rgba(84, 126, 190, 0.08) 14.13%,
      rgba(81, 220, 94, 0.08) 85.37%
    );
    width: 235px;
    height: 235px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    overflow: hidden;
    margin-bottom: 10px;
  }

  .logo {
    position: absolute;
    top: 0;
    left: 0;
  }

  .uploadIcon {
    margin-right: 4px;
  }

  .hoverBackdrop {
    width: 235px;
    height: 235px;
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.76);
    backdrop-filter: blur(3.5px);
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .deleteWrapper {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: rgba(116, 116, 116, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .logoHelper {
    color: rgba(255, 255, 255, 0.6);
    max-width: 223px;
  }
`;
