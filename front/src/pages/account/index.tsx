const Account = () => <div></div>;

export const getServerSideProps = () => {
  return {
    redirect: {
      destination: "/profile/balance",
      permanent: true,
    },
  };
};

export default Account;
