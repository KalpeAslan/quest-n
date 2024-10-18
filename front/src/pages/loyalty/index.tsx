import { useRouter } from "next/router";
import { useEffect } from "react";
import { GetServerSideProps } from "next";

const Loyalty = () => {
  const { replace } = useRouter();

  useEffect(() => {
    replace("/quest");
  }, [replace]);

  return <></>;
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      link: "/loyalty",
    },
  };
};

export default Loyalty;
