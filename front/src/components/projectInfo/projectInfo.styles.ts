import styled from "@emotion/styled";

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  .image-wrapper {
    position: relative;
    cursor: pointer;
  }

  .image {
    border-radius: 50%;
    overflow: hidden;
  }

  .image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
  }

  .content {
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0;
  }

  .icon.primary {
    color: #87f696;
  }

  .icon.secondary {
    color: #fff;
  }

  .title {
    cursor: pointer;
  }

  .title,
  .sub-title {
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .title.primary {
    color: #87f696;
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;
    text-transform: uppercase;
  }

  .title.secondary {
    color: #fff;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
  }

  .sub-title.secondary {
    color: #fff;
    font-weight: 500;
    font-size: 20px;
    line-height: 24px;
  }
`;
