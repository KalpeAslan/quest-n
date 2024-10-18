import { ELoyaltyTasks } from "@models";
import { t } from "@lingui/macro";
import { object, string, number } from "yup";
import { AdditionalField, EProjectType } from "@modules/quest/models";
import {
  validateRegex,
  validateScanUrlAndGetNetworkKey,
  validateTGLink,
} from "../components/createQuestSteps/CreateTasksStep/components/TaskForm/taskForm.constants";
import { isAddress } from "viem";
import emojiRegex from "emoji-regex";
import { icons } from "@modules/quest/models/constants";

export const _defaultPointsForCompletion: { [key in ELoyaltyTasks]?: number } =
  {
    [ELoyaltyTasks.FOLLOW_TWITTER]: 3,
    [ELoyaltyTasks.MENTION_TWITTER]: 5,
    [ELoyaltyTasks.TWEET_TWITTER]: 3,
    [ELoyaltyTasks.RE_TWEET_QUOTE_TWITTER]: 5,
    [ELoyaltyTasks.LIKE_TWEET_TWITTER]: 5,
    [ELoyaltyTasks.COMMENT_TWEET_TWITTER]: 5,
    [ELoyaltyTasks.JOIN_DISCORD]: 3,
    [ELoyaltyTasks.ROLE_DISCORD]: 5,
    [ELoyaltyTasks.WATCH_VIDEO]: 5,
    [ELoyaltyTasks.JOIN_TELEGRAM]: 3,
    [ELoyaltyTasks.VISIT_LINK]: 2,
    [ELoyaltyTasks.SUGGESTION]: 5,
    [ELoyaltyTasks.EMAIL]: 3,
    [ELoyaltyTasks.QUIZ]: 5,
    [ELoyaltyTasks.IMAGE_UPLOAD]: 5,
    [ELoyaltyTasks.MEDIUM]: 2,
    [ELoyaltyTasks.NFT]: 10,
    [ELoyaltyTasks.TOKEN]: 10,
    [ELoyaltyTasks.DEX_LIQUIDITY_PROVIDER]: 10,
  };

export const standardOptions = [
  { title: "ERC721", value: "ERC721" },
  { title: "ERC1155", value: "ERC1155" },
];

const tweetLinkRegex = /https:\/\/(twitter\.com|x\.com)\/.+\/status\/[0-9]+/;

export const _defaultTitleAndDescription: {
  [key in ELoyaltyTasks]?: {
    title: string;
    description: string;
  };
} = {
  [ELoyaltyTasks.FOLLOW_TWITTER]: {
    title: t({
      id: "mGu8aEBpnrJahzLFygLxCo-quest",
      message: "Follow on Twitter",
    }),
    description: t({
      id: "7K4jTKNiDgPhHtCL6sBHNm-quest",
      message: "Follow our project on Twitter and get your points!",
    }),
  },
  [ELoyaltyTasks.MENTION_TWITTER]: {
    title: t({
      id: "pX1UnjQnjqK4LbvoNrbrzp-quest",
      message: "Mention on Twitter",
    }),
    description: t({
      id: "nT6ai182i11AKxs55T4jXR-quest",
      message:
        "Tell your friends about our project on Twitter get your points!",
    }),
  },
  [ELoyaltyTasks.TWEET_TWITTER]: {
    title: t({
      id: "vutGDxbWCKGw6AfmVAd9HK-quest",
      message: "Tweet on Twitter",
    }),
    description: t({
      id: "fA49Q6jBNk14shEu666XQf-quest",
      message: "Make a tweet on Twitter and get your points!",
    }),
  },
  [ELoyaltyTasks.RE_TWEET_TWITTER]: {
    title: t({
      id: "owf5JWsXdBYryjDVyyqmSq-quest",
      message: "Retweet a Tweet",
    }),
    description: t({
      id: "9a1NArV11X1st1HTbtkyjz-quest",
      message: "Retweet our tweet on Twitter and get your points!",
    }),
  },
  [ELoyaltyTasks.RE_TWEET_QUOTE_TWITTER]: {
    title: t({
      id: "6bX1TDBQS1BH1AW4ZNGHV3-quest",
      message: "Quote Retweet on Twitter",
    }),
    description: t({
      id: "4GtFkGqYtAGxmgX9wyVjSQ-quest",
      message: "Quote Retweet the tweet on Twitter and get your points!",
    }),
  },
  [ELoyaltyTasks.LIKE_TWEET_TWITTER]: {
    title: t({
      id: "x8Dcgwih8VmnswmKcqhWyc-quest",
      message: "Like Tweet on Twitter",
    }),
    description: t({
      id: "akCvR2F2dfXYkoAmuaF4VQ-quest",
      message: "Like the tweet on Twitter and get your points!",
    }),
  },
  [ELoyaltyTasks.COMMENT_TWEET_TWITTER]: {
    title: t({
      id: "9b9LAn9ZL3nE2ba1ZTWtiG-quest",
      message: "Comment a tweet",
    }),
    description: t({
      id: "3ZZgS77uBsaBECXGpS1LGL-quest",
      message: "Comment the tweet on Twitter and get your points!",
    }),
  },
  [ELoyaltyTasks.JOIN_DISCORD]: {
    title: t({
      id: "ustVzm49yJMHqEDFouULST-quest",
      message: "Join a Discord server",
    }),
    description: t({
      id: "murkk7jPJFvFP5KLJ9vXo7-quest",
      message: "Join our project on Discord and get your points!",
    }),
  },
  [ELoyaltyTasks.ROLE_DISCORD]: {
    title: t({
      id: "pFEhMYPFLeoXYB8oBct9yD-quest",
      message: "Verify role in Discord server",
    }),
    description: t({
      id: "bNYbcnfeMqC1AyzVqTkGnW-quest",
      message:
        "Show how Apey you are on our Discord! Engage in conversations, level up to the $roleName$ and get your points!",
    }),
  },
  [ELoyaltyTasks.WATCH_VIDEO]: {
    title: t({
      id: "27SrdWUfDXkJjYsUMWpRM1-quest",
      message: "Watch the video on YouTube",
    }),
    description: t({
      id: "ha8RDQwY6Vtu3rpbL5mE7J-quest",
      message: "Watch the video on YouTube and get your points!",
    }),
  },
  [ELoyaltyTasks.JOIN_TELEGRAM]: {
    title: t({
      id: "41oFf19aRtxZK4CeWdmps4-quest",
      message: "Join the Telegram group",
    }),
    description: t({
      id: "pwiBsDa7S7k1rmSHbm9kzy-quest",
      message: "Become a part of our Telegram community and get your points!",
    }),
  },
  [ELoyaltyTasks.VISIT_LINK]: {
    title: t({
      id: "bAfQQx1UFKxLx3FQ2wLkJu-quest",
      message: "Visit the website",
    }),
    description: t({
      id: "tzwsshFjU9txgojYRmH5fa-quest",
      message: "Visit the website and get your points!",
    }),
  },
  [ELoyaltyTasks.SUGGESTION]: {
    title: t({ id: "o6njkFA9YzqNNax99uwo61-quest", message: "Take a Survey" }),
    description: t({
      id: "5skMKKbk8vZR7kJPTQFL8h-quest",
      message: "Provide an open-ended question that users can respond to",
    }),
  },
  [ELoyaltyTasks.EMAIL]: {
    title: t({
      id: "34aptGSknNn77tGjzv1LTs-quest",
      message: "Leave your e-mail",
    }),
    description: t({
      id: "rFxsM6WBPTEtvqNecmWmVD-quest",
      message: "Leave your e-mail in this form and get your points!",
    }),
  },
  [ELoyaltyTasks.QUIZ]: {
    title: t({
      id: "kuUUPQ2YccsVL8LuippkS2-quest",
      message: "Pick the correct answer",
    }),
    description: t({ id: "iLKHx9TsrUEXYpLB3uxxwH-quest", message: " " }),
  },
  [ELoyaltyTasks.IMAGE_UPLOAD]: {
    title: t({
      id: "vjefBczXoSfV1fBVzvKnoh-quest",
      message: "Upload a screenshot",
    }),
    description: t({
      id: "1xhALd92MJ3ZZwpW4wvXQG-quest",
      message:
        "You can ask users to complete a specific task and verify its completion by providing a screenshot as proof",
    }),
  },
  [ELoyaltyTasks.MEDIUM]: {
    title: t({
      id: "2x6xrUF7ikXZVMWx8Vz9AV-quest",
      message: "Read a Medium article",
    }),
    description: t({
      id: "u52QGrgcMxfBjR6XNv9tHw-quest",
      message: "Read our Medium article and get your points!",
    }),
  },
  [ELoyaltyTasks.INVITE]: {
    title: t({
      id: "fxpP4pr1iazUmP1QLV79uC-quest",
      message: "Invite a friend",
    }),
    description: t({
      id: "qruuuJvT1kdzsGthcfdxgU-quest",
      message: "Invite a friend and get your points!",
    }),
  },
  [ELoyaltyTasks.NFT]: {
    title: t({
      id: "oMGV4G3E9mkT9yL23iSnUMWd-quest",
      message: "Hold an $tokenSymbol$ NFT",
    }),
    description: t({
      id: "1qhB2GJfZ7ZP2tfDuVKbGLF-quest",
      message:
        "Hold at least $minTokenAmount$ $tokenSymbol$ NFTs and get your points!",
    }),
  },
  [ELoyaltyTasks.TOKEN]: {
    title: t({
      id: "12sD2LYWRH4372MssB8sip-quest",
      message: "Hold a $tokenSymbol$ token",
    }),
    description: t({
      id: "3XzAgasd11MYbBsdD32fdXuzQKgCfvx5F-quest",
      message:
        "Hold more than $minTokenAmount$ $tokenSymbol$ tokens and get your points!",
    }),
  },
  [ELoyaltyTasks.VALUE_HOLDER]: {
    title: t({
      id: "wbuuhpsnmQYe2mYW675bAs-quest",
      message: "Hold more than $$minUSDValue$ in tokens",
    }),
    description: t({
      id: "wofgFddHetEfrXTAXXsxNj-quest",
      message:
        "Hold more than $$minUSDValue$ worth of different tokens in $chainId$ blockchain and get your points!",
    }),
  },
  [ELoyaltyTasks.NATIVE_HOLDER]: {
    title: t({
      id: "n726VRLE3pJPSFgth9K8sVQ-quest",
      message: "Hold native tokens",
    }),
    description: t({
      id: "w2aMQjRvvGe1zrrrAQjjzq-quest",
      message:
        "Hold more than $minValue$ $chainId$ on your wallet and get your points!",
    }),
  },
  [ELoyaltyTasks.DEX_LIQUIDITY_PROVIDER]: {
    title: "",
    description: "",
  },
  [ELoyaltyTasks.BLOCKCHAIN_USER]: {
    title: t({
      id: "tMsFm2wBeiYeVvDZsduHY2Bz-quest",
      message: "Blockchain transactions",
    }),
    description: t({
      id: "7xyz6dhWRH8cCLuuPakjjn-quest",
      message:
        "Make more than $minTransactions$ transactions in $chainId$ blockchain and get your points!",
    }),
  },
  [ELoyaltyTasks.GIT_COIN]: {
    title: t({
      message: "Gitcoin Passport score",
      id: "wejfh-123fdjsf-nsdvjsndv",
    }),
    description: "",
  },
};

