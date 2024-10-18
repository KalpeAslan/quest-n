import { OnlineEventPage } from "@/modules/events/pages/onlineMeetup";
import { GetServerSideProps } from "next";

const OnlineEvent = () => <OnlineEventPage />;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      title: "Online event",
      link: "/events/online-meetup",
    },
  };
};

export default OnlineEvent;
