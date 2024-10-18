import { useEffect } from "react";
import { Box } from "@mui/material";
import { useContextSelector } from "use-context-selector";
import { Link } from "@components/UI/link";
import { AppContext } from "@context";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";

const TermsAndCondition = () => {
  const { pathname } = useRouter();
  const prevLocation = useContextSelector(
    AppContext,
    state => state.prevLocation,
  );

  useEffect(() => {
    return () => {
      if (prevLocation) {
        prevLocation.current = pathname;
      }
    };
  }, []);

  return (
    <div className="background-other">
      <div className="c-wrap-2">
        <Box
          component="h2"
          className="c-font-32-38 c-sm-font-48-56 c-font-color"
          sx={{ mb: { xs: 3, sm: 4 }, mt: { xs: 3, sm: 5 }, fontWeight: 700 }}
        >
          {/* <Trans> */}Terms of use{/* </Trans> */}
        </Box>

        <Box
          component="h2"
          className="c-font-20-24 c-sm-font-20-28 c-font-color"
          sx={{ mb: 1.25, fontWeight: 700 }}
        >
          1. {/* <Trans> */}Definition of terms{/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          1.1.{" "}
          <strong>
            {/* <Trans> */}User Agreement{/* </Trans> */}
          </strong>{" "}
          {/* <Trans> */}
          (hereinafter referred to as the &quot;User Agreement&quot; and/or the
          &quot;Agreement&quot; and/or the &quot;Policy&quot;) is an agreement
          that regulates the relationship between the User and the Service.
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          <strong>
            1.2. {/* <Trans> */}The Service{/* </Trans> */}
          </strong>{" "}
          {/* <Trans> */}
          (hereinafter referred to as the Service and/or the &quot;Company&quot;
          and/or &quot;We&quot; and/or &quot;Our Company&quot;) is an online
          service that is provided by means of the Internet and is available at
          the link
          {/* </Trans> */}{" "}
          <Link
            href="https://alphaguilty.io/"
            target="_blank"
            rel="noreferrer"
            underline="hover"
          >
            https://alphaguilty.io
          </Link>
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          <strong>
            1.3. {/* <Trans> */}The User{/* </Trans> */}
          </strong>{" "}
          {/* <Trans> */}
          (hereinafter referred to as the &quot;User&quot; and/or
          &quot;You&quot;) is an individual who has registered and uses the
          Service.
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          <strong>
            1.4. {/* <Trans> */}Visitors{/* </Trans> */}
          </strong>{" "}
          {/* <Trans> */}
          are individuals who have visited the Service without registering on
          it.
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 4 }}
        >
          <strong>
            1.5. {/* <Trans> */}A Project{/* </Trans> */}
          </strong>{" "}
          {/* <Trans> */}
          is any project about which information is posted on the Service and
          which wants to attract investments from Users.
          {/* </Trans> */}
        </Box>

        <Box
          component="h2"
          className="c-font-20-24 c-sm-font-20-28 c-font-color"
          sx={{ mb: 1.25, fontWeight: 700 }}
        >
          2. {/* <Trans> */}General Terms{/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          2.1. {/* <Trans> */}
          The User Agreement is an adhesion contract, the terms of which are
          established by the Service and set forth in this Agreement and/or
          other documents of the Company.
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          2.2. {/* <Trans> */}
          The Agreement is concluded by the User&apos;s joining to this User
          Agreement.
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          2.3. {/* <Trans> */}
          By registering on the Service and using it, you automatically agree to
          the terms of the Agreement.
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          2.4. {/* <Trans> */}
          If you do not agree in whole or in part with the terms of this or
          other Company&apos;s Agreements, please do not use the Service.
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 4 }}
        >
          2.5. {/* <Trans> */}
          This Agreement applies to all Users and Visitors of the Service during
          the period of use/visit of our Service.
          {/* </Trans> */}
        </Box>

        <Box
          component="h2"
          className="c-font-20-24 c-sm-font-20-28 c-font-color"
          sx={{ mb: 1.25, fontWeight: 700 }}
        >
          3. {/* <Trans> */}About the Service{/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          3.1. {/* <Trans> */}
          The Service is a platform where you can find information about various
          projects, including startups searching for investment for the
          implementation of a project. You can also use our Service to invest in
          any project posted on our Service.
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          3.2. {/* <Trans> */}
          DISCLAIMER, nothing in this Policy means that the Service acts as an
          investment intermediary, stockbroker or any financial analyst. The
          Company does not provide consulting services on investments or any
          other transactions.
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 4 }}
        >
          3.3. {/* <Trans> */}
          Placing information about projects does not guarantee you the security
          of your investment. Any project is solely responsible to its own
          investors. The Company is not responsible for illegal actions of the
          projects or any other actions that caused the loss of investments,
          etc.
          {/* </Trans> */}
        </Box>

        <Box
          component="h2"
          className="c-font-20-24 c-sm-font-20-28 c-font-color"
          sx={{ mb: 1.25, fontWeight: 700 }}
        >
          4. {/* <Trans> */}Who can be our User{/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          4.1. {/* <Trans> */}
          Anyone can become our User, however, you cannot use the Service if:
          {/* </Trans> */}
        </Box>

        <Box className="c-font-14-19 c-sm-font-16-22 c-font-color">
          <Box component="ul" sx={{ pl: 3.25 }}>
            <Box component="li" sx={{ mb: 1 }}>
              {/* <Trans> */}
              You are a person who is recognized as a person who finances
              terrorism or other prohibited organizations;
              {/* </Trans> */}
            </Box>

            <Box component="li" sx={{ mb: 1 }}>
              {/* <Trans> */}
              You are located in a country that prohibits any investment,
              including investments in virtual assets;
              {/* </Trans> */}
            </Box>

            <Box component="li" sx={{ mb: 1 }}>
              {/* <Trans> */}
              You are an incapacitated person in accordance with the laws of
              your country of residence.
              {/* </Trans> */}
            </Box>
          </Box>
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          4.2. {/* <Trans> */}
          If you are not subject to the above restrictions, you may use our
          Service.
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 4 }}
        >
          4.3. {/* <Trans> */}
          Our company is not responsible for your actions, therefore, if you
          have deceived our Service by impersonating another person, we are not
          responsible for your actions and reserve the right to restrict your
          access to the Service without any legal consequences for us.
          {/* </Trans> */}
        </Box>

        <Box
          component="h2"
          className="c-font-20-24 c-sm-font-20-28 c-font-color"
          sx={{ mb: 1.25, fontWeight: 700 }}
        >
          5. {/* <Trans> */}Your account{/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          5.1. {/* <Trans> */}
          By registering on the Service, you become the owner of your account.
          Please do not share access to your account, as our Company is not
          responsible for the loss of access to your account. Keep your password
          confidential.
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 4 }}
        >
          5.2. {/* <Trans> */}
          You are responsible for all actions taken from your account, even if
          it was not you, but someone else who used your account.
          {/* </Trans> */}
        </Box>

        <Box
          component="h2"
          className="c-font-20-24 c-sm-font-20-28 c-font-color"
          sx={{ mb: 1.25, fontWeight: 700 }}
        >
          6. {/* <Trans> */}Intellectual property rights{/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          6.1. {/* <Trans> */}
          Our Company reserves all intellectual property rights to the Service,
          including, but not limited to, trademarks, software rights, etc.
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          6.2. {/* <Trans> */}
          If you are a project hosted on our platform, you grant the right to
          publish information about you, including trademarks, trade name, etc.
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          6.3. {/* <Trans> */}
          Since the Service is software (a set of codes and different numbers),
          and this software belongs to our Company, due to the fact that we are
          trying to develop our Service as much as possible, and this requires
          constant updates, you agree to update the software that you have
          downloaded to your gadget. This is necessary solely for the reliable
          and comfortable use of the Service.
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 4 }}
        >
          6.4. {/* <Trans> */}
          Please do not use our logo, trade name, etc., to harm us. We allow you
          to use our brand to promote it, but we reserve the right to prohibit
          you from doing so at any time if we deem it necessary.
          {/* </Trans> */}
        </Box>

        <Box
          component="h2"
          className="c-font-20-24 c-sm-font-20-28 c-font-color"
          sx={{ mb: 1.25, fontWeight: 700 }}
        >
          7. {/* <Trans> */}Technical support of the Service{/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          7.1. {/* <Trans> */}
          If you have any questions or suggestions, you can contact technical
          support to receive an answer to your question or suggestion.
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          7.2. {/* <Trans> */}
          Please note that if you send a message to Technical Support with the
          intention of damaging the Service, your account will be blocked.
          {/* </Trans> */}{" "}
          <strong>
            {/* <Trans> */}FOR EXAMPLE,{/* </Trans> */}
          </strong>{" "}
          {/* <Trans> */}
          you have sent a message to Technical Support containing a virus that
          may damage the Service.
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          7.3. {/* <Trans> */}
          You can contact technical support at any time, and you will receive a
          response within a reasonable time, in the order of the live queue of
          requests, taking into account the workload of our specialists.
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          7.4. {/* <Trans> */}
          Our specialists will endeavour to provide a response as quickly and
          informatively as possible.
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 4 }}
        >
          7.5. {/* <Trans> */}
          Please do not send messages to technical support for no reason or with
          spam information. If your account is found to be spam or unreasonable
          messages to the technical support, the Company reserves the right to
          block your account.
          {/* </Trans> */}
        </Box>

        <Box
          component="h2"
          className="c-font-20-24 c-sm-font-20-28 c-font-color"
          sx={{ mb: 1.25, fontWeight: 700 }}
        >
          8. {/* <Trans> */}Blocking and deletion of the account{/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          8.1. {/* <Trans> */}
          Your account may be blocked and/or deleted for reasons determined to
          be violations of the terms of this Agreement and/or other Company
          policies. Our Company is not responsible for any consequences arising
          from the blocking and/or deletion of your account.
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          8.2. {/* <Trans> */}
          The Company makes its own decisions on blocking and deleting accounts.
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 4 }}
        >
          8.3. {/* <Trans> */}
          The period of blocking is determined by the Company at its sole
          discretion, depending on the systematic nature of violations and may
          last from several hours to several days. For systematic violation or
          gross violation of the Service rules, the Company has the right to
          block the account for a long term or delete the account.
          {/* </Trans> */}
        </Box>

        <Box
          component="h2"
          className="c-font-20-24 c-sm-font-20-28 c-font-color"
          sx={{ mb: 1.25, fontWeight: 700 }}
        >
          9. {/* <Trans> */}Limitation of liability{/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          9.1. {/* <Trans> */}
          Our company operates exclusively within the legal framework and
          strives to ensure that our Service meets all the requirements and
          standards for similar products. At the same time, we cannot guarantee
          that the Service will always be safe and operate continuously and
          without any errors, including technical errors, interruptions,
          defects, etc. In view of this, the Service is provided as it is
          provided &quot;As It Is&quot;.
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          9.2. {/* <Trans> */}
          Our Company does not provide any guarantees to the Users.
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          9.3. {/* <Trans> */}
          Our Company is not responsible for the actions of third parties,
          including Users and Visitors of the Service.
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          9.4. {/* <Trans> */}
          Our Company&apos;s liability is limited to the maximum extent
          permitted by applicable law.
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 4 }}
        >
          9.5. {/* <Trans> */}
          The Company shall not be liable to the Users for any lost profits,
          income, indirect, actual, or punitive damages caused by or related to
          these Terms.
          {/* </Trans> */}
        </Box>

        <Box
          component="h2"
          className="c-font-20-24 c-sm-font-20-28 c-font-color"
          sx={{ mb: 1.25, fontWeight: 700 }}
        >
          10. {/* <Trans> */}Applicable law and dispute resolution
          {/* </Trans> */}
        </Box>

        <Box
          component={"p"}
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          {`
          10.1. Nature of Service: "AlphaGuilty" is solely a service provider
          that offers a platform for project owners to communicate and engage
          with their communities. We do not endorse, sponsor, or promote any of
          the projects or campaigns that use our platform.
          `}
        </Box>

        <Box
          component={"p"}
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          {`10.2. No Liability: AlphaGuilty assumes no responsibility or liability
          for the actions, products, services, or content of these third-party
          projects. Any participation in or use of the campaigns or offerings of
          project owners is at the user's own risk.`}
        </Box>

        <Box
          component={"p"}
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          {`10.3. DYOR: All users are strongly advised to "Do Your Own Research"
          (DYOR) before engaging with any campaigns or projects on our platform.
          While we strive to maintain a platform of integrity, it's crucial for
          users to exercise due diligence and caution.`}
        </Box>

        <Box
          component={"p"}
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          10.4. No Endorsement: The mere presence of a project on the
          AlphaGuilty platform does not imply an endorsement or recommendation
          of that project. All projects are treated equally, and our platform
          serves merely as a tool for communication.
        </Box>

        <Box
          component={"p"}
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          10.5. Complaints and Disputes: AlphaGuilty is not responsible for
          resolving or intervening in any disputes between users and third-party
          projects. Any grievances or issues related to campaigns, rewards, or
          promises made by these projects must be addressed directly with the
          respective project owners.
        </Box>

        <Box
          component={"p"}
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          10.6. Indemnification: Users agree to indemnify and hold AlphaGuilty
          harmless from any claims, losses, damages, or expenses, including
          legal fees, arising out of their interactions or transactions with
          third-party projects on our platform.
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          11. {/* <Trans> */}
          In our relations with you, we apply the current legislation of
          Lithuania.
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          <strong>12.</strong> {/* <Trans> */}
          We try to resolve all disputes through dialogue, so if you have any
          complaints, please contact us through technical support. If we are
          really wrong and we have done something wrong, we will try to resolve
          the dispute through an amicable settlement.
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 4 }}
        >
          <strong>13.</strong> {/* <Trans> */}
          If the dispute cannot be settled through negotiations, you have the
          right to apply to the judicial authorities of Lithuania to protect
          your rights.
          {/* </Trans> */}
        </Box>

        <Box
          component="h2"
          className="c-font-20-24 c-sm-font-20-28 c-font-color"
          sx={{ mb: 1.25, fontWeight: 700 }}
        >
          14. {/* <Trans> */}Final terms{/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          14.1 {/* <Trans> */}
          Our Company is constantly developing, and adding new functionality or
          opportunities for Users, which means that the Company&apos;s policies
          may also change. All changes in the Company&apos;s policies will be
          notified to you in advance so that you can familiarize yourself with
          them, or simply ignore them, as most people do. Please note that
          ignorance of the law does not exempt you from liability, and therefore
          ignorance of the Company&apos;s policies, including the rules of this
          Agreement, does not exempt you from the need to comply with the rules
          of our Service.
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          14.2 {/* <Trans> */}
          If any issues are not regulated by this Agreement, they may be
          described in other Company policies (privacy policy, cookie policy,
          etc.).
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 5 }}
        >
          14.3 {/* <Trans> */}
          This agreement is valid as of the date of your familiarization with it
          and is valid for the duration of the Service.
          {/* </Trans> */}
        </Box>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      title: "Terms and conditions",
      link: "/terms-and-condition",
    },
  };
};

export default TermsAndCondition;