export interface IOffChainTaskTypeItem {
  name: string;
  icon: string;
  notAllowedQuestTypes?: EProjectType[];
  tasks: {
    type: ELoyaltyTasks;
    title: string;
    description: string;
    defaultDescription: string;
    socialAlgorithm: boolean;
    additionalFields: AdditionalField[];
    mainFields: AdditionalField[];
    placeholder?: string;
    taskDescription?: { text: string; dynamic: boolean }[];
  }[];
}
export interface IOffChainTaskType {
  [key: string]: IOffChainTaskTypeItem;
}

export interface IOnChainTaskType {
  type: ELoyaltyTasks;
  title: string;
  description: string;
  socialAlgorithm: boolean;
  additionalFields: AdditionalField[];
  mainFields: AdditionalField[];
  placeholder?: string;
}

export const onChainAndOffTaskEnum = {
  [ELoyaltyTasks.QUIZ]: "offChain",
  [ELoyaltyTasks.VISIT_LINK]: "offChain",
  [ELoyaltyTasks.REFERRAL_LINK]: "offChain",
  [ELoyaltyTasks.SUGGESTION]: "offChain",
  [ELoyaltyTasks.FOLLOW_TWITTER]: "offChain",
  [ELoyaltyTasks.MENTION_TWITTER]: "offChain",
  [ELoyaltyTasks.TWEET_TWITTER]: "offChain",
  [ELoyaltyTasks.RE_TWEET_TWITTER]: "offChain",
  [ELoyaltyTasks.JOIN_DISCORD]: "offChain",
  [ELoyaltyTasks.ROLE_DISCORD]: "offChain",
  [ELoyaltyTasks.EMAIL]: "offChain",
  [ELoyaltyTasks.RE_TWEET_QUOTE_TWITTER]: "offChain",
  [ELoyaltyTasks.LIKE_TWEET_TWITTER]: "offChain",
  [ELoyaltyTasks.COMMENT_TWEET_TWITTER]: "offChain",
  [ELoyaltyTasks.PARTNER]: "offChain",
  [ELoyaltyTasks.MULTIPLE_SUGGESTION]: "offChain",
  [ELoyaltyTasks.MEDIUM]: "offChain",
  [ELoyaltyTasks.JOIN_TELEGRAM]: "offChain",
  [ELoyaltyTasks.CHECK_SPACE_TWITTER]: "offChain",
  [ELoyaltyTasks.SEQUENCE]: "offChain",
  [ELoyaltyTasks.WATCH_VIDEO]: "offChain",
  [ELoyaltyTasks.SIGN_UP]: "offChain",
  [ELoyaltyTasks.COMPLETED_ONBOARDING]: "offChain",
  [ELoyaltyTasks.TOKEN]: "onChain",
  [ELoyaltyTasks.NFT]: "onChain",
  [ELoyaltyTasks.BLOCKCHAIN_USER]: "onChain",
  [ELoyaltyTasks.VALUE_HOLDER]: "onChain",
  [ELoyaltyTasks.NATIVE_HOLDER]: "onChain",
  [ELoyaltyTasks.DAILY]: "offChain",
  [ELoyaltyTasks.CUSTOM_WEBHOOK]: "offChain",
  [ELoyaltyTasks.DEX_LIQUIDITY_PROVIDER]: "onChain",
  [ELoyaltyTasks.IMAGE_UPLOAD]: "offChain",
  [ELoyaltyTasks.INVITE]: "offChain",
  [ELoyaltyTasks.ALL_BRIDGE]: "onChain",
  [ELoyaltyTasks.GIT_COIN]: "onChain",
};

