import { LoginPage } from "@/modules/account/pages/login";
import { GetServerSideProps } from "next";

const Login = () => <LoginPage />;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      title: "Login",
      link: "/login",
      key: "login",
    },
  };
};

export default Login;
