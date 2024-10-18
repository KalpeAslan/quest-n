import { contractService } from "@/api";
import { CHAINS, CHAIN_OPTIONS_FOR_ONCHAIN, ETokenStandard } from "@/models";
import { t } from "@lingui/macro";
import { useFormik } from "formik";
import {
  Dispatch,
  FocusEvent,
  MouseEvent,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { fromHex } from "viem";
import {
  useAccount,
  useConnect,
  useNetwork,
  usePublicClient,
  useSwitchNetwork,
  useWalletClient,
} from "wagmi";
import { object, string } from "yup";
import { DEPLOYER_ABI } from "../components/createQuestSteps/RewardsStep/rewards.constants";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getAccountInfo } from "@/modules/account/store/account.selector";

interface FormFields {
  name: string;
  symbol: string;
  chainId: `0x${string}`;
}

const initialValues: FormFields = {
  name: "",
  symbol: "",
  chainId: CHAIN_OPTIONS_FOR_ONCHAIN[0].value as `0x${string}`,
};

const initialErrors = {
  name: "",
  symbol: "",
  chainId: "",
};

interface Props {
  getNftCollections: () => Promise<void>;
  setChosenCollection: (value: number) => void;
  setIsCreateNftFlow: Dispatch<SetStateAction<boolean>>;
}

