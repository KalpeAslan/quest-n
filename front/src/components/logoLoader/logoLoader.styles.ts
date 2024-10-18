import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)<{ loaderSize?: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #87f696;
  position: relative;
  width: fit-content;

  .image {
    animation: circle 1.5s linear infinite;
    width: ${props => (props.loaderSize ? `${props.loaderSize}px` : "126px")};
    height: ${props => (props.loaderSize ? `${props.loaderSize}px` : "126px")};
  }

  .icon {
    position: absolute;
    animation: icon 3s linear infinite;
  }

  @keyframes icon {
    0% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }

    50% {
      -webkit-transform: scale(1.5);
      transform: scale(1.5);
    }

    100% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }

  @keyframes circle {
    100% {
      -webkit-transform: rotate(-360deg);
      transform: rotate(-360deg);
    }
  }
`;
