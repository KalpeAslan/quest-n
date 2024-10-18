import { SignUpPage } from "@/modules/account/pages/signUp";
import { GetServerSideProps } from "next";

const SignUp = () => <SignUpPage />;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      title: "Sign-up",
      link: "/sign-up",
    },
  };
};

export default SignUp;