export const useDeployNftCollection = ({
  getNftCollections,
  setChosenCollection,
  setIsCreateNftFlow,
}: Props) => {
  const [promptOpen, setPromptOpen] = useState(false);
  const [transferable, setTransferable] = useState(true);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [acceptedFile, setAcceptedFile] = useState<null | File>(null);
  const [isDeployLoading, setIsDeployLoading] = useState(false);
  const [isWalletPopupOpen, setIsWalletPopupOpen] = useState(false);
  const [chainToConnect, setChainToConnect] = useState<null | `0x${string}`>(
    null,
  );
  const [popupData, setPopupData] = useState<null | {
    id: number;
    address: string;
    image: string;
    chain: string;
  }>(null);

  const publicClient = usePublicClient();
  const walletClient = useWalletClient();
  const { isLoading: isConnectLoading } = useConnect();
  const { isConnected, address } = useAccount();
  const { chain, chains } = useNetwork();
  const { isLoading: isNetworkLoading } = useSwitchNetwork();

  const { wallet } = useTypedSelector(getAccountInfo);

  const needConnect = useMemo(
    () =>
      !isConnected ||
      !wallet ||
      address.toLocaleLowerCase() !== wallet.toLocaleLowerCase(),
    [address, isConnected, wallet],
  );

  const needSwitchChain = useMemo(
    () => !chainToConnect || chain?.id !== fromHex(chainToConnect, "number"),
    [chain?.id, chainToConnect],
  );

  const removeLogo = useCallback((e?: MouseEvent<HTMLDivElement>) => {
    if (e) {
      e.stopPropagation();
    }
    setAcceptedFile(null);
    setIsLogoHovered(false);
  }, []);

  const formSchema = object({
    name: string()
      .trim()
      .max(
        25,
        t({
          id: "sWCTK2PNS4xoi7SwVDLCsn-quest",
          message: "Max length is 25 characters",
        }),
      )
      .required(
        t({
          id: "pcrMzQr2vmsbgv7JbxzVwP-quest",
          message: "Name is required",
        }),
      ),
    symbol: string()
      .trim()
      .max(
        5,
        t({
          id: "g9wkPbCoy925wEJNcgSuVS-quest",
          message: "Max length is 5 characters",
        }),
      )
      .required(
        t({
          id: "7xP4UtSv3xYPZFpTtKSGSh-quest",
          message: "Symbol is required",
        }),
      ),
    chainId: string(),
  });

  const onSubmit = useCallback(
    async (data: FormFields) => {
      if (!CHAINS[data.chainId]) return;

      if (needConnect || needSwitchChain) {
        setIsWalletPopupOpen(true);
        setChainToConnect(data.chainId);
        return;
      }

      setIsDeployLoading(true);

      try {
        if (!walletClient || !publicClient || !chain) return;

        const res = await contractService.createNftContract(
          { ...data, transferable, standard: ETokenStandard.ERC721 },
          acceptedFile,
        );

        const {
          userId_,
          collectionId_,
          name_,
          symbol_,
          baseUri_,
          transferable_,
          signature_,
        } = res.data;

        const { request } = await publicClient.simulateContract({
          abi: DEPLOYER_ABI,
          address: CHAINS[data.chainId].deployer,
          functionName: "deploy",
          chain: chains.find(
            item => item.id === fromHex(data.chainId, "number"),
          ),
          args: [
            userId_,
            collectionId_,
            name_,
            symbol_,
            baseUri_,
            transferable_,
            signature_,
          ],
        });

        await walletClient.data.writeContract(request);

        const collectionData = await new Promise(resolve => {
          const interval = setInterval(async () => {
            const verifyResult = await contractService.verifyContracts();

            const collectionData = verifyResult.data[data.chainId].find(
              item => item[0] === res.data.collectionId_,
            );

            if (!collectionData) return;

            clearInterval(interval);
            resolve(collectionData);
          }, 2000);
        });

        setPopupData({
          id: res.data.collectionId_,
          address: collectionData[1],
          image: URL.createObjectURL(acceptedFile),
          chain: data.chainId,
        });
      } catch (error) {
        console.log(error);
      } finally {
        setIsDeployLoading(false);
      }
    },
    [
      acceptedFile,
      chain,
      chains,
      needConnect,
      needSwitchChain,
      publicClient,
      transferable,
      walletClient,
    ],
  );

  const formik = useFormik<FormFields>({
    initialValues,
    initialErrors,
    validateOnBlur: false,
    validationSchema: formSchema,
    onSubmit,
  });

  const onBlur = (e: FocusEvent<HTMLInputElement>) => {
    formik.setTouched({ ...formik.touched, [e.target.name]: true });
  };

  const getError = useCallback(
    (name: keyof typeof formik.errors) => ({
      error: Boolean(formik.touched[name] && formik.errors[name]),
      errorText: formik.touched[name] ? formik.errors[name] : "",
    }),
    [formik],
  );

  const isDisabled = useMemo(
    () => Boolean(!acceptedFile || formik.errors.name || formik.errors.symbol),
    [acceptedFile, formik.errors.name, formik.errors.symbol],
  );

  const isLoading = useMemo(
    () => isDeployLoading || isConnectLoading || isNetworkLoading,
    [isConnectLoading, isDeployLoading, isNetworkLoading],
  );

  const buttonName = useMemo(() => {
    if (needConnect) {
      return "Connect wallet";
    }
    if (needSwitchChain) {
      return "Switch chain";
    }
    if (isDeployLoading)
      return t({ id: "a3fiZUdepaGkaqGd8WWHqH-quest", message: "Confirming" });
    return t({
      id: "3RVhgSgJpLmy2swtX9WgSs-quest",
      message: "Deploy new NFT Collection",
    });
  }, [isDeployLoading, needConnect, needSwitchChain]);

  const onContinue = useCallback(async () => {
    if (!popupData.id && popupData.id !== 0) return;

    await getNftCollections();

    setChosenCollection(popupData.id);
    setIsCreateNftFlow(true);

    formik.resetForm();
    removeLogo();
    setTransferable(true);
  }, [
    formik,
    getNftCollections,
    popupData?.id,
    removeLogo,
    setChosenCollection,
    setIsCreateNftFlow,
  ]);

  return {
    formik,
    promptOpen,
    setPromptOpen,
    acceptedFile,
    setAcceptedFile,
    removeLogo,
    isLogoHovered,
    setIsLogoHovered,
    onBlur,
    getError,
    setTransferable,
    transferable,
    isDisabled,
    isLoading,
    buttonName,
    isWalletPopupOpen,
    isConnected,
    chain,
    chainToConnect,
    setIsWalletPopupOpen,
    needConnect,
    needSwitchChain,
    setPopupData,
    popupData,
    onContinue,
  };
};
