import { AboutUsPage } from "@/modules/aboutUs/pages";
import { GetServerSideProps } from "next";

export const AboutUs = () => <AboutUsPage />;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      title: "About us",
      link: "/about-us",
    },
  };
};

export default AboutUs;
