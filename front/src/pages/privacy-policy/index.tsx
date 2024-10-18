import { useEffect } from "react";
import { Box } from "@mui/material";
import { useContextSelector } from "use-context-selector";

import { Link } from "@components/UI/link";
import { AppContext } from "@context";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";

const PrivacyPolicy = () => {
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
          {/* <Trans> */}Privacy Policy{/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 4 }}
        >
          {/* <Trans> */}
          Modern business processes can hardly be imagined without gathering
          consumer (user) information and our site is no exception. We have
          written this Privacy Policy (hereinafter referred to as “Policy”) to
          make information collection correct and understandable, which answers
          such questions as “what information do we collect”, “how do we use
          information” and “how long do we store information”.
          {/* </Trans> */}
        </Box>

        <Box
          component="h2"
          className="c-font-20-24 c-sm-font-20-28 c-font-color"
          sx={{ mb: 1.25, fontWeight: 700 }}
        >
          1. {/* <Trans> */}What information do we collect?{/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          {/* <Trans> */}
          Our site collects different types of information. Its type depends on
          the scope of your interaction with our site. We shall discuss the
          types of information and their brief description below.
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          <strong>
            {/* <Trans> */}Information about the use of the site.
            {/* </Trans> */}
          </strong>{" "}
          {/* <Trans> */}
          It contains data about how you use and interact with the site.
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          <strong>
            {/* <Trans> */}Information about devices (gadgets).{/* </Trans> */}
          </strong>{" "}
          {/* <Trans> */}
          It contains data about your connection to the site (for example, IP
          address, browser type, etc.), about your gadget and its settings (for
          example, carrier, language, battery level, ability to receive
          advertising, operating system, etc.).
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          <strong>
            {/* <Trans> */}Location.{/* </Trans> */}
          </strong>{" "}
          {/* <Trans> */}
          This type of information contains data about your location.
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          <strong>
            {/* <Trans> */}Information about events.{/* </Trans> */}
          </strong>{" "}
          {/* <Trans> */}
          We can receive information about how you act on our site. This type of
          information includes such data as your IP address, language, browser
          type, operating system, page visits, location, mobile operator, gadget
          information, search terms and identifiers, advertising, interaction
          with links on our site, etc.
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          <strong>
            {/* <Trans> */}Advertising.{/* </Trans> */}
          </strong>{" "}
          {/* <Trans> */}
          We can receive information about your interaction with advertising
          placed on the site (viewing video materials, clicking on an
          advertising link, etc.).
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          <strong>
            {/* <Trans> */}Cookies.{/* </Trans> */}
          </strong>{" "}
          {/* <Trans> */}
          We discussed this type of information in detail in our cookies policy.
          Interaction with our content on other resources. If you have come
          across our advertisement, we may also receive information about it.
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 4 }}
        >
          <strong>
            {/* <Trans> */}Information received from third parties.
            {/* </Trans> */}
          </strong>{" "}
          {/* <Trans> */}
          If you use other apps, websites, etc., they may also share information
          with us. This type of information applies to areas such as
          advertising, development, etc.
          {/* </Trans> */}
        </Box>

        <Box
          component="h2"
          className="c-font-20-24 c-sm-font-20-28 c-font-color"
          sx={{ mb: 1.25, fontWeight: 700 }}
        >
          2. {/* <Trans> */}How do we use the information received from you?
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          {/* <Trans> */}
          The received information is used for different purposes, the same
          information may be used for two or more purposes of its processing.
          Details about directions of information use:
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          <strong>
            {/* <Trans> */}Operational management.{/* </Trans> */}
          </strong>{" "}
          {/* <Trans> */}
          First of all, all the information is necessary in order to manage the
          site efficiently and effectively. For example, we need to know how
          many users use a particular type of browser in order to configure the
          site to work faster on the corresponding browser.
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          <strong>
            {/* <Trans> */}Protection and security.{/* </Trans> */}
          </strong>{" "}
          {/* <Trans> */}
          All information received by us is collected for the purpose of
          protecting both you and us. For example, protection against
          fraudsters, unauthorized use of the site, etc.
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          <strong>
            {/* <Trans> */}Analytics.{/* </Trans> */}
          </strong>{" "}
          {/* <Trans> */}
          To improve our services, we need to analyze the received information.
          Analytics is necessary for us to understand how you use the site and
          what needs to be done to make this use better.
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          <strong>
            {/* <Trans> */}Communication.{/* </Trans> */}
          </strong>{" "}
          {/* <Trans> */}
          The received information is necessary for us to communicate with you.
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          <strong>
            {/* <Trans> */}Research.{/* </Trans> */}
          </strong>{" "}
          {/* <Trans> */}
          The information obtained is used to research what is happening on the
          site. If analytics is exclusively data analysis, then research can be
          expressed in surveys, testing new functionality, fixing errors, etc.
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 4 }}
        >
          <strong>
            {/* <Trans> */}Other purposes.{/* </Trans> */}
          </strong>{" "}
          {/* <Trans> */}
          The information may be used for other purposes that are not explicitly
          stated in this classification, but implied in this Policy. All
          information received by us will be used exclusively within the limits
          permitted by law.
          {/* </Trans> */}
        </Box>

        <Box
          component="h2"
          className="c-font-20-24 c-sm-font-20-28 c-font-color"
          sx={{ mb: 1.25, fontWeight: 700 }}
        >
          3. {/* <Trans> */}How do we share your information?{/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 4 }}
        >
          {/* <Trans> */}
          In no case do we distribute your information for the purpose of
          dishonest or fraudulent activities. We may share information about you
          with our partners for the purposes specified in section 2 herein. We
          may share the information we receive with our partners and
          contractors, etc., such as advertising agencies, developers, analysts,
          cybersecurity specialists, etc.
          {/* </Trans> */}
        </Box>

        <Box
          component="h2"
          className="c-font-20-24 c-sm-font-20-28 c-font-color"
          sx={{ mb: 1.25, fontWeight: 700 }}
        >
          4. {/* <Trans> */}Disclosure of information pursuant to law.
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 4 }}
        >
          {/* <Trans> */}
          We exclude the possibility that our Company will be forced to share
          your information by law. For example, at the request of a public
          authority (court, prosecutor&apos;s office, police, etc.), we will be
          obliged to provide information that will be requested from the
          requester.
          {/* </Trans> */}
        </Box>

        <Box
          component="h2"
          className="c-font-20-24 c-sm-font-20-28 c-font-color"
          sx={{ mb: 1.25, fontWeight: 700 }}
        >
          5. {/* <Trans> */}How long do we store information about you?
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          {/* <Trans> */}
          We may store other information for periods resulting from the
          following factors:
          {/* </Trans> */}
        </Box>

        <Box className="c-font-14-19 c-sm-font-16-22 c-font-color">
          <Box component="ul" sx={{ pl: 3.25 }}>
            <Box component="li" sx={{ mb: 1 }}>
              {/* <Trans> */}
              If this information is necessary to improve the website.
              {/* </Trans> */}
            </Box>

            <Box component="li" sx={{ mb: 1 }}>
              {/* <Trans> */}
              Information is necessary to perform a certain function.
              {/* </Trans> */}
            </Box>

            <Box component="li" sx={{ mb: 1 }}>
              {/* <Trans> */}Fulfillment of legal obligations.{/* </Trans> */}
            </Box>

            <Box component="li" sx={{ mb: 1 }}>
              {/* <Trans> */}
              To preserve our legitimate goals (prevention of harm, etc.)
              {/* </Trans> */}
            </Box>
          </Box>
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 4 }}
        >
          {/* <Trans> */}
          It is essential to note that the third parties may store information
          about you obtained from public access posted on our website. Our
          Company is not responsible for their storage period. We are solely
          responsible for our own actions.
          {/* </Trans> */}
        </Box>

        <Box
          component="h2"
          className="c-font-20-24 c-sm-font-20-28 c-font-color"
          sx={{ mb: 1.25, fontWeight: 700 }}
        >
          6. {/* <Trans> */}Where is the information stored?{/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 4 }}
        >
          {/* <Trans> */}
          Information is stored and processed in places where the company&apos;s
          infrastructure, both physical and virtual, exists, including but not
          limited to the services of third parties for the provision of virtual
          storage for rent.
          {/* </Trans> */}
        </Box>

        <Box
          component="h2"
          className="c-font-20-24 c-sm-font-20-28 c-font-color"
          sx={{ mb: 1.25, fontWeight: 700 }}
        >
          7. {/* <Trans> */}How to control your own data?{/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          {/* <Trans> */}
          Get information about yourself. You can request the information we
          have received about you. Deleting information about yourself. You have
          the right to contact us with a request to delete information about
          you. In this case, after consideration and satisfaction of your
          request, all information will be deleted within 30 working days.
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          {/* <Trans> */}
          ATTENTION! Before providing you with access to your information or
          fulfilling a request to delete your data, we reserve the right to
          verify your identity in order to comply with privacy regulations. If
          you are unable to confirm your identity, we have the right to refuse
          your request.
          {/* </Trans> */}
        </Box>

        <Box
          component="h2"
          className="c-font-20-24 c-sm-font-20-28 c-font-color"
          sx={{ mb: 1.25, fontWeight: 700 }}
        >
          8. {/* <Trans> */}How do we protect your information?{/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          {/* <Trans> */}
          We use various security measures, including encryption. Whenever your
          information is transmitted or processed, all information is encrypted,
          in accordance with the standards of this type of work.
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          {/* <Trans> */}
          The company reserves the right to apply other security measures in the
          field of personal data protection of its own Users.
          {/* </Trans> */}
        </Box>

        <Box
          component="h2"
          className="c-font-20-24 c-sm-font-20-28 c-font-color"
          sx={{ mb: 1.25, fontWeight: 700 }}
        >
          9. {/* <Trans> */}Final provisions{/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          {/* <Trans> */}
          By using our site, you automatically agree to the terms of this
          Policy. This Policy may be updated and changed, we will notify you in
          advance of any changes to this Policy.
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          {/* <Trans> */}
          By using our site, you automatically agree to the collection and
          processing of your personal data, within the limits of this policy and
          the current legislation.
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 5 }}
        >
          {/* <Trans> */}
          Should you have any additional questions about this policy, feel free
          to contact us
          {/* </Trans> */}
          {" ("}
          <Link
            href="mailto:support@alphaguilty.io"
            target="_blank"
            rel="noreferrer"
            underline="hover"
          >
            support@alphaguilty.io
          </Link>
          {") "}
          {/* <Trans> */}and we will happily answer them.{/* </Trans> */}
        </Box>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      title: "Privacy policy",
      link: "/privacy-policy",
    },
  };
};

export default PrivacyPolicy;
