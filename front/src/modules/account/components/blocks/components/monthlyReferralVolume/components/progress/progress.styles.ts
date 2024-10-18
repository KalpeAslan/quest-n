import styled from "@emotion/styled";
import { Box } from "@mui/system";

export const ProgressWrapper = styled(Box)`
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;

  .progress:last-child {
    margin-bottom: 0;
  }

  .progress-wrapper {
    position: relative;
    width: 100%;
    height: 4px;
    background-color: rgb(135 246 150 / 5%);
    border-radius: 4px;
  }

  .progress-score {
    height: 4px;
    background: linear-gradient(
      270deg,
      rgb(136 246 150 / 50%) 0%,
      rgb(136 246 150 / 0%) 100%
    );
    border-radius: 4px;
  }

  .progress-footer {
    margin-bottom: 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .cont {
    display: flex;
    align-items: center;
  }

  .title {
    color: rgb(82 143 90 / 100%);
  }
`;
