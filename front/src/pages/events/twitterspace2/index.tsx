import { TwitterSpace2EventPage } from "@/modules/events/pages/twitterspace2";
import { GetServerSideProps } from "next";

const TwitterSpace2Event = () => <TwitterSpace2EventPage />;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      title: "Online event for Twitter Space",
      link: "/events/twitterspace2",
    },
  };
};

export default TwitterSpace2Event;
