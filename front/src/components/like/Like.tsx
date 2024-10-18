import { useCallback, useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import classnames from "classnames";
import { LikeStylesIcon, LikeStylesWrapper } from "./like.styles";
import { LocalStorageService } from "@services";

type Props = {
  id: string | number;
  likes: number | string;
};

const Like = ({ id, likes }: Props) => {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const handleClick = async () => {
    setIsLoaded(false);
    const likedIds = await LocalStorageService.getItemAsync("likedIds");

    if (!likedIds) {
      LocalStorageService.setItem("likedIds", `,${id},`);
      setIsLiked(true);
      setIsLoaded(true);

      return;
    }

    const isLiked = likedIds.includes(`,${id},`);

    if (isLiked) {
      const updatesString = likedIds.replace(`,${id},`, "");
      LocalStorageService.setItem("likedIds", updatesString);
      setIsLiked(false);
      setIsLoaded(true);

      return;
    }

    const updatesString = `${likedIds},${id},`;
    LocalStorageService.setItem("likedIds", updatesString);
    setIsLiked(true);
    setIsLoaded(true);
  };

  const init = useCallback(async () => {
    const likedIds = await LocalStorageService.getItemAsync("likedIds");

    if (!likedIds) {
      setIsLiked(false);
      setIsLoaded(true);

      return;
    }

    const isLiked = likedIds.includes(`,${id},`);

    if (isLiked) {
      setIsLiked(true);
      setIsLoaded(true);

      return;
    }

    setIsLiked(false);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <LikeStylesWrapper className={"c-font-color"}>
      {!isLoaded && <CircularProgress color="inherit" size={16} />}

      {isLoaded && (
        <LikeStylesIcon
          className={classnames({ active: isLiked })}
          name="like"
          height="16"
          width="16"
          onClick={handleClick}
        />
      )}

      <Box component="p" ml={0.5} className="c-font-14-20">
        {likes}
      </Box>
    </LikeStylesWrapper>
  );
};

export default Like;
