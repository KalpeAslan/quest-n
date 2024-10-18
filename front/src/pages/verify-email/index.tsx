import { VerifyEmailPage } from "@/modules/account/pages/verifyEmail";
import { GetServerSideProps } from "next";

const VerifyEmail = ({
  token,
  referralCode,
  email,
  redirect,
  questReferralCode,
}) => (
  <VerifyEmailPage
    token={token}
    referralCode={referralCode}
    email={email}
    redirect={redirect}
    questReferralCode={questReferralCode}
  />
);

export const getServerSideProps: GetServerSideProps = async ctx => {
  const { token, referral_code, email, redirect, quest_referral_code } =
    ctx.query;

  return {
    props: {
      title: "Verify email",
      link: "/verify-email",
      token: token || null,
      referralCode: referral_code || null,
      email: email || null,
      redirect: redirect || null,
      questReferralCode: quest_referral_code || null,
    },
  };
};

export default VerifyEmail;
