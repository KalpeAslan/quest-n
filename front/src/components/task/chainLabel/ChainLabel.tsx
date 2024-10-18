import { ILoyaltyTask, ENetworks } from "@models";
import { Box, BoxProps } from "@mui/material";
import Icon from "@components/UI/icon/Icon";

interface IProps extends BoxProps {
  task: ILoyaltyTask;
}

const ChainLabel = ({ task, ...boxProps }: IProps) => {
  return (
    <Box
      my={1}
      bgcolor={"rgba(255, 255, 255, 0.1)"}
      display={"flex"}
      borderRadius={24}
      justifyContent={"center"}
      alignItems={"center"}
      p={1}
      sx={{
        "span::first-letter": {
          textTransform: "uppercase",
        },
      }}
      {...boxProps}
    >
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        sx={{
          borderRadius: "50%",
          height: 24,
          width: 24,
          background: "var(--color-gr2)",
        }}
      >
        <Icon name={`${getNetworkName(task.body.chainId)}-icon`} />
      </Box>
      <span style={{ marginLeft: 8 }} className={"c-font-14-20"}>
        {getNetworkName(task.body.chainId)}
      </span>
    </Box>
  );
};

function getNetworkName(chainId: string): string | undefined {
  switch (chainId) {
    case ENetworks.Ethereum:
    case ENetworks.Goerli:
      return "ethereum";
    case ENetworks.Polygon:
      return "polygon";
    case ENetworks.BNB:
      return "BNB";
    case ENetworks.Avalanche:
      return "avalanche";
    case ENetworks.Arbitrum:
    case ENetworks.GoerliArbitrum:
      return "arbitrum";
    case ENetworks.Optimism:
      return "optimism";
    case ENetworks.KCC:
      return "kcc";
    case ENetworks.OKT:
      return "okt";
    case ENetworks.Goerli:
      return "ethereum";
    case ENetworks.Mumbai:
      return "polygon";
    case ENetworks.BitGert:
      return "bitGert";
    case ENetworks.ZetaChain:
      return "zetaChain";
    case ENetworks.Aurora:
      return "aurora";
    default:
      return chainId;
  }
}
export default ChainLabel;
