import styled from "@emotion/styled";
import { Box } from "@mui/material";
import { CBreakpoints } from "@styles/variables";

export const Wrapper = styled(Box)<{
  preview?: boolean;
  fullPreview?: boolean;
}>`
  ${props => props.preview && "pointer-events: none;"}
  flex: 1;
  width: 100%;
  padding: 0 16px;
  display: flex;
  position: relative;
  ${({ preview, fullPreview }) => ({
    [`@media (min-width: ${CBreakpoints.xLg}px)`]: {
      paddingRight: preview && !fullPreview && "0",
      ".time": {
        paddingRight: preview && !fullPreview && "0 !important",
      },
    },
  })}

  .sticky {
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  ${({ preview, fullPreview }) =>
    (!preview || fullPreview) &&
    ` @media (min-width: 768px) {
    padding: 0 24px;

    .tasks {
      margin-right: 0;
      margin-left: 0;
    }
  }

  @media (min-width: 1024px) {
    display: grid;
    grid-template-areas:
      "header sticky"
      "tasks sticky"
      "footer sticky";
    column-gap: 30px;
    grid-template-columns: 3fr 350px;

    .header {
      grid-area: header;
    }

    .sticky {
      margin-top: 0;
      grid-area: sticky;
      flex-direction: column;
    }

    .tasks {
      grid-area: tasks;
    }

    .scoreboard {
      width: 100%;
    }

    .scoreboard {
      margin-top: 0;
    }
  }

  @media (min-width: 1280px) {
    max-width: 1180px;
    margin-right: auto;
    margin-left: auto;
  }

  @media (min-width: 1440px) {
    padding: 0 55px;
  }`}
`;
