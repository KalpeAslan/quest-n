export const hideWallet = (wallet: string) => wallet.slice(0, 4) + '****' + wallet.slice(wallet.length - 4);
