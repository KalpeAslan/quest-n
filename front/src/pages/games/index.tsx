import { GamesPage } from "@/modules/games/pages/GamesPage";
import { GetServerSideProps } from "next";

const Games = () => <GamesPage />;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      title: "Games",
      link: "/games",
    },
  };
};

export default Games;
