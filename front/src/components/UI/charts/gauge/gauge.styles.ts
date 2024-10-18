import styled from "@emotion/styled";
import { Box, Slider } from "@mui/material";

export const GaugeStylesWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;

  & text {
    position: relative;
  }
`;

export const GaugeStylesCont = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 16px;
`;

export const GaugeStylesFooter = styled(Box)`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

export const GaugeStylesItem = styled.div`
  text-align: center;
`;

export const GaugeStylesSlider = styled(Slider)`
  margin-bottom: 11px;

  .MuiSlider-thumb {
    width: 8px;
    height: 8px;
    border-radius: 8px;
    background: #cde459;
    box-shadow: 0px 0px 14px 0px #cde459;
  }
  .MuiSlider-track {
    background: linear-gradient(rgba(208, 227, 86, 1), rgba(135, 246, 150, 1));
    border: none;
  }

  .MuiSlider-mark {
    display: none;
  }

  .MuiSlider-rail {
    color: white;
    background: rgba(50, 50, 50, 1);
  }

  .MuiSlider-markLabel,
  .MuiSlider-markLabelActive {
    position: relative;
    color: rgba(255, 255, 255, 0.3);
    text-align: center;
    font-size: 10px;
    top: 11px;
    line-height: 14px;

    &::before {
      top: -5px;
      right: 3px;
      content: "";
      display: inline-block;
      position: absolute;
      width: 0.5px;
      height: 4px;
      background: rgba(255, 255, 255, 0.3);
    }
  }
`;
