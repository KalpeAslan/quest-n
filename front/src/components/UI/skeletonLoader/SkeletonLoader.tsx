import { SkeletonLoaderLoader } from "@/components/UI/skeletonLoader/skeletonLoader.styles";

type Props = {
  width: string;
  height?: string;
  borderRadius?: number;
  classes?: string;
  id?: string;
};

const SkeletonLoader = ({
  width,
  height,
  borderRadius,
  classes,
  id,
}: Props) => {
  return (
    <SkeletonLoaderLoader
      className={classes}
      style={{
        width: width,
        height: height,
        borderRadius: `${borderRadius}px`,
      }}
      id={id}
    />
  );
};

SkeletonLoader.defaultProps = {
  height: "16px",
  borderRadius: 2,
} as Partial<Props>;

export default SkeletonLoader;
