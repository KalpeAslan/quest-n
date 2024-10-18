import { useState } from "react";
import { accountService } from "@api";
import { LoggerService } from "@services";

import { InitStep } from "./components/initStep";
import { DeletePopup } from "./components/deletePopup";
import { TwoFactorFirstStep } from "./components/2faFirstStep";
import { TwoFactorSecondStep } from "./components/2faSecondStep";
import { LimitMessage } from "../limitMessage";
import { useRouter } from "next/router";
import { useAppDispatch } from "@hooks/useAppDispatch";
import { disconnectAccountThunk } from "@modules/account/store/account.thunks";
import { useWalletConnect } from "@/hooks";

const Delete = () => {
  const { push } = useRouter();
  const dispatch = useAppDispatch();
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(true);
  const [isReqError, setIsReqError] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<"init" | "code" | "confirm">(
    "init",
  );
  const [currentDate, setCurrentDate] = useState<number | null>(null);
  const [deleteToken, setDeleteToken] = useState<number | null>(null);

  const { disconnect: disconnectWallet } = useWalletConnect();

  const deleteUser = async () => {
    setIsLoaded(false);

    try {
      await accountService.deleteInvestor({
        deleteToken: deleteToken,
      });

      await disconnectWallet();
      dispatch(disconnectAccountThunk());

      push("/");
    } catch (err: any) {
      LoggerService.error("Error during delete account", err);
    } finally {
      setIsLoaded(true);
    }
  };

  return (
    <>
      {currentStep === "init" && (
        <InitStep
          setIsPopupOpen={setIsPopupOpen}
          setCurrentStep={setCurrentStep}
          isLoaded={isLoaded}
        />
      )}

      {currentStep === "code" && (
        <TwoFactorFirstStep
          setIsReqError={setIsReqError}
          setCurrentStep={setCurrentStep}
          setCurrentDate={setCurrentDate}
        />
      )}

      {currentStep === "confirm" && (
        <TwoFactorSecondStep
          currentDate={currentDate}
          setIsReqError={setIsReqError}
          setCurrentStep={setCurrentStep}
          setCurrentDate={setCurrentDate}
          setIsPopupOpen={setIsPopupOpen}
          setDeleteToken={setDeleteToken}
        />
      )}

      <DeletePopup
        isPopupOpen={isPopupOpen}
        setIsPopupOpen={setIsPopupOpen}
        handleDelete={deleteUser}
        handleCancelDelete={() => setCurrentStep("init")}
      />

      {isReqError && <LimitMessage />}
    </>
  );
};

export default Delete;
