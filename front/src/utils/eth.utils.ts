function shortenAddress(address: string, digits = 4): string {
  if (!address) return "";
  return `${address.slice(0, digits + 2)}...${address.slice(-digits)}`;
}
export default shortenAddress;