export const offChainTaskTypesSchema = {
  twitter: {
    name: t({ id: "aDdKLRqWDzKquHPE47GsDN-quest", message: "Twitter" }),
    icon: "twitter-task",
    tasks: [
      {
        type: ELoyaltyTasks.FOLLOW_TWITTER,
        title: t({
          id: "vv9FoP5TMkf37W78hDW1xp-quest",
          message: "Connect Twitter",
        }),
        description: t({
          id: "tm2VyUErPChggJpwHePTpS-quest",
          message: "Description",
        }),
        defaultDescription: t({
          id: "pXT2BPZTLNSi1AMdh6ZmJj-quest",
          message: "Default description 1",
        }),
        socialAlgorithm: false,
        additionalFields: [
          {
            title: t({
              id: "xvffgha9YXVppteDBEJ9oH-quest",
              message: "Title",
            }),
            type: "text",
            name: "title",
            schema: string().required(
              t({
                id: "sdf5T6VCiBp2jubmMtEXet-quest",
                message: "Is required",
              }),
            ),
          },
          {
            title: t({
              id: "ssdfDqbHUgyK1QqQkqiLdb4-quest",
              message: "Description",
            }),
            type: "text",
            name: "description",
            schema: string().required(
              t({
                id: "vfddvT6VCiBp2jubmMtEXet-quest",
                message: "Is required",
              }),
            ),
          },
        ],
        mainFields: [
          {
            type: "text",
            title: t({
              id: "dDz4T7Zcvd3jVAGrmHC8YT-quest",
              message: "Username",
            }),
            name: "username",
            schema: string().required(
              t({
                id: "fZLZkAMJD5ktaZj9qYv35R-quest",
                message: "Is required",
              }),
            ),
            isTwitterUsername: true,
          },
        ],
      },
      {
        type: ELoyaltyTasks.MENTION_TWITTER,
        title: t({
          id: "sHe1qibDx1arTwCZ7uWEkb-quest",
          message: "Mention in Twitter",
        }),
        description: t({
          id: "q4voi7AsGWip2UHo8TeUt6-quest",
          message: "Description",
        }),
        defaultDescription: t({
          id: "54GwQ1uxoXKQNYQUAnsQWi-quest",
          message: "Default description 2",
        }),
        placeholder: t({
          message:
            "Tell your friends about our project on Twitter get your points!",
          id: "pFEQSBPZTLNSi1AMdh6ZmJj-quest",
        }),
        socialAlgorithm: true,
        mainFields: [
          {
            type: "text",
            title: t({
              id: "nmc33tRqRroPQav5dWYcep-quest",
              message: "Username",
            }),
            name: "mentionUserName",
            schema: string().required(
              t({
                id: "qZw3GeTdfMLoUsMrLt2XbJ-quest",
                message: "Is required",
              }),
            ),
            isTwitterUsername: true,
          },
        ],
        additionalFields: [
          {
            title: t({
              id: "sdfvfgha9YXVppteDBEJ9oH-quest",
              message: "Title",
            }),
            type: "text",
            name: "title",
            schema: string().required(
              t({
                id: "sdf5T6VCiBp2jubmMtEXet-quest",
                message: "Is required",
              }),
            ),
          },
          {
            title: t({
              id: "ssdfDqbHUgyK1QqQkqiLdb4-quest",
              message: "Description",
            }),
            type: "text",
            name: "description",
            schema: string().required(
              t({
                id: "vfddvT6VCiBp2jubmMtEXet-quest",
                message: "Is required",
              }),
            ),
          },
        ],
      },
      {
        type: ELoyaltyTasks.TWEET_TWITTER,
        title: t({ id: "huia3j5kR122D2CVkvRWXC-quest", message: "Tweet" }),
        description: t({
          id: "gsKvZoZ4pjTxm3pkChd7yS-quest",
          message: "Description",
        }),
        defaultDescription: t({
          id: "62WsVV3JZ4iXNyfhxGCiXh-quest",
          message: "Default description 3",
        }),
        socialAlgorithm: false,
        placeholder: t({
          message: "Make a tweet on Twitter and get your points!",
          id: "dfgyPZTLNSi1AMdh6ZmJj-quest",
        }),
        mainFields: [
          {
            type: "multiline",
            title: t({
              id: "87kQJtcX6hnkWvtwEBSXf9-quest",
              message: "Tweet text",
            }),
            placeholder: t({
              id: "njbkpqwr78124lkfsg-quest",
              message:
                "Enter the tweet text for participants to share on Twitter",
            }),
            name: "tweetText",
            schema: string()
              .test(
                "emoji-validation",
                t({
                  id: "2Akbt7VbnPyeuxGagpizgP-quest",
                  message: "Maximum length 240 symbols",
                }),
                value => {
                  if (value) {
                    const textWithoutEmojis = value.replace(emojiRegex(), "");
                    return textWithoutEmojis.length <= 240;
                  }
                  return true;
                },
              )
              .required(
                t({
                  id: "m2v5q4XQEF3toHQ6WP3Mta-quest",
                  message: "Is required",
                }),
              ),
          },
        ],
        additionalFields: [
          {
            title: t({
              id: "xvffgha9YXVppteDBEJ9oH-quest",
              message: "Title",
            }),
            type: "text",
            name: "title",
            schema: string().required(
              t({
                id: "sdf5T6VCiBp2jubmMtEXet-quest",
                message: "Is required",
              }),
            ),
          },
          {
            title: t({
              id: "ssdfDqbHUgyK1QqQkqiLdb4-quest",
              message: "Description",
            }),
            type: "text",
            name: "description",
            schema: string().required(
              t({
                id: "vfddvT6VCiBp2jubmMtEXet-quest",
                message: "Is required",
              }),
            ),
          },
        ],
      },
      {
        type: ELoyaltyTasks.RE_TWEET_TWITTER,
        title: t({
          id: "7mFhTCDKRNrGBoRH8bJ4Lk-quest",
          message: "Retweet",
        }),
        description: t({
          id: "gGarDgFHwohLnyBx5vs8Vt-quest",
          message: "Description",
        }),
        defaultDescription: t({
          id: "mGxQZ7AT8LEMdDABC22MnH-quest",
          message: "Default description 4",
        }),
        placeholder: t({
          message: "Retweet our tweet on Twitter and get your points!",
          id: "dfysvPZTLNSi1AMdh6ZmJj-quest",
        }),
        socialAlgorithm: false,
        mainFields: [
          {
            type: "text",
            title: t({
              id: "gZRC139AERoRWjb8qQQSti-quest",
              message: "Link to the tweet",
            }),
            name: "tweetLink",
            placeholder: "https://twitter.com/username/status/1234567",
            schema: string()
              .trim()
              .matches(
                tweetLinkRegex,
                t({
                  id: "1KQMBJwsWeeCZqoDALjJRh-quest",
                  message: "Not valid tweet link",
                }),
              )
              .required(
                t({
                  id: "shYSpCSgf9ZBw4wQVkVFWw-quest",
                  message: "Is required",
                }),
              ),
          },
        ],
        additionalFields: [
          {
            title: t({
              id: "xvffgha9YXVppteDBEJ9oH-quest",
              message: "Title",
            }),
            type: "text",
            name: "title",
            schema: string().required(
              t({
                id: "sdf5T6VCiBp2jubmMtEXet-quest",
                message: "Is required",
              }),
            ),
          },
          {
            title: t({
              id: "ssdfDqbHUgyK1QqQkqiLdb4-quest",
              message: "Description",
            }),
            type: "text",
            name: "description",
            schema: string().required(
              t({
                id: "vfddvT6VCiBp2jubmMtEXet-quest",
                message: "Is required",
              }),
            ),
          },
        ],
      },
      {
        type: ELoyaltyTasks.RE_TWEET_QUOTE_TWITTER,
        title: t({
          id: "41XQRgSrny8Q9Q2UfHxT3Z-quest",
          message: "Quote Retweet",
        }),
        description: t({
          id: "5pASmuHwwW4msB6DJFswHL-quest",
          message: "Description",
        }),
        defaultDescription: t({
          id: "emM9oocKMp4HdCB65n5xEs-quest",
          message: "Default description 5",
        }),
        placeholder: t({
          message: "Quote Retweet the tweet on Twitter and get your points!",
          id: "qwsPZTLNSi1AMdh6ZDFC-quest",
        }),
        socialAlgorithm: true,
        mainFields: [
          {
            type: "text",
            title: t({
              id: "oLToRCASVT4CzD89Mq7gCy-quest",
              message: "Link to the tweet",
            }),
            name: "tweetLink",
            placeholder: "https://twitter.com/username/status/1234567",
            schema: string()
              .trim()
              .matches(
                tweetLinkRegex,
                t({
                  id: "vcE3EHpf1UHoXBxnbnDu63-quest",
                  message: "Not valid tweet link",
                }),
              )
              .required(
                t({
                  id: "1pBWySnpg8vUY5yKap7RUs-quest",
                  message: "Is required",
                }),
              ),
          },
        ],
        additionalFields: [
          {
            title: t({
              id: "xvffgha9YXVppteDBEJ9oH-quest",
              message: "Title",
            }),
            type: "text",
            name: "title",
            schema: string().required(
              t({
                id: "sdf5T6VCiBp2jubmMtEXet-quest",
                message: "Is required",
              }),
            ),
          },
          {
            title: t({
              id: "ssdfDqbHUgyK1QqQkqiLdb4-quest",
              message: "Description",
            }),
            type: "text",
            name: "description",
            schema: string().required(
              t({
                id: "vfddvT6VCiBp2jubmMtEXet-quest",
                message: "Is required",
              }),
            ),
          },
        ],
      },
      {
        type: ELoyaltyTasks.LIKE_TWEET_TWITTER,
        title: t({
          id: "213dRgSrny8Q9Q2UfHxT3Z-quest",
          message: "Like a tweet",
        }),
        description: t({
          id: "5pASmuHwwW4msB6DJFswHL-quest",
          message: "Description",
        }),
        defaultDescription: t({
          id: "emM9oocKMp4HdCB65n5xEs-quest",
          message: "Default description 5",
        }),
        placeholder: t({
          message: "Quote Retweet the tweet on Twitter and get your points!",
          id: "qwsPZTLNSi1AMdh6ZDFC-quest",
        }),
        socialAlgorithm: false,
        mainFields: [
          {
            type: "text",
            title: t({
              id: "jjZrxDEnT4MyptxrPgzPPd-quest",
              message: "Link to the tweet",
            }),
            name: "tweetLink",
            placeholder: "https://twitter.com/username/status/1234567",
            schema: string()
              .trim()
              .matches(
                tweetLinkRegex,
                t({
                  id: "qni778Z1NAtYorJPwtegLW-quest",
                  message: "Not valid tweet link",
                }),
              )
              .required(
                t({
                  id: "1pBWySnpg8vUY5yKap7RUs-quest",
                  message: "Is required",
                }),
              ),
          },
        ],
        additionalFields: [
          {
            title: t({
              id: "xvffgha9YXVppteDBEJ9oH-quest",
              message: "Title",
            }),
            type: "text",
            name: "title",
            schema: string().required(
              t({
                id: "sdf5T6VCiBp2jubmMtEXet-quest",
                message: "Is required",
              }),
            ),
          },
          {
            title: t({
              id: "ssdfDqbHUgyK1QqQkqiLdb4-quest",
              message: "Description",
            }),
            type: "text",
            name: "description",
            schema: string().required(
              t({
                id: "vfddvT6VCiBp2jubmMtEXet-quest",
                message: "Is required",
              }),
            ),
          },
        ],
      },
      {
        type: ELoyaltyTasks.COMMENT_TWEET_TWITTER,
        title: t({
          id: "8pGcTCDKRNrGBoRH8bJ4Lk-quest",
          message: "Comment a tweet",
        }),
        description: t({
          id: "gGarDgFHwohLnyBx5vs8Vt-quest",
          message: "Description",
        }),
        defaultDescription: t({
          id: "mGxQZ7AT8LEMdDABC22MnH-quest",
          message: "Default description 4",
        }),
        placeholder: t({
          message: "CComment the tweet on Twitter and get your points!",
          id: "iuierPZTLNSi1AMdh6ZmJj-quest",
        }),
        socialAlgorithm: false,
        mainFields: [
          {
            type: "text",
            title: t({
              id: "j8UGVorSvXfGS2q32mdgLe-quest",
              message: "Link to the tweet",
            }),
            name: "tweetLink",
            placeholder: "https://twitter.com/username/status/1234567",
            schema: string()
              .trim()
              .matches(
                tweetLinkRegex,
                t({
                  id: "5cYqBMsjxRstXXp3SXmeG9-quest",
                  message: "Not valid tweet link",
                }),
              )
              .required(
                t({
                  id: "shYSpCSgf9ZBw4wQVkVFWw-quest",
                  message: "Is required",
                }),
              ),
          },
        ],
        additionalFields: [
          {
            title: t({
              id: "xvffgha9YXVppteDBEJ9oH-quest",
              message: "Title",
            }),
            type: "text",
            name: "title",
            schema: string().required(
              t({
                id: "sdf5T6VCiBp2jubmMtEXet-quest",
                message: "Is required",
              }),
            ),
          },
          {
            title: t({
              id: "ssdfDqbHUgyK1QqQkqiLdb4-quest",
              message: "Description",
            }),
            type: "text",
            name: "description",
            schema: string().required(
              t({
                id: "vfddvT6VCiBp2jubmMtEXet-quest",
                message: "Is required",
              }),
            ),
          },
        ],
      },
    ],
  },
  discord: {
    name: t({ id: "rzZrq5vF4mgZq1KoxMxJsT-quest", message: "Discord" }),
    icon: "discord-task",
    tasks: [
      {
        type: ELoyaltyTasks.JOIN_DISCORD,
        title: t({
          id: "rFreAr1nW6Fte8yD3xBD5o-quest",
          message: "Join Discord",
        }),
        description: t({
          id: "qoNGZW3mteYDNiMz3j7cWo-quest",
          message: "Description",
        }),
        defaultDescription: t({
          id: "4omV3ZSZEuKdaSU4pCZXWE-quest",
          message: "Default description 6",
        }),
        placeholder: t({
          message: "Join our project on Discord and get your points!",
          id: "rtyPZTLNSi1AMdh6ZSCDV-quest",
        }),
        socialAlgorithm: false,
        mainFields: [
          {
            type: "text",
            title: t({
              id: "o4HkTugisakXYEuQsgW68ast-quest",
              message: "Invite Link",
            }),
            placeholder: "https://discord.gg/invite",
            name: "inviteLink",
            schema: string()
              .test(
                'is-discord-url',
                t({
                  id: "gywgyg7ARGHVDLFbFgjeEM-quest",
                  message: "Enter correct url!",
                }),
                (value, { createError, path }) => {
                  if (!value) return true; // Allow empty values
                  const discordUrlRegex = /^(https?:\/\/)?(www\.)?discord\.gg\/[a-zA-Z0-9]+$/;
                  const result =  discordUrlRegex.test(value);
                  if (result) return true;
                  createError({
                    path,
                    message: t({
                      message: "Only support public groups and channels.",
                      id: "sjdfhsj83258290sdf35-quest",
                    }),
                  });
                  return false;
                }
              )
              .required(
                t({
                  id: "mDxMQo7djnUjEyB2zinQac-quest",
                  message: "Is required",
                }),
              ),
          },
        ],
        additionalFields: [
          {
            title: t({
              id: "xvffgha9YXVppteDBEJ9oH-quest",
              message: "Title",
            }),
            type: "text",
            name: "title",
            schema: string().required(
              t({
                id: "sdf5T6VCiBp2jubmMtEXet-quest",
                message: "Is required",
              }),
            ),
          },
          {
            title: t({
              id: "ssdfDqbHUgyK1QqQkqiLdb4-quest",
              message: "Description",
            }),
            type: "text",
            name: "description",
            schema: string().required(
              t({
                id: "vfddvT6VCiBp2jubmMtEXet-quest",
                message: "Is required",
              }),
            ),
          },
        ],
      },
      {
        type: ELoyaltyTasks.ROLE_DISCORD,
        title: t({
          id: "nSUYrJqjXfsPXVrzkZ4TNj-quest",
          message: "Role Discord",
        }),
        description: t({
          id: "3xvRHfxVS7EbViCADHDyjy-quest",
          message: "Description",
        }),
        defaultDescription: t({
          id: "36AiiYxX7nRMsFKXvSw3bK-quest",
          message: "Default description 7",
        }),
        placeholder: t({
          message:
            "Show how Apey you are on our Discord! Engage in conversations, level up to the $roleName$ and get your points!",
          id: "ghjtPZTLNSi1AMsdh6ZSDFHG-quest",
        }),
        socialAlgorithm: false,
        mainFields: [
          {
            type: "text",
            title: t({
              id: "86pSLpgRJytgftTdt3dtRPx-quest",
              message: "Discord server URL",
            }),
            name: "inviteLink",
            schema: string()
              .test(
                'is-discord-url',
                t({
                  id: "gxywgyg7ARGHVDLFbFgjeEM-quest",
                  message: "Enter correct url!",
                }),
                (value, { createError, path }) => {
                  if (!value) return true; // Allow empty values
                  const discordUrlRegex = /^(https?:\/\/)?(www\.)?discord\.gg\/[a-zA-Z0-9]+$/;
                  const result =  discordUrlRegex.test(value);
                  if (result) return true;
                  createError({
                    path,
                    message: t({
                      message: "Only support public groups and channels.",
                      id: "sjdfhsj83258290sdf35-quest",
                    }),
                  });
                  return false;
                }
              )
              .required(
              t({
                id: "q8D6kueXg1UtKNgDdPXPu31-quest",
                message: "Is required",
              }),
            ),
            placeholder: "https://discord.gg/invite-link",
          },
          {
            type: "text",
            title: t({
              id: "p6zsmAiBtJJkzvapWypZaa-quest",
              message: "Role ID",
            }),
            name: "roleId",
            schema: string().required(
              t({
                id: "mePKcR2rt3tf3yDnXfKEUq-quest",
                message: "Is required",
              }),
            ),
          },
          {
            type: "text",
            title: t({
              id: "hzzY5UyMjcASwVbwPULm8f-quest",
              message: "Role name",
            }),
            name: "roleName",
            schema: string().required(
              t({
                id: "242NeRfnzNwJwJmd559cvA-quest",
                message: "Is required",
              }),
            ),
          },
        ],
        additionalFields: [
          {
            title: t({
              id: "xvffgha9YXVppteDBEJ9oH-quest",
              message: "Title",
            }),
            type: "text",
            name: "title",
            schema: string().required(
              t({
                id: "sdf5T6VCiBp2jubmMtEXet-quest",
                message: "Is required",
              }),
            ),
          },
          {
            title: t({
              id: "ssdfDqbHUgyK1QqQkqiLdb4-quest",
              message: "Description",
            }),
            type: "text",
            name: "description",
            schema: string().required(
              t({
                id: "vfddvT6VCiBp2jubmMtEXet-quest",
                message: "Is required",
              }),
            ),
          },
        ],
      },
    ],
  },
  youtube: {
    name: t({ id: "rgHeZZApQ7P9QfsmwGVJzM-quest", message: "Youtube" }),
    icon: "video-task",
    tasks: [
      {
        type: ELoyaltyTasks.WATCH_VIDEO,
        title: t({
          id: "sdjGshYeKKXLEU25fNUvQW-quest",
          message: "Watch video",
        }),
        description: t({
          id: "5cf4ifMa6BiWE6Y4oUEmyB-quest",
          message: "Description",
        }),
        defaultDescription: t({
          id: "pBhJ9qH8BNoa9gfiJJQAso-quest",
          message: "Default description 8",
        }),
        placeholder: t({
          message: "Watch the video on YouTube and get your points!",
          id: "sdfsdjhgsjgkWETE-quest",
        }),
        socialAlgorithm: false,
        mainFields: [
          {
            type: "text",
            title: t({
              id: "wg4cNDLd4fxQLTSUp2AcHYn-quest",
              message: "Link on Youtube",
            }),
            placeholder: "https://youtu.be/video-link",
            name: "videoId",
            schema: string()
              .matches(
                /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
                "Enter correct Youtube link!",
              )
              .required(
                t({
                  id: "4vhtxk6pFVwVsR1S5uBddH-quest",
                  message: "Is required",
                }),
              ),
          },
        ],
        additionalFields: [
          {
            title: t({
              id: "xvffgha9YXVppteDBEJ9oH-quest",
              message: "Title",
            }),
            type: "text",
            name: "title",
            schema: string().required(
              t({
                id: "sdf5T6VCiBp2jubmMtEXet-quest",
                message: "Is required",
              }),
            ),
          },
          {
            title: t({
              id: "ssdfDqbHUgyK1QqQkqiLdb4-quest",
              message: "Description",
            }),
            type: "text",
            name: "description",
            schema: string().required(
              t({
                id: "vfddvT6VCiBp2jubmMtEXet-quest",
                message: "Is required",
              }),
            ),
          },
        ],
      },
    ],
  },
  telegram: {
    name: t({ id: "iTEXZ1NhZfeTwJ3yynFks9-quest", message: "Telegram" }),
    icon: "telegram-task",
    tasks: [
      {
        type: ELoyaltyTasks.JOIN_TELEGRAM,
        title: t({
          id: "bwWj8Uw9MsSpHQqYLHyTLg-quest",
          message: "Join Telegram",
        }),
        description: t({
          id: "t4EfZxtibLh1XPSAXjBvYh-quest",
          message: "Description",
        }),
        defaultDescription: t({
          id: "bb9WeEADcXLFM2217LNfJZ-quest",
          message: "Default description 9",
        }),
        placeholder: t({
          message:
            "Become a part of our Telegram community and get your points!",
          id: "qgjghirsjgkWETE-quest",
        }),
        socialAlgorithm: false,
        mainFields: [
          {
            type: "text",
            title: t({
              id: "ukSDpMGQUBjmqJtQbnduao-quest",
              message: "Chat ID",
            }),
            name: "chatId",
            schema: string().required(
              t({
                id: "bqBFkHZsfTzxhPNMr5N8up-quest",
                message: "Is required",
              }),
            ),
            hidden: true,
          },
          {
            type: "text",
            title: t({
              id: "bQKKqUdssdfDgxMyBxZX7xLzahR-quest",
              message: "Link to the Telegram chat/channel",
            }),
            placeholder: "https://t.me/chat-or-channel-public-url",
            name: "inviteLink",
            schema: string()
              .url(
                t({
                  id: "p1hqYHqTRfNuuT7yKpnXNR-quest",
                  message: "Enter correct url!",
                }),
              )
              .required(
                t({
                  id: "8gYgdeTs8KfMEH5ZtREFyQ-quest",
                  message: "Is required",
                }),
              )
              .test("is-valid-tg-link", (value, { createError, path }) => {
                if (!validateTGLink(value)) {
                  createError({
                    path,
                    message: t({
                      message: "Only support public groups and channels.",
                      id: "sjdfhsj83258290sdf35-quest",
                    }),
                  });
                  return false;
                }
                return true;
              }),
          },
        ],
        additionalFields: [
          {
            title: t({
              id: "xvffgha9YXVppteDBEJ9oH-quest",
              message: "Title",
            }),
            type: "text",
            name: "title",
            schema: string().required(
              t({
                id: "sdf5T6VCiBp2jubmMtEXet-quest",
                message: "Is required",
              }),
            ),
          },
          {
            title: t({
              id: "ssdfDqbHUgyK1QqQkqiLdb4-quest",
              message: "Description",
            }),
            type: "text",
            name: "description",
            schema: string().required(
              t({
                id: "vfddvT6VCiBp2jubmMtEXet-quest",
                message: "Is required",
              }),
            ),
          },
        ],
      },
    ],
  },
  link: {
    name: t({ id: "ag1VB215TFL3hG4kiByxZk-quest", message: "Visit link" }),
    icon: "link-task",
    tasks: [
      {
        type: ELoyaltyTasks.VISIT_LINK,
        title: t({
          id: "uNEY6BWWTYQbhddcLdasddfs4roYu-quest",
          message: "Visit the website",
        }),
        description: t({
          id: "mafCwiXUU4Mxkmx1YSrDfN-quest",
          message: "Description",
        }),
        defaultDescription: t({
          id: "pSvq6cXmUMcakLmY8b8CqV-quest",
          message: "Default description 10",
        }),
        placeholder: t({
          message: "Visit the website and get your points!",
          id: "dgdghdkfgdhfgjkQWRER-quest",
        }),
        socialAlgorithm: false,
        mainFields: [
          {
            type: "text",
            title: t({
              id: "gyerfstvv-quest",
              message: "Website URL",
            }),
            placeholder: t({
              id: "nbdhshsk-quest",
              message: "https://website.com/query",
            }),
            name: "link",
            schema: string()
              .url(
                t({
                  id: "7znqh799dQPdVuDfsHCTbh-quest",
                  message: "Enter correct url!",
                }),
              )
              .required(
                t({
                  id: "wbXddERbTE9aD8WfRHHWDP-quest",
                  message: "Is required",
                }),
              ),
          },
        ],
        additionalFields: [
          {
            title: t({
              id: "xvffgha9YXVppteDBEJ9oH-quest",
              message: "Title",
            }),
            type: "text",
            name: "title",
            schema: string().required(
              t({
                id: "sdf5T6VCiBp2jubmMtEXet-quest",
                message: "Is required",
              }),
            ),
          },
          {
            title: t({
              id: "ssdfDqbHUgyK1QqQkqiLdb4-quest",
              message: "Description",
            }),
            type: "text",
            name: "description",
            schema: string().required(
              t({
                id: "vfddvT6VCiBp2jubmMtEXet-quest",
                message: "Is required",
              }),
            ),
          },
        ],
      },
    ],
  },
  suggestion: {
    name: t({ id: "kuSGMe3swN1J6nFKippNts-quest", message: "Suggest." }),
    icon: "suggestion-task",
    tasks: [
      {
        type: ELoyaltyTasks.SUGGESTION,
        title: t({
          id: "xm1Qz3TG57BKT9AtxfsbCm-quest",
          message: "Suggestion",
        }),
        description: t({
          id: "8WgHnYQyk4cUc3aQ3WoCXD-quest",
          message: "Description",
        }),
        defaultDescription: t({
          id: "wqNSBYmCc9E6ccegZRAkRu-quest",
          message: "Default description 11",
        }),
        socialAlgorithm: false,
        mainFields: [
          {
            title: t({
              id: "sdfsbfgha9YXVppteDBEJ9oH-quest",
              message: "Title",
            }),
            type: "text",
            name: "title",
            schema: string().required(
              t({
                id: "sdf5T6VCiBp2jubmMtEXet-quest",
                message: "Is required",
              }),
            ),
          },
          {
            title: t({
              id: "ssdfDqbHUgyK1QqQkqiLdb4-quest",
              message: "Description",
            }),
            type: "wyziwyg",
            name: "description",
            schema: string().required(
              t({
                id: "vfddvasdT6VCiBp2jubmMtEXet-quest",
                message: "Description is required",
              }),
            ),
            placeholder: t({
              id: "asgSBYmCc9E6ccegZRAkKz-quest",
              message:
                "Provide an open-ended question that users can respond to",
            }),
          },
        ],
        additionalFields: [
          {
            title: t({
              id: "32fgha9YXVppteDBEJ9oH-quest",
              message: "Regex Rule",
            }),
            type: "text",
            name: "regex",
            schema: string().test(
              "is-valid-regex",
              (value, { createError, path }) => {
                if (value && !validateRegex(value)) {
                  createError({
                    path,
                    message: t({
                      id: "sjkdhg834th-sgkjb-32bv",
                      message: "Invalid regex",
                    }),
                  });
                  return false;
                }
                return true;
              },
            ),
          },
        ],
      },
      {
        type: ELoyaltyTasks.EMAIL,
        title: t({ id: "mDAriha9YXVppteDBEJ9oH-quest", message: "Email" }),
        description: t({
          id: "9eQDqbHUgyK1QqQkqiLdb4-quest",
          message: "Description",
        }),
        defaultDescription: t({
          id: "sXpiNBCPD5jpWRRAYpPCCr-quest",
          message: "Default description 12",
        }),
        placeholder: t({
          id: "vSjshNBCPD5jpWRRAYpPCCr-quest",
          message: "Leave your e-mail in this form and get your points!",
        }),
        socialAlgorithm: false,
        mainFields: [],
        additionalFields: [
          {
            title: t({
              id: "sdbfnfgha9YXVppteDBEJ9oH-quest",
              message: "Title",
            }),
            type: "text",
            name: "title",
            schema: string().required(
              t({
                id: "sdf5T6VCiBp2jubmMtEXet-quest",
                message: "Is required",
              }),
            ),
          },
          {
            title: t({
              id: "ssdfDqbHUgyK1QqQkqiLdb4-quest",
              message: "Description",
            }),
            type: "text",
            name: "description",
            schema: string().required(
              t({
                id: "vfddvT6VCiBp2jubmMtEXet-quest",
                message: "Is required",
              }),
            ),
          },
          {
            title: t({
              id: "32fgha9YXVppteDBEJ9oH-quest",
              message: "Regex Rule",
            }),
            type: "text",
            name: "regex",
            schema: string().test(
              "is-valid-regex",
              (value, { createError, path }) => {
                if (value && !validateRegex(value)) {
                  createError({
                    path,
                    message: t({
                      id: "sjkdhg834th-sgkjb-32bv",
                      message: "Invalid regex",
                    }),
                  });
                  return false;
                }
                return true;
              },
            ),
          },
        ],
      },
    ],
  },
  quiz: {
    name: t({ id: "hwm3RhDULAAPwmTBund5zX-quest", message: "Quiz" }),
    icon: "answer-task",
    tasks: [
      {
        type: ELoyaltyTasks.QUIZ,
        title: t({
          id: "rb3vcWxk1VmS9C3xHLq5bZ-quest",
          message: "Fulfilled",
        }),
        description: t({
          id: "iRbji8FpdAjHkf7XEvxGFT-quest",
          message: "Description",
        }),
        defaultDescription: t({
          id: "5sPdNjThqwgJ9XLh6LgpAk-quest",
          message: "Default description 13",
        }),
        socialAlgorithm: false,
        mainFields: [
          {
            title: t({
              id: "xvffgha9YXVppteDBEJ9oH-quest",
              message: "Title",
            }),
            type: "text",
            name: "title",
            schema: string().required(
              t({
                id: "sdf5T6VCiBp2jubmMtEXet-quest",
                message: "Is required",
              }),
            ),
          },
          {
            title: t({
              id: "ssdfDqbHUgyK1QqQkqiLdb4-quest",
              message: "Description",
            }),
            type: "wyziwyg",
            name: "description",
            placeholder: t({
              id: "38bvCvUvew45XDR2CAqYa4p-quest",
              message:
                "Question with a specific answer, e.g.:\nHow many countries there are in the world?\n1. 100\n2. 200\n3. 195 \nNote: participants may answer in different ways, e.g.: “3”, “3.”, “195”, etc.",
            }),
            schema: string().required(
              t({
                id: "vfddvT6VCiBp2jubmMtEXet-quest",
                message: "Is required",
              }),
            ),
          },
          {
            type: "text",
            title: t({
              id: "pgwTvrcVMmKC9Dz6sVQPXW-quest",
              message: "Answer",
            }),
            name: "answers",
            schema: string().required(
              t({
                id: "bWHVT6VCiBp2jubmMtEXet-quest",
                message: "Is required",
              }),
            ),
            hidden: true,
          },
          {
            type: "number",
            title: t({
              id: "cb79ce64-14ab-11ee-be56-0242ac120002-quest",
              message: "Attempts",
            }),
            name: "maxAnswers",
            schema: string().required(
              t({
                id: "cb79d148-quest",
                message: "Is required",
              }),
            ),
            hidden: true,
          },
        ],
        additionalFields: [],
      },
    ],
  },
  medium: {
    name: t({ id: "mfGN7QLixEt7hAbwFDKYEZ-quest", message: "Medium" }),
    icon: "medium-task",
    tasks: [
      {
        type: ELoyaltyTasks.MEDIUM,
        title: t({
          id: "wsUzQTnFB9wiGfeUzLkCwp-quest",
          message: "https://author.medium.com/link-to-the-article",
        }),
        description: t({
          id: "3QLxbQhTLRauGLVG3TnNyz-quest",
          message: "Description",
        }),
        defaultDescription: t({
          id: "s8HLvmSLz6M8kEryArk15P-quest",
          message: "Default description 14",
        }),
        socialAlgorithm: false,
        placeholder: t({
          message: "Read our Medium article and get your points!",
          id: "fjhgutrytRITO-quest",
        }),
        mainFields: [
          {
            type: "text",
            title: t({
              id: "asfyvbvzy-quest",
              message: "Link to the Medium article",
            }),
            placeholder: t({
              id: "nbvmcnbhy-quest",
              message: "https://author.medium.com/link-to-the-article",
            }),
            name: "link",
            schema: string()
              .url(
                t({
                  id: "oakJQBF6n4htJuy5Y7CYJT-quest",
                  message: "Enter correct url!",
                }),
              )
              .required(
                t({
                  id: "hfhME2Ui64fW6fTEZPuuwJ-quest",
                  message: "Is required",
                }),
              ),
          },
        ],
        additionalFields: [
          {
            title: t({
              id: "xvffgha9YXVppteDBEJ9oH-quest",
              message: "Title",
            }),
            type: "text",
            name: "title",
            schema: string().required(
              t({
                id: "sdf5T6VCiBp2jubmMtEXet-quest",
                message: "Is required",
              }),
            ),
          },
          {
            title: t({
              id: "ssdfDqbHUgyK1QqQkqiLdb4-quest",
              message: "Description",
            }),
            type: "text",
            name: "description",
            schema: string().required(
              t({
                id: "vfddvT6VCiBp2jubmMtEXet-quest",
                message: "Is required",
              }),
            ),
          },
        ],
      },
    ],
  },
  imageUpload: {
    name: t({
      message: "Image",
      id: "xceeeea8-10e9-11ee-be56-sdf0242ac120002-quest",
    }),
    icon: "imageUpload",
    tasks: [
      {
        type: ELoyaltyTasks.IMAGE_UPLOAD,
        title: t({
          id: "jg51XBqWrncn7Simoasdc8EdM-quest",
          message: "Upload a Screenshot",
        }),
        description: t({
          id: "6ceef146-10e9-11ee-be56-0242ac120002",
          message: "Description",
        }),
        defaultDescription: t({
          id: "6ceef146-10e9-11ee-be56-0242ac120033",
          message: "Default description 21",
        }),
        socialAlgorithm: false,
        placeholder: t({
          message: `You can ask users to complete a specific task and verify its completion \n by providing a screenshot as proof`,
          id: "sdfsdfy20004WER-quest",
        }),
        mainFields: [
          {
            title: t({
              id: "xvffgha9YXVppteDBEJ9oH-quest",
              message: "Title",
            }),
            type: "text",
            name: "title",
            placeholder: t({
              message:
                "You can ask users to complete a specific task and verify its completion by providing a screenshot as proof",
              id: "sjhvsdbvyasdq-quest",
            }),
            schema: string().required(
              t({
                id: "sdf5T6VCiBp2jubmMtEXet-quest",
                message: "Is required",
              }),
            ),
          },
          {
            title: t({
              id: "ssdfDqbHUgyK1QqQkqiLdb4-quest",
              message: "Description",
            }),
            placeholder: t({
              message:
                "You can ask users to complete a specific task and verify its completion \n by providing a screenshot as proof",
              id: "nvhakh73294dfgiqg-quest",
            }),
            type: "wyziwyg",
            name: "description",
            schema: string().required(
              t({
                id: "vfddvT6VCiBp2jubmMtEXet-quest",
                message: "Is required",
              }),
            ),
          },
        ],
        additionalFields: [],
      },
    ],
  },
  invite: {
    name: t({
      id: "18a40458-19a1-11ee-be56-0242ac120002-quest",
      message: "Refer a friend",
    }),
    icon: "referral-task",
    notAllowedQuestTypes: [EProjectType.LuckyDraw],
    tasks: [
      {
        type: ELoyaltyTasks.INVITE,
        title: t({
          id: "18a40692-19a1-11ee-be56-0242ac120002-quest",
          message: "Refer a friend",
        }),
        description: t({
          id: "18a40782-19a113-11ee-be56-0242ac120002-quest",
          message: "Invite a friend and get your points!",
        }),
        defaultDescription: t({
          id: "118a40ade-19a1-11ee-be56-0242ac120002-quest",
          message: "Default description 10",
        }),
        socialAlgorithm: false,
        taskDescription: [
          {
            text: t({
              id: "1f8a40b7e-19a1-11ee-be56-0242ac120002-quest",
              message:
                "Users receive $scorePercentage$% (configurable) of the points earned by their referrals (new users only).",
            }),
            dynamic: true,
          },
          {
            text: t({
              id: "2f8a40b7e-19a1-11ee-be56-0242ac120002-quest",
              message: "The maximum number of invited users is 100.",
            }),
            dynamic: false,
          },
          {
            text: t({
              id: "3f8a40b7e-19a1-11ee-be56-0242ac120002-quest",
              message:
                "Points earned by referrals who have completed fewer than 10 tasks in other quests \n are removed after the quest is completed and affect the final list of winners.",
            }),
            dynamic: false,
          },
          {
            text: t({
              id: "4f8a40b7e-19a1-11ee-be56-0242ac120002-quest",
              message: "Not suitable for Lucky Draw quests",
            }),
            dynamic: false,
          },
        ],
        additionalFields: [],
        mainFields: [
          {
            title: t({
              id: "xvffgha9YXVppteDBEJ9oH-quest",
              message: "Title",
            }),
            type: "text",
            name: "title",
            schema: string().required(
              t({
                id: "sdf5T6VCiBp2jubmMtEXet-quest",
                message: "Is required",
              }),
            ),
          },
          {
            title: t({
              id: "ssdfDsqbHUgyK1Qq2QkqiLdb4-quest",
              message: "Description",
            }),
            type: "wyziwyg",
            name: "description",
            schema: string().required(
              t({
                id: "vfddvT6VCiBp2jubmMtEXet-quest",
                message: "Is required",
              }),
            ),
          },
        ],
      },
    ],
  },
} as IOffChainTaskType;

