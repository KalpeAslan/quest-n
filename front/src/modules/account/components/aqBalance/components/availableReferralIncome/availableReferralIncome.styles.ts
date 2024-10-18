import { Button } from "@/components/UI/button";
import styled from "@emotion/styled";

export const AvailableReferralIncomeWrapper = styled.section`
  padding: 16px;
  background: rgb(135 246 150 / 5%);
  border-radius: 16px;

  .header {
    display: flex;
    justify-content: space-between;
  }

  .title {
    display: inline-flex;
    align-items: flex-start;
  }

  .button {
    width: 100%;
    padding: 7px 12px;
    font-size: 14px;
    line-height: 16.1px;
  }
`;

export const AccountButton = styled(Button)`
  width: 100%;
  margin-top: 16px;
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  height: 37px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const AccountLink = styled(Button)`
  margin: 0 auto;
  margin-top: 16px;
  width: fit-content;
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
`;
