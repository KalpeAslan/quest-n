import { DEFAULT_META_TITLE_UK } from "@/models/constants";
import { HomePage } from "@/modules/quest/pages/home";
import { GetServerSideProps } from "next";

const Quest = () => <HomePage />;

export const getServerSideProps: GetServerSideProps = async ctx => {
  return {
    props: {
      title:
        ctx.locale === "en"
          ? "AlphaGuilty is a multichain ecosystem for boosting crypto portfolio via AlphaQuest"
          : DEFAULT_META_TITLE_UK,
      link: "/",
    },
  };
};

export default Quest;
