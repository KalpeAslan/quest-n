import { ELoyaltyTasks } from "@/models";
import { useMemo } from "react";

interface Props {
  taskType: ELoyaltyTasks;
  additionalProgram?: any;
  taskCompletedTweetId?: any;
}

const useIsUnlimited = ({
  taskType,
  additionalProgram,
  taskCompletedTweetId,
}: Props) => {
  const isUnlimited = useMemo(
    () =>
      Boolean(
        [
          ELoyaltyTasks.MENTION_TWITTER,
          ELoyaltyTasks.RE_TWEET_QUOTE_TWITTER,
          ELoyaltyTasks.LIKE_TWEET_TWITTER,
          ELoyaltyTasks.COMMENT_TWEET_TWITTER,
        ].includes(taskType) &&
          (additionalProgram ||
            (taskCompletedTweetId &&
              taskCompletedTweetId !== "-1" &&
              taskCompletedTweetId !== -1)),
      ),
    [taskType, additionalProgram, taskCompletedTweetId],
  );

  return isUnlimited;
};

export default useIsUnlimited;
