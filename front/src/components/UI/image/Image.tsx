import { useEffect, useState } from "react";
import { Icon } from "@components/UI/icon";
import { SkeletonLoader } from "@components/UI/skeletonLoader";
import {
  ImageStylesLoaderWrapper,
  ImageStylesOpacity,
  ImageStylesWrapper,
} from "./image.styles";

type Props = {
  src: string;
  alt: string;
  size?: string;
  isBackground?: boolean;
  lazyLoading?: boolean;
  slider?: boolean;
  id?: string;
};

const Image = ({
  src,
  alt,
  size,
  isBackground,
  lazyLoading,
  slider,
  id,
}: Props) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [imgSrc, setImgSrc] = useState<string>(src);

  useEffect(() => {
    if (src === "") {
      setLoaded(false);
      setError(true);
    } else {
      setImgSrc(src);
      setError(false);
    }
  }, [src]);

  return (
    <ImageStylesWrapper
      style={{
        backgroundColor: isBackground
          ? "var(--image-background-color)"
          : undefined,
        position: "relative",
        minHeight: `${size}px`,
      }}
      id={id}
    >
      <ImageStylesOpacity
        {...(lazyLoading ? { loading: "lazy" } : {})}
        isOpacity={(!loaded && !slider) || error}
        className="lazyload"
        src={imgSrc}
        fill
        data-src={imgSrc}
        alt={alt}
        onError={() => setError(true)}
        onLoad={() => {
          setLoaded(true);
        }}
        id={id}
      />

      {!loaded && !slider && !error && (
        <ImageStylesLoaderWrapper id={id}>
          <SkeletonLoader width="100%" height="100%" />
        </ImageStylesLoaderWrapper>
      )}

      {error && !loaded && (
        <ImageStylesLoaderWrapper id={id}>
          <Icon name="image-error" size={size} id={id} />
        </ImageStylesLoaderWrapper>
      )}
    </ImageStylesWrapper>
  );
};

Image.defaultProps = {
  src: "",
  alt: "image",
  size: "55",
  isBackground: true,
} as Partial<Props>;

export default Image;
