import { getToken, getTokenByName, getChain } from ".";

export const getForeignAsset = (
  token_address: string,
  from_chain: string,
  to_chain: string
) => {
  const from_chain_id = getChain({
    internalId: Number(from_chain),
  })?.chainId;

  const to_chain_id = getChain({
    internalId: Number(to_chain),
  })?.chainId;

  const token =
    from_chain_id && getToken(token_address, from_chain_id.toString());

  if (token.extensions) {
    if (token.extensions.bridgeInfo) {
      const t = to_chain_id && token.extensions.bridgeInfo[to_chain_id];
      if (t) {
        return t.tokenAddress;
      }
    }
  }

  return to_chain === "3"
    ? getTokenByName("BUSD", to_chain).address
    : getTokenByName("USDC", to_chain).address;
};
