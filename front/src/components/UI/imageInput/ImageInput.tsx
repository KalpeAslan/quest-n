import { Dispatch, FC, MouseEvent, SetStateAction } from "react";
import { Wrapper } from "./imageInput.styles";
import { Box } from "@mui/material";
import { Tooltip } from "../tooltip";
import Image from "next/image";
import { Icon } from "../icon";
import { useDropzone } from "react-dropzone";
import { appConfig } from "@/app.config";

interface Props {
  className?: string;
  label: string;
  dropzoneText: string;
  helperText: string;
  logoTooltip: string;
  setAcceptedFile: Dispatch<SetStateAction<File | null>>;
  acceptedFile: File | string | null;
  removeLogo: (e?: MouseEvent<HTMLDivElement>) => void;
  isLogoHovered: boolean;
  setIsLogoHovered: Dispatch<SetStateAction<boolean>>;
}

const ImageInput: FC<Props> = ({
  className,
  label,
  dropzoneText,
  helperText,
  logoTooltip,
  setAcceptedFile,
  acceptedFile,
  removeLogo,
  isLogoHovered,
  setIsLogoHovered,
}) => {
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    onDrop: acceptedFiles => setAcceptedFile(acceptedFiles[0] || null),
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "image/gif": [".gif"],
    },
  });

  return (
    <Wrapper className={className}>
      <Box display="flex" alignItems="center" mb="10px">
        <Box
          component="h3"
          mr="5px"
          className="c-font-color c-fw-500 c-font-16-22"
        >
          {label}
        </Box>

        <Tooltip value={logoTooltip} placement="top" followCursor>
          <Box className="tooltip c-font-10-20 c-fw-400">?</Box>
        </Tooltip>
      </Box>

      <Box
        {...getRootProps({ className: "dropzone" })}
        onMouseEnter={() => {
          if (!acceptedFile) return;
          setIsLogoHovered(true);
        }}
        onMouseLeave={() => setIsLogoHovered(false)}
      >
        {acceptedFile ? (
          <Image
            src={
              typeof acceptedFile === "string"
                ? `${appConfig.NEXT_PUBLIC_S3_BUCKET}/${acceptedFile}`
                : URL.createObjectURL(acceptedFile)
            }
            height={235}
            width={235}
            alt="Collection logo"
            className="logo"
          />
        ) : null}

        {isLogoHovered && Boolean(acceptedFile) ? (
          <Box className="hoverBackdrop" onClick={removeLogo}>
            <Box className="deleteWrapper">
              <Icon name="delete" size="30" />
            </Box>
          </Box>
        ) : null}

        <input {...getInputProps()} />
        <Box display="flex" className="c-font-color-3 c-fw-500 c-font-16-22">
          <Icon name="upload" className="uploadIcon" size="20" />
          {dropzoneText}
        </Box>
      </Box>

      <Box component="p" className="logoHelper c-fw-400 c-font-14-20">
        {helperText}
      </Box>
    </Wrapper>
  );
};

export default ImageInput;
