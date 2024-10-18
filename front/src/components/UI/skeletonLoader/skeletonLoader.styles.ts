import styled from "@emotion/styled";

export const SkeletonLoaderLoader = styled.div`
  width: 100%;
  height: 100%;
  display: block;
  background: linear-gradient(
      to right,
      rgb(255 255 255 / 0%),
      rgb(255 255 255 / 15%) 50%,
      rgb(255 255 255 / 0%) 80%
    ),
    var(--card-loader-background-color);
  background-repeat: repeat-y;
  background-size: 50px 200px;
  background-position: 0 0;
  animation: shine 1.5s infinite alternate;

  @keyframes shine {
    to {
      background-position: 130% 0;
    }
  }
`;
