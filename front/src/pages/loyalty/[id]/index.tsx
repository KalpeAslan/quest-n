import { useRouter } from "next/router";
import { useEffect } from "react";
import { GetServerSideProps } from "next";

const LoyaltyProject = () => {
  const { query, replace } = useRouter();

  useEffect(() => {
    replace(`/quest/${query.id}`);
  }, [replace, query]);

  return <></>;
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      link: "/loyalty",
    },
  };
};

export default LoyaltyProject;
