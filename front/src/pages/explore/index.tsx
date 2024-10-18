import { ExplorePage } from "@/modules/quest/pages/explore";
import { GetServerSideProps } from "next";

const Explore = () => <ExplorePage />;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      title: "Explore",
      link: "/explore",
    },
  };
};

export default Explore;
