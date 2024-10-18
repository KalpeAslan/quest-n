import { Box } from "@mui/material";
import { t, Trans } from "@lingui/macro";

import { Table } from "@components/UI/table";
import { HelperService } from "@services";
import { ITableColumn } from "@models";

import img1 from "@assets/images/referral/referrals/1.webp";
import img2 from "@assets/images/referral/referrals/2.webp";
import img3 from "@assets/images/referral/referrals/3.webp";
import img4 from "@assets/images/referral/referrals/4.webp";
import img5 from "@assets/images/referral/referrals/5.webp";
import { BestReferralsWrapper, InfoWrapper } from "./bestReferrals.styles";
import Image from "next/image";

interface Item {
  referrals: number;
  image: string;
  earn: number;
}

const BestReferrals = () => {
  const values = [
    {
      referrals: 1593,
      image: img1,
      earn: 216.04,
    },
    {
      referrals: 1593,
      image: img2,
      earn: 216.04,
    },
    {
      referrals: 996,
      image: img3,
      earn: 137.86,
    },
    {
      referrals: 402,
      image: img4,
      earn: 97.58,
    },
    {
      referrals: 254,
      image: img5,
      earn: 34.29,
    },
  ];

  const columns: ITableColumn<Item>[] = [
    {
      header: t({ id: "dfdBK9rFK9fUcHbsTKjdkS-account", message: "Referrals" }),
      render: ({ referrals, image }: Item) => (
        <InfoWrapper>
          <Box className="image" mr={1}>
            <Image src={image} title="Best Referral" alt="Best Referral" />
          </Box>

          <p className="table-content">
            {HelperService.addNumberSeparator(referrals)}
          </p>
        </InfoWrapper>
      ),
      width: "50%",
      align: "center",
    },
    {
      header: t({ id: "jg3THdQaEPUDjGmjsBKaT2-account", message: "Earn" }),
      render: ({ earn }: Item) => (
        <p className="table-content">
          {HelperService.addNumberSeparator(earn)} AQ
          <Box className="c-font-color-2" component="span" ml={0.5}>
            (${HelperService.addNumberSeparator(earn)})
          </Box>
        </p>
      ),
      width: "50%",
      align: "center",
    },
  ];

  return (
    <BestReferralsWrapper>
      <Box className="c-font-12-16 c-font-color">
        <Trans id="5qPW5zgTALmajDUAj6ZfEC-account">Best Referrals</Trans>
      </Box>

      <div className="table">
        <Table
          mobile={0}
          columns={columns}
          items={values}
          loaded={true}
          type="third"
        />
      </div>
    </BestReferralsWrapper>
  );
};

export default BestReferrals;