export const getOnchainTasks = (
  chainIdSelectorOptions: {
    title: string;
    value: string;
  }[],
  nftStandardSelectorOptions: {
    title: string;
    value: string;
  }[],
): IOffChainTaskType =>
  ({
    token: {
      name: t({ id: "mTpKPaS1fWsnDtW8hHn1yL-quest", message: "Token" }),
      icon: icons[ELoyaltyTasks.TOKEN],
      tasks: [
        {
          type: ELoyaltyTasks.TOKEN,
          title: t({ id: "mTpKPaS1fWsnDtW8hHn1yL-quest", message: "Token" }),
          description: t({
            id: "2dLgHAuXtY6a7FTvYYCHG2-quest",
            message: "Description",
          }),
          defaultDescription: t({
            id: "r8XQR6HLPzgN2cvuH8oZS8-quest",
            message: "Default description 15",
          }),
          socialAlgorithm: false,
          mainFields: [
            {
              type: "text",
              title: t({
                message: "Link to the smart contract",
                id: "sdfsgt-0a83-11ee-be56-0242ac120002-quest",
              }),
              placeholder:
                "https://etherscan.io/address/0x0000000000000000000000000000000000000000",
              name: "linkAddress",
              schema: string()
                .url("Please provide a valid HTTPS URL")
                .test("is-valid-scan-link", (value, { createError, path }) => {
                  if (!value) {
                    createError({
                      path,
                      message: "Please provide a valid Contract URL",
                    });
                    return false;
                  }
                  return !!validateScanUrlAndGetNetworkKey(value);
                }),
              hidden: true,
            },
            {
              type: "selector",
              title: t({
                id: "9PknpDaUyGKMy7N39FoSojJ-quest",
                message: "Blockchain",
              }),
              name: "chainId",
              schema: string().required(
                t({
                  id: "5p6X5amyszo29CiPZtNhdP-quest",
                  message: "Is required",
                }),
              ),
              selectorOptions: chainIdSelectorOptions,
            },
            {
              type: "text",
              title: t({
                id: "dBvQq5oZKJVyHFsdgVQ295w-quest",
                message: "Smart Contract Address",
              }),
              name: "address",
              schema: string()
                .required(
                  t({
                    id: "wWGD8RRSUYMxLyhUjzmNTD-quest",
                    message: "Is required",
                  }),
                )
                .test("is-contract-address", (value, { createError, path }) => {
                  if (!value) {
                    createError({
                      path,
                      message: "Invalid contract address",
                    });
                    return false;
                  }
                  return isAddress(value);
                }),
              placeholder: "0x0000000000000000000000000000000000000000",
            },
            {
              type: "number",
              title: t({
                id: "sNWRZikwccy7fcsadhPTfq4fi-quest",
                message: "Minimum balance, tokens",
              }),
              name: "minTokenAmount",
              schema: string().required(
                t({
                  id: "hT8ZjLF7K2L52dqmW5DU1s-quest",
                  message: "Is required",
                }),
              ),
            },
          ],
          additionalFields: [
            {
              title: t({
                id: "xvffgha9YXVppteDBEJ9oH-quest",
                message: "Title",
              }),
              type: "text",
              name: "title",
              schema: string().required(
                t({
                  id: "sdf5T6VCiBp2jubmMtEXet-quest",
                  message: "Is required",
                }),
              ),
            },
            {
              title: t({
                id: "ssdfDqbHUgyK1QqQkqiLdb4-quest",
                message: "Description",
              }),
              type: "text",
              name: "description",
              schema: string().required(
                t({
                  id: "vfddvT6VCiBp2jubmMtEXet-quest",
                  message: "Is required",
                }),
              ),
            },
          ],
        },
        {
          type: ELoyaltyTasks.VALUE_HOLDER,
          title: t({
            id: "xsfLNLowArWK9idccS-quest",
            message: "Minimum $ worth of tokens",
          }),
          description: t({
            id: "wXhwqPFnwp6m6xXsf5AKM8-quest",
            message: "Description",
          }),
          defaultDescription: t({
            id: "jZ23HhZqxwRpeZ3XL2DUiH-quest",
            message: "Default description 17",
          }),
          socialAlgorithm: false,
          mainFields: [
            {
              type: "text",
              title: t({
                message: "Link to the smart contract",
                id: "sdfsgt-0a83-11ee-be56-0242ac120002-quest",
              }),
              name: "linkAddress",
              placeholder:
                "https://etherscan.io/address/0x0000000000000000000000000000000000000000",
              schema: string()
                .url("Please provide a valid HTTPS URL")
                .test("is-valid-scan-link", (value, { createError, path }) => {
                  if (!value) {
                    createError({
                      path,
                      message: "Please provide a valid Contract URL",
                    });
                    return true;
                  }
                  return !!validateScanUrlAndGetNetworkKey(value);
                }),
              hidden: true,
            },
            {
              type: "selector",
              title: t({
                id: "a1fszPk46KPuedkEETkULKu-quest",
                message: "Blockchain",
              }),
              name: "chainId",
              schema: string().required(
                t({
                  id: "tYGwQYJNs2KPtNyVEVpozw-quest",
                  message: "Is required",
                }),
              ),
              selectorOptions: chainIdSelectorOptions,
            },
            {
              type: "number",
              title: t({
                id: "2tspyCGaN76sfsVH8Ak2fX9VKr-quest",
                message: "Minimum balance, $",
              }),
              name: "minUSDValue",
              schema: string().required(
                t({
                  id: "1bkTcbxa8w5FuH587uVyZ5-quest",
                  message: "Is required",
                }),
              ),
            },
          ],
          additionalFields: [
            {
              title: t({
                id: "xvffgha9YXVppteDBEJ9oH-quest",
                message: "Title",
              }),
              type: "text",
              name: "title",
              schema: string().required(
                t({
                  id: "sdf5T6VCiBp2jubmMtEXet-quest",
                  message: "Is required",
                }),
              ),
            },
            {
              title: t({
                id: "ssdfDqbHUgyK1QqQkqiLdb4-quest",
                message: "Description",
              }),
              type: "text",
              name: "description",
              schema: string().required(
                t({
                  id: "vfddvT6VCiBp2jubmMtEXet-quest",
                  message: "Is required",
                }),
              ),
            },
          ],
        },
      ],
    },
    nft: {
      name: t({ id: "gFCdZoCDTfcUfyJBbGuH1u-quest", message: "NFT" }),
      icon: icons[ELoyaltyTasks.NFT],
      tasks: [
        {
          type: ELoyaltyTasks.NFT,
          title: t({ id: "gFCdZoCDTfcUfyJBbGuH1u-quest", message: "NFT" }),
          description: t({
            id: "2nA8r8Pn2XheDhdgQUarN5-quest",
            message: "Description",
          }),
          defaultDescription: t({
            id: "iXzMcqfjBy2geR22bQz7vh-quest",
            message: "Default description 16",
          }),
          socialAlgorithm: false,
          mainFields: [
            {
              type: "text",
              title: t({
                message: "Link to the smart contract",
                id: "sdfsgt-0a83-11ee-be56-0242ac120002-quest",
              }),
              name: "linkAddress",
              placeholder:
                "https://etherscan.io/address/0x0000000000000000000000000000000000000000",
              schema: string()
                .url("Please provide a valid HTTPS URL")
                .test("is-valid-scan-link", (value, { createError, path }) => {
                  if (!value) {
                    createError({
                      path,
                      message: "Please provide a valid Contract URL",
                    });
                    return true;
                  }
                  return !!validateScanUrlAndGetNetworkKey(value);
                }),
              hidden: true,
            },
            {
              type: "selector",
              title: t({
                id: "f1A1UBxr7Kw2irhoV77756a-quest",
                message: "Blockchain",
              }),
              name: "chainId",
              schema: string().required(
                t({
                  id: "q6dfuA4WJ4XdycNCeWpysS-quest",
                  message: "Is required",
                }),
              ),
              selectorOptions: chainIdSelectorOptions,
            },
            {
              type: "text",
              title: t({
                id: "w2TreKBfNvVu4iQsdXVs2F2j-quest",
                message: "Smart contract address",
              }),
              name: "address",
              schema: string()
                .required(
                  t({
                    id: "gFLPkXiyyy9LLNKGXaDTEH-quest",
                    message: "Is required",
                  }),
                )
                .test("is-contract-address", (value, { createError, path }) => {
                  if (!value) {
                    createError({
                      path,
                      message: "Invalid contract address",
                    });
                    return false;
                  }
                  return isAddress(value);
                }),
              placeholder: "0x0000000000000000000000000000000000000000",
            },
            {
              type: "selector",
              title: t({
                id: "2LjhM6GmWTcjCf1Un1LuGr-quest",
                message: "Standard",
              }),
              name: "standard",
              schema: string().required(
                t({
                  id: "of11wV4FvZZXMX8m7RvXhz-quest",
                  message: "Is required",
                }),
              ),
              selectorOptions: nftStandardSelectorOptions,
              hidden: true,
            },
            {
              type: "number",
              title: t({
                id: "iuPVwfqzk84xBqiUyps9Dq-quest",
                message: "Minimum balance, NFTs",
              }),
              name: "minTokenAmount",
              schema: string().required(
                t({
                  id: "epVDXpqYjamjpgDEqS6z9t-quest",
                  message: "Is required",
                }),
              ),
            },
          ],
          additionalFields: [
            {
              title: t({
                id: "xvffgha9YXVppteDBEJ9oH-quest",
                message: "Title",
              }),
              type: "text",
              name: "title",
              schema: string().required(
                t({
                  id: "sdf5T6VCiBp2jubmMtEXet-quest",
                  message: "Is required",
                }),
              ),
            },
            {
              title: t({
                id: "ssdfDqbHUgyK1QqQkqiLdb4-quest",
                message: "Description",
              }),
              type: "text",
              name: "description",
              schema: string().required(
                t({
                  id: "vfddvT6VCiBp2jubmMtEXet-quest",
                  message: "Is required",
                }),
              ),
            },
          ],
        },
      ],
    },
    stake: {
      name: t({ message: "Stake", id: "jhgkj4-2ksjdvb450df-asf" }),
      icon: icons[ELoyaltyTasks.NATIVE_HOLDER],
      tasks: [
        {
          type: ELoyaltyTasks.NATIVE_HOLDER,
          title: t({
            id: "fwbfqixFq691VNjx-quest",
            message: "Hold native tokens",
          }),
          description: t({
            id: "h2SrCbFmH4hSVrqHwkVCgD-quest",
            message: "Description",
          }),
          defaultDescription: t({
            id: "mhQPGBWgcXbiwg6FLPPFN1-quest",
            message: "Default description 18",
          }),
          socialAlgorithm: false,
          mainFields: [
            {
              type: "text",
              title: t({
                message: "Link to the smart contract",
                id: "sdfsgt-0a83-11ee-be56-0242ac120002-quest",
              }),
              name: "linkAddress",
              placeholder:
                "https://etherscan.io/address/0x0000000000000000000000000000000000000000",
              schema: string()
                .url("Please provide a valid HTTPS URL")
                .test("is-valid-scan-link", (value, { createError, path }) => {
                  if (!value) {
                    createError({
                      path,
                      message: "Please provide a valid Contract URL",
                    });
                    return true;
                  }
                  return !!validateScanUrlAndGetNetworkKey(value);
                }),
              hidden: true,
            },
            {
              type: "selector",
              title: t({
                id: "sopVXLJhjaMBqKisdf5vdLrsi-quest",
                message: "Blockchain",
              }),
              name: "chainId",
              schema: string().required(
                t({
                  id: "hfMdKd9zVL5JyKjuDZMesD-quest",
                  message: "Is required",
                }),
              ),
              selectorOptions: chainIdSelectorOptions,
            },
            {
              type: "number",
              title: t({
                id: "sdqeAhhsdasdfdFuY5a5VJmrWKB5-quest",
                message: "Minimum hold value, $chainId$",
              }),
              name: "minValue",
              schema: string().required(
                t({
                  id: "wWq2be9BDhUTC7KwX9wVwa-quest",
                  message: "Is required",
                }),
              ),
            },
          ],
          additionalFields: [
            {
              title: t({
                id: "xvffgha9YXVppteDBEJ9oH-quest",
                message: "Title",
              }),
              type: "text",
              name: "title",
              schema: string().required(
                t({
                  id: "sdf5T6VCiBp2jubmMtEXet-quest",
                  message: "Is required",
                }),
              ),
            },
            {
              title: t({
                id: "ssdfDqbHUgyK1QqQkqiLdb4-quest",
                message: "Description",
              }),
              type: "text",
              name: "description",
              schema: string().required(
                t({
                  id: "vfddvT6VCiBp2jubmMtEXet-quest",
                  message: "Is required",
                }),
              ),
            },
          ],
        },
        {
          type: ELoyaltyTasks.BLOCKCHAIN_USER,
          title: t({
            id: "8vctdym1FdSasdrCqX-quest",
            message: "Blockchain transactions",
          }),
          description: t({
            id: "uZrrZ28sa1aEfRhqcBi97s-quest",
            message: "Description",
          }),
          defaultDescription: t({
            id: "eYfASAyDKbiVWqnhS5Ue8h-quest",
            message: "Default description 19",
          }),
          socialAlgorithm: false,
          mainFields: [
            {
              type: "text",
              title: t({
                message: "Link to the smart contract",
                id: "sdfsgt-0a83-11ee-be56-0242ac120002-quest",
              }),
              name: "linkAddress",
              placeholder:
                "https://etherscan.io/address/0x0000000000000000000000000000000000000000",
              schema: string()
                .url("Please provide a valid HTTPS URL")
                .test("is-valid-scan-link", (value, { createError, path }) => {
                  if (!value) {
                    createError({
                      path,
                      message: "Please provide a valid Contract URL",
                    });
                    return true;
                  }
                  return !!validateScanUrlAndGetNetworkKey(value);
                }),
              hidden: true,
            },
            {
              type: "selector",
              title: t({
                id: "x9m8vM1wTasad26EFJ2ZEz7Ma-quest",
                message: "Blockchain",
              }),
              name: "chainId",
              schema: string().required(
                t({
                  id: "oGrqQwi7i5zkm14V3Nzbuo-quest",
                  message: "Is required",
                }),
              ),
              selectorOptions: chainIdSelectorOptions,
            },
            {
              type: "number",
              title: t({
                id: "x6EMifvVLsdfsdasdhN9vbEeJ-quest",
                message: "Minimum transactions number",
              }),
              name: "minTransactions",
              schema: string().required(
                t({
                  id: "e8ZQ7mibq8UrhjxxTJPT3K-quest",
                  message: "Is required",
                }),
              ),
            },
          ],
          additionalFields: [
            {
              title: t({
                id: "xvffgha9YXVppteDBEJ9oH-quest",
                message: "Title",
              }),
              type: "text",
              name: "title",
              schema: string().required(
                t({
                  id: "sdf5T6VCiBp2jubmMtEXet-quest",
                  message: "Is required",
                }),
              ),
            },
            {
              title: t({
                id: "ssdfDqbHUgyK1QqQkqiLdb4-quest",
                message: "Description",
              }),
              type: "text",
              name: "description",
              schema: string().required(
                t({
                  id: "vfddvT6VCiBp2jubmMtEXet-quest",
                  message: "Is required",
                }),
              ),
            },
          ],
        },
      ],
    },
    transaction: {
      name: t({ message: "Transaction", id: "jkhjvk-43jkbdfb-dfbkjdb" }),
      icon: icons[ELoyaltyTasks.DEX_LIQUIDITY_PROVIDER],
      tasks: [
        {
          type: ELoyaltyTasks.DEX_LIQUIDITY_PROVIDER,
          title: t({
            message: "Emit an on-chain event",
            id: "sdfdsf-0a83-11ee-be56-0242ac120002-quest",
          }),
          description: "",
          defaultDescription: t({
            id: "37dcadd4-0a83-11ee-be56-0242ac120002-quest",
            message: "Default description 20",
          }),
          socialAlgorithm: false,
          mainFields: [
            {
              type: "text",
              title: t({
                message: "Link to the smart contract",
                id: "sdfsgt-0a83-11ee-be56-0242ac120002-quest",
              }),
              name: "linkAddress",
              placeholder:
                "https://etherscan.io/address/0x0000000000000000000000000000000000000000",
              schema: string()
                .url("Please provide a valid HTTPS URL")
                .test("is-valid-scan-link", (value, { createError, path }) => {
                  if (!value) {
                    createError({
                      path,
                      message: "Please provide a valid Contract URL",
                    });
                    return true;
                  }
                  return !!validateScanUrlAndGetNetworkKey(value);
                }),
              hidden: true,
            },
            {
              hidden: true,
              type: "text",
              json: true,
              title: t({
                message: "Method Name (ABI)",
                id: "aeed17e2-0a83-11ee-be56-0242ac120002-quest",
              }),
              name: "methodAbi",
              schema: object().required(
                t({
                  id: "e8ZQ7mibq8UrhjxxTJPT3K-quest",
                  message: "Is required",
                }),
              ),
            },
            {
              type: "selector",
              title: t({
                id: "aeed1922-0a83-11ee-be56s-0242ac120002-quest",
                message: "Blockchain",
              }),
              name: "chainId",
              schema: string().required(
                t({
                  id: "oGrqQwi7i5zkm14V3Nzbuo-quest",
                  message: "Is required",
                }),
              ),
              selectorOptions: chainIdSelectorOptions,
              // hidden: true,
            },
            {
              type: "text",
              title: t({
                message: "Contract Address",
                id: "aeed1580-0a83-11ee-be56-0242ac120002-quest",
              }),
              name: "contractAddress",
              placeholder: "0x0000000000000000000000000000000000000000",
              hidden: true,
              schema: string()
                .required(
                  t({
                    id: "e8ZQ7mibq8UrhjxxTJPT3K-quest",
                    message: "Is required",
                  }),
                )
                .test("is-contract-address", (value, { createError, path }) => {
                  if (!value) {
                    createError({
                      path,
                      message: "Invalid contract address",
                    });
                    return false;
                  }
                  return isAddress(value);
                }),
            },
          ],
          additionalFields: [
            {
              title: t({
                id: "xvffgha9YXVppteDBEJ9oH-quest",
                message: "Title",
              }),
              type: "text",
              name: "title",
              schema: string().notRequired().nullable(),
            },
            {
              title: t({
                id: "ssdfDqbHUgyK1QqQkqiLdb4-quest",
                message: "Description",
              }),
              type: "wyziwyg",
              name: "description",
              placeholder: t({
                message:
                  "Description about how to call a smart contract’s specific method which will emit the $eventName$, e.g.:Go to opensea.io, buy any NFT and get your points!",
                id: "sjdfh47jakajd-quest",
              }),
              schema: string().notRequired().nullable(),
            },
            {
              type: "number",
              title: t({
                id: "2sxxty84NWRZikwccy7fcsadhPTfq4fi-quest",
                message: "Minimum events quantity",
              }),
              name: "eventsQuantity",
              schema: number().notRequired(),
            },
          ],
        },
      ],
    },
    gitCoin: {
      name: t({ message: "GitCoin", id: "sjdgbk2-wjkdvb-asckjb" }),
      icon: icons[ELoyaltyTasks.GIT_COIN],
      tasks: [
        {
          type: ELoyaltyTasks.GIT_COIN,
          title: t({
            message: "Gitcoin Passport score",
            id: "qwcdfdsf-0a83-11ee-be56-0242ac120002-quest",
          }),
          description: t({
            message: "Have the Gitcoin Passport score higher than $threshold$",
            id: "38dcadd4-0a83-11ee-be56-0242ac120002-quest",
          }),
          defaultDescription: t({
            id: "37dcadd4-0a83-11ee-be56-0242ac120002-quest",
            message: "Default description 20",
          }),
          socialAlgorithm: false,
          additionalFields: [
            {
              type: "text",
              title: t({
                message: "Gitcoin Scorer ID",
                id: "ghqudfsgt-0a83-11ee-be56-0242ac120002-quest",
              }),
              name: "gitCoinScorerId",
              placeholder: t({
                message: "Gitcoin Scorer ID",
                id: "gnmudfsgt-0a83-11ee-be56-0242ac120002-quest",
              }),
              schema: string().required(
                t({
                  message: "Is required",
                  id: "824nmudfsgt-0a83-11ee-be56-0242ac120002-quest",
                }),
              ),
            },
            {
              type: "text",
              title: t({
                message: "Gitcoin Scorer API key",
                id: "g891udfsgt-0a83-11ee-be56-0242ac120002-quest",
              }),
              name: "gitCoinApiKey",
              placeholder: t({
                message: "Gitcoin Scorer API key",
                id: "924nmudfsgt-0a83-11ee-be56-0242ac120002-quest",
              }),
              schema: string().required(
                t({
                  message: "Is required",
                  id: "854nmudfsgt-0a83-11ee-be56-0242ac120002-quest",
                }),
              ),
            },
          ],
          mainFields: [
            {
              title: t({
                id: "ytwffgha9YXVppteDBEJ9oH-quest",
                message: "Title",
              }),
              type: "text",
              name: "title",
              schema: string().required(
                t({
                  message: "Is required",
                  id: "e8ZQ7mibq8UrhjxxTJPT3K-quest",
                }),
              ),
            },
            {
              title: t({
                id: "ssdfDqbHUgyK1QqQkqiLdb4-quest",
                message: "Description",
              }),
              type: "wyziwyg",
              name: "description",
              placeholder: t({
                message:
                  "Have the Gitcoin Passport score higher than $threshold$",
                id: "sj2fddfh47jakajd-quest",
              }),
              schema: string().required(
                t({
                  message: "Is required",
                  id: "qc8ZQ7mibq8UrhjxxTJPT3K-quest",
                }),
              ),
            },
            {
              type: "number",
              title: t({
                id: "ty84NWRZikwccy7fcsadhPTfq4fi-quest",
                message: "Minimum GitCoin score",
              }),
              name: "threshold",
              schema: string().required(
                t({
                  id: "hT8ZjLF7K2Ld-52dqmW5DU1s-quest",
                  message: "Is required",
                }),
              ),
            },
          ],
        },
      ],
    },
  } as IOffChainTaskType);
