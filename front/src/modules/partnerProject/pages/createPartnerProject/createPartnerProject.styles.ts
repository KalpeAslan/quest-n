import { appConfig } from "@/app.config";
import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)`
  display: flex;
  align-items: start;
  justify-content: left;

  .create-partner-project__sidebar {
    width: 260px;
    height: 100%;
    border-right: 1px solid #2c3232;
    position: relative;

    &::after {
      content: "";
      display: inline-block;
      background: url("/images/project/sidebar__gradient.png") center no-repeat;
      width: 100%;
      height: 270px;
      bottom: 0;
      left: 0;
      right: 0;
      position: absolute;
    }
  }

  .create-partner-project__content {
    padding-top: 40px !important;
    padding-bottom: 40px !important;

    .header {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
    }

    .backButton {
      width: 38px;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      margin-right: 8px;
    }

    .backIcon {
      transform: rotate(180deg);
    }

    .projectLink {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      padding: 4px 8px 10px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .linkText {
      text-overflow: ellipsis;
      max-width: calc(100% - 30px);
      overflow: hidden;
    }

    .inputWrapper {
      margin-bottom: 20px;
      max-width: 298px;

      &.soc {
        display: flex;
        align-items: center;

        .input {
          margin-left: 10px;
        }
      }
    }

    .linkTitleError {
      display: block !important;
      position: absolute;
      bottom: 0;
      transform: translateY(calc(100% + 4px));
    }

    .error {
      display: none;
    }
  }
`;

export const LogoContainer = styled(Box)<{
  image?: string;
  tempImage?: File;
  defaultImage: string;
}>`
  border-radius: 60px 10px 10px 60px;
  padding: 10px;
  background: ${props =>
    (props.image && props.image !== props.defaultImage) || props.tempImage
      ? `linear-gradient(
        0deg,
        rgba(34, 34, 34, 0.8) 0%,
        rgba(34, 34, 34, 0.8) 100%
      ),
      url(${
        props.tempImage
          ? URL.createObjectURL(props.tempImage)
          : `${appConfig.NEXT_PUBLIC_S3_BUCKET}/${props.image}`
      }), lightgray 50% / cover no-repeat`
      : "rgba(255, 255, 255, 0.07)"};
  background-position: center;
  background-size: 100% auto;
  display: flex;
  align-items: center;
  width: 403px;
  max-width: 100%;

  .logoUploadButton {
    border-radius: 8px;
    background: rgba(250, 250, 250, 0.1);
    padding: 8px 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .uploadInput {
    display: none;
  }

  .imageContainer {
    margin-right: 16px;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background: ${props =>
      (props.image && props.image !== props.defaultImage) || props.tempImage
        ? `url(${
            props.tempImage
              ? URL.createObjectURL(props.tempImage)
              : `${appConfig.NEXT_PUBLIC_S3_BUCKET}/${props.image}`
          }), lightgray 50% / cover no-repeat`
        : `linear-gradient(0deg, rgba(0, 0, 0, 0.30) 0%, rgba(0, 0, 0, 0.30) 100%), url(${appConfig.NEXT_PUBLIC_S3_BUCKET}/${props.defaultImage}), lightgray 50% / cover no-repeat`};
    background-position: center;
    background-size: contain;
  }

  .deleteButton {
    border-radius: 8px;
    background: rgba(252, 91, 63, 0.1);
    display: flex;
    margin-left: 10px;
    padding: 8px 12px;
    justify-content: center;
    align-items: center;
    border: none;
    outline: none;
    cursor: pointer;
  }
`;
