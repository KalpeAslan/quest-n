import { useEffect } from "react";
import { Box } from "@mui/material";
import { useContextSelector } from "use-context-selector";

import { Link } from "@components/UI/link";
import { Table } from "@components/UI/table";
import { ITableColumn } from "@models";
import { AppContext } from "@context";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";

interface IData {
  num: number;
  typeOfCookies: string;
  validity: string;
  dataType: string;
  purpose: string;
}

const CookiesPolicy = () => {
  const { pathname } = useRouter();
  const prevLocation = useContextSelector(
    AppContext,
    state => state.prevLocation,
  );

  const data = [
    {
      num: 1,
      typeOfCookies: "TARTEAUCITRON",
      validity: "13 months",
      dataType: "Setting visitor cookies",
      purpose: "Storage the user’s cookies settings",
    },
    {
      num: 2,
      typeOfCookies: "LANGUAGE",
      validity: "1 year",
      dataType: "Language preferences of visitors",
      purpose: "Storage the visitor’s language settings",
    },
    {
      num: 3,
      typeOfCookies: "_CFDUID",
      validity: "1 year",
      dataType: "Web traffic without personal data",
      purpose:
        "This Сookie belongs to CloudFare; identifies reliable web traffic and prevents malicious visitors",
    },
    {
      num: 4,
      typeOfCookies: "COUNTRY",
      validity: "30 days",
      dataType: "Visitor’s country and IP address",
      purpose:
        "Offerring a version of the site corresponding to the language and country of the visitor",
    },
    {
      num: 5,
      typeOfCookies: "_GA, _GID",
      validity: "2 years, 24 hours",
      dataType:
        "Visitor ID, browser type, time and date of interaction with website content",
      purpose:
        "Distinguishing visitors by assigning a randomly generated number as a visitor ID.",
    },
    {
      num: 6,
      typeOfCookies: "_GAT, __UTMT",
      validity: "1 minute, 10 minutes",
      dataType:
        "A random unique number or string of letters and numbers to identify the browser",
      purpose: "Reducing the load by identifying the browser.",
    },
    {
      num: 7,
      typeOfCookies: "__UTMA, __UTMB",
      validity: "2 years since last update, 30 minutes since last update",
      dataType:
        "Visitor ID, browser type, time and date of interaction with website content",
      purpose:
        "To distinguish visitors and sessions; updated each time when data is sent to Google Analytics. \n __utma is also used to track new and returning visitors.",
    },
    {
      num: 8,
      typeOfCookies: "__UTMZ",
      validity: "6 months since the last update",
      dataType:
        "The source of the traffic to the site, i.e. from where the visitor goes to our websites, the visitor’s device, company (if configured via a tracker or AdWords) and the visitor’s request",
      purpose:
        "Storage the traffic source or company that explains how the visitor went to the site. This cookie is updated each time when data is sent to Google Analytics.",
    },
    {
      num: 9,
      typeOfCookies: "__UTMC",
      validity: "before the end of the visitor’s session",
      dataType:
        "New sessions / visits by returning visitors, visitor ID, browser type, time and dates of interaction with website content",
      purpose:
        "Installed to enable compatibility with an older version of Google Analytics code known as Urchin.",
    },
    {
      num: 10,
      typeOfCookies: "_GAEXP",
      validity: "71 days",
      dataType:
        "Visitors’ participation in marketing experiments and visitors’ browser type",
      purpose:
        "Google Analytics uses this cookie to determine whether visitors participate in marketing experiments.",
    },
    {
      num: 11,
      typeOfCookies: "_GCL_AU",
      validity: "3 months",
      dataType:
        "Visitor ID, browser type, time and dates of interaction with advertising on the Websites",
      purpose:
        "Used by Google AdSense to evaluate the effectiveness of advertising on Websites that use its services",
    },
    {
      num: 12,
      typeOfCookies: "AJS_ANONYMOUS_ID",
      validity: "1 year",
      dataType: "Visitor ID and number of visits",
      purpose:
        "Providing information on whether the user has visited the site before and counting the number of visits.",
    },
    {
      num: 13,
      typeOfCookies: "AJD_GROUP_ID",
      validity: "1 year",
      dataType: "Visitor ID",
      purpose:
        "Used to identify a visitor’s visit and to group visits by different web visitors.",
    },
    {
      num: 14,
      typeOfCookies: "AJS_VISITOR_ID",
      validity: "1 year",
      dataType:
        "Visitor ID, browser type, time and dates of interaction with website content",
      purpose: "Collecting website usage data (targeted audience/advertising)",
    },
    {
      num: 15,
      typeOfCookies: "AMPLITUDE_ID",
      validity: "10 years",
      dataType:
        "Device ID, Visitor ID, Cookie ID, Interaction with Website Content",
      purpose:
        "This cookie uses a system of three identifiers to track visitors: Device ID, Visitor ID and Amplitude ID. First, Amplitude collects the Device ID and the Visitor ID, then creates an Amplitude ID that is used to track unique visitors across the Platform. The Amplitude ID stores all events (interactions with content) of anonymous visitors.",
    },
    {
      num: 16,
      typeOfCookies: "_HSSRC, _HSTC, HSFIRSTVISIT, HUBSPOTUTK, MESSAGE UTK",
      validity: "13 months",
      dataType:
        "Domains, number of sessions and visitors, utk, initial label (first visit), browser, time and dates of interaction with the contact form",
      purpose:
        "HubSpot Cookies are stored by Hotjar to track website user visits and the identity of the visitor. The utk cookies are also used to recognize visitors who chat using the streaming chat tool.",
    },
    {
      num: 17,
      typeOfCookies: "INTERCOM-*",
      validity: "9 months",
      dataType:
        "A unique application identifier that contains the domain and tracks messaging sessions",
      purpose:
        "The Intercom Cookies are stored by Hotjar for its live chat system. This cookie allows anonymous storage of information about visitors.",
    },
    {
      num: 18,
      typeOfCookies: "MP_*, MP_HJ_MIXPANEL",
      validity: "1 year",
      dataType:
        "Unique session identifier, number of visitors, traffic source and pages visited",
      purpose:
        "The Mixpanel Cookies are stored by Hotjar to track the visitor and collect information about the visitor`s use of the site.",
    },
    {
      num: 19,
      typeOfCookies: "_FBP",
      validity: "3 months",
      dataType: "Unique visitor ID and browser ID",
      purpose:
        "The Facebook Cookies are stored by Hotjar to provide a number of advertising products, such as real-time offers from third-party advertisers.",
    },
    {
      num: 20,
      typeOfCookies: "CONSENT",
      validity: "20 years",
      dataType: "Visitor consent",
      purpose: "To store the visitor’s consent to receive service Cookies.",
    },
    {
      num: 21,
      typeOfCookies: "_GA",
      validity: "2 years",
      dataType:
        "Visitor use of our websites, browser ID, time and date of interaction with website content",
      purpose:
        "An analytical Cookies used by YouTube to obtain statistical data about the visitor’s use of our websites.",
    },
    {
      num: 22,
      typeOfCookies:
        "APISID, ENABLEDAPPS.UPLOADER, HSID, LOGIN_INFO, SAPISID, SID, SSID, GEUP, PREF, VISITOR_INFO1_LIVE, YSC",
      validity:
        "2 years / 1 month / 2 years / 2 years / 2 years / 2 years / 2 years / 13 months / 2 years / 6 months",
      dataType:
        "Videos viewed by the visitor, bandwidth, unique identifier, playback preferences, language selection, number of searches, recent searches, previous interactions, used device, Google account, number of video views and settings used for playback.",
      purpose:
        "A set of Cookies that YouTube uses to collect information about visitor behaviour related to embedded videos.",
    },
    {
      num: 23,
      typeOfCookies: "_ga and _gid",
      validity: "2 years / 24 hours",
      dataType:
        "Visitor ID, browser ID, time and date of interaction with website content.",
      purpose:
        "Analytical Cookies used by Google services via Google reCAPTCHA to distinguish visitors and generate statistical data.",
    },
    {
      num: 24,
      typeOfCookies: "1P_JAR, AID, TAID, PAIDCONTENT",
      validity: "13 months / 18 months / 14 days / 2 months",
      dataType:
        "The visitor’s behaviour on the websites, such as the history of viewed pages, opened links, advertisements that the visitor saw before visiting our websites, and history from other devices on which the visitor logged in with a Google account.",
      purpose:
        "Advertising Cookies used by Google services via Google reCAPTCHA to track visitor behaviour and provide targeted advertising.",
    },
    {
      num: 25,
      typeOfCookies:
        "S, SSID, SNID, SID, SIDCC, SAPISID, NID, HSID, OGP, OGPC, CGIC, PL_GACID, WMC, OTZ, DV",
      validity:
        "Duration of session / 2 years / 1 year / 2 years / 15 months / 2 years / 27 months / 2 years / 6 months / 6 months",
      dataType:
        "Visitor preferences such as language, used device, unique identifier, recent searches or search results, website traffic information.",
      purpose:
        "Performance Cookies are used by Google to store data such as information about visitor preferences and to measure the functionality of reCAPTCHA Google module on websites.",
    },
    {
      num: 26,
      typeOfCookies: "CONSENT",
      validity: "20 years",
      dataType: "Visitor consent",
      purpose:
        "Performance Cookies are used by Google to store the visitor’s consent to the Cookies of its services.",
    },
  ];

  const columns: ITableColumn<IData>[] = [
    {
      header: "No.",
      render: ({ num }: IData) => {
        return <p className="table-content">{num}</p>;
      },
      width: "6%",
      align: "flex-start",
      verticalAlign: "flex-start",
    },
    {
      header: "Type of cookies",
      render: ({ typeOfCookies }: IData) => {
        return (
          <p className="table-content" style={{ overflowWrap: "anywhere" }}>
            {typeOfCookies}
          </p>
        );
      },
      width: "19%",
      align: "flex-start",
      verticalAlign: "flex-start",
    },
    {
      header: "Validity",
      render: ({ validity }: IData) => {
        return <p className="table-content">{validity}</p>;
      },
      width: "19%",
      align: "flex-start",
      verticalAlign: "flex-start",
    },
    {
      header: "Data type",
      render: ({ dataType }: IData) => {
        return <p className="table-content">{dataType}</p>;
      },
      width: "28%",
      align: "flex-start",
      verticalAlign: "flex-start",
    },
    {
      header: "Purpose",
      render: ({ purpose }: IData) => {
        return <p className="table-content">{purpose}</p>;
      },
      width: "28%",
      align: "flex-start",
      verticalAlign: "flex-start",
    },
  ];

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
          component="h1"
          className="c-font-32-38 c-sm-font-48-56 c-font-color"
          sx={{ mb: { xs: 3, sm: 4 }, mt: { xs: 3, sm: 5 }, fontWeight: 700 }}
        >
          {/* <Trans> */}Cookies policy{/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 4 }}
        >
          {/* <Trans> */}
          In this Cookies Policy (hereinafter referred to as the Policy), we
          will try to tell you in as much detail and information as possible
          what we use and why.
          {/* </Trans> */}
        </Box>

        <Box
          component="h2"
          className="c-font-20-24 c-sm-font-20-28 c-font-color"
          sx={{ mb: 1.25, fontWeight: 700 }}
        >
          1. {/* <Trans> */}What are Cookies?{/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          1.1. {/* <Trans> */}
          Cookies are small text files which are stored and/or read by your web
          browser on the hard drive of the device you use (such as a desktop
          computer, laptop or smartphone) by the websites you visit.
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          1.2. {/* <Trans> */}
          Cookies allow you to simplify the use of the site by recording data.
          Cookies store information about your preferences, for example, the
          language you use, geolocation, etc.
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 4 }}
        >
          1.3. {/* <Trans> */}
          Cookies have different types with different expiration dates.
          {/* </Trans> */}
        </Box>

        <Box
          component="h2"
          className="c-font-20-24 c-sm-font-20-28 c-font-color"
          sx={{ mb: 1.25, fontWeight: 700 }}
        >
          2. {/* <Trans> */}Consent to the use of Cookies{/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          2.1. {/* <Trans> */}
          When you visit our site, a window will appear with a link to the
          Cookies policy and a tag indicating that you agree to this policy. By
          putting the appropriate tag, you agree to the terms of this Policy.
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 4 }}
        >
          2.2. {/* <Trans> */}
          If you do not want us to use Cookies, you can turn them off in the
          browser you use.
          {/* </Trans> */}
        </Box>

        <Box
          component="h2"
          className="c-font-20-24 c-sm-font-20-28 c-font-color"
          sx={{ mb: 1.25, fontWeight: 700 }}
        >
          3. {/* <Trans> */}Cookies which are used{/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 4 }}
        >
          3.1. {/* <Trans> */}
          We use various types of Cookies, including those for which your
          consent is not required, but whose use must be notified.
          {/* </Trans> */}
        </Box>

        <Box
          component="h2"
          className="c-font-20-24 c-sm-font-20-28 c-font-color"
          sx={{ mb: 1.25, fontWeight: 700 }}
        >
          3.2 {/* <Trans> */}Primary technical Cookies:{/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 4 }}
        >
          {/* <Trans> */}
          Temporary or session Cookies: allow you to move from one page to
          another. Information about them is not stored on the user’s device and
          they disappear when the browser is closed. Persistent Cookies: are
          used exclusively to improve the speed of website browsing. They
          remember certain settings chosen by you (for example, language
          selection, city of residence, etc.). Such files are used to ensure
          convenient and efficient browsing, session stability, persistent login
          settings throughout the session and selected navigation country. They
          also remember the choices made by the user regarding the viewing of
          certain elements of the page.
          {/* </Trans> */}
        </Box>

        <Box
          component="h2"
          className="c-font-20-24 c-sm-font-20-28 c-font-color"
          sx={{ mb: 1.25, fontWeight: 700 }}
        >
          3.3. {/* <Trans> */}Third-party Cookies:{/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 4 }}
        >
          {/* <Trans> */}
          When using the site, there are some cookies that are not directly
          controlled and managed by us. This happens, for example, if you visit
          a page that has content from a third-party website. Accordingly, it
          should be taken into account that We are in no way involved in the
          processing of data collected with the help of this type of cookies,
          given its status as a mere technical intermediary.
          {/* </Trans> */}
        </Box>

        <Box
          component="h2"
          className="c-font-20-24 c-sm-font-20-28 c-font-color"
          sx={{ mb: 1.25, fontWeight: 700 }}
        >
          3.4. {/* <Trans> */}Analytical Cookies:{/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 4 }}
        >
          {/* <Trans> */}
          We use various services, including Google services, to collect
          statistical data (your IP address, browser information, information
          about the content you view, etc.).
          {/* </Trans> */}
        </Box>

        <Box
          component="h2"
          className="c-font-20-24 c-sm-font-20-28 c-font-color"
          sx={{ mb: 1.25, fontWeight: 700 }}
        >
          3.5. {/* <Trans> */}Marketing Cookies:{/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          {/* <Trans> */}
          Marketing Cookies are used to show you information that will be really
          useful and interesting for you.
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          3.6. {/* <Trans> */}
          All data will be processed using electronic tools, fully automated and
          without human intervention. Company employees will never have access
          to your personal data obtained with the help of cookies, which means
          that they will never be able to access and/or have direct personal
          identification information.
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 2 }}
        >
          3.7. {/* <Trans> */}
          If you want to know more, we have specially developed a table for you
          with detailed information about cookies that our site uses or can use.
          {/* </Trans> */}
        </Box>

        <Box sx={{ mb: 4 }}>
          <Table
            mobile={768}
            columns={columns}
            items={data}
            loaded={true}
            type="secondary"
            emptyTitle=""
          />
        </Box>

        <Box
          component="h2"
          className="c-font-20-24 c-sm-font-20-28 c-font-color"
          sx={{ mb: 1.25, fontWeight: 700 }}
        >
          4. {/* <Trans> */}How to refuse the use of Cookies{/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          4.1. {/* <Trans> */}
          You can refuse to save Cookies on your device at any time by following
          the instructions provided.
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          4.2 {/* <Trans> */}
          Cookie management depends on the type of browser you use. So that you
          do not have to search for information, we have found for you the
          instructions of the most popular browsers on how to manage cookie
          files:
          {/* </Trans> */}
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          <strong>
            {/* <Trans> */}Explorer:{/* </Trans> */}
          </strong>{" "}
          <Link
            href="https://bit.ly/3RW5coj"
            target="_blank"
            rel="noreferrer"
            underline="hover"
          >
            https://bit.ly/3RW5coj
          </Link>
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          <strong>
            {/* <Trans> */}Mozilla Firefox:{/* </Trans> */}
          </strong>{" "}
          <Link
            href="https://bit.ly/3luWGQV"
            target="_blank"
            rel="noreferrer"
            underline="hover"
          >
            https://bit.ly/3luWGQV
          </Link>
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          <strong>
            {/* <Trans> */}Google Chrome:{/* </Trans> */}
          </strong>{" "}
          <Link
            href="https://bit.ly/3xnBUFA"
            target="_blank"
            rel="noreferrer"
            underline="hover"
          >
            https://bit.ly/3xnBUFA
          </Link>
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 1 }}
        >
          <strong>
            {/* <Trans> */}Safari:{/* </Trans> */}
          </strong>{" "}
          <Link
            href="https://bit.ly/3HRREpa"
            target="_blank"
            rel="noreferrer"
            underline="hover"
          >
            https://bit.ly/3HRREpa
          </Link>
        </Box>

        <Box
          component="p"
          className="c-font-14-19 c-sm-font-16-22 c-font-color"
          sx={{ mb: 4 }}
        >
          <strong>
            {/* <Trans> */}Opera:{/* </Trans> */}
          </strong>{" "}
          <Link
            href="https://bit.ly/3lCw0O2"
            target="_blank"
            rel="noreferrer"
            underline="hover"
          >
            https://bit.ly/3lCw0O2
          </Link>
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
          {/* <Trans> */}
          and we will be happy to answer any questions you may have.
          {/* </Trans> */}
        </Box>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      title: "Cookies policy",
      link: "/cookies-policy",
    },
  };
};

export default CookiesPolicy;
