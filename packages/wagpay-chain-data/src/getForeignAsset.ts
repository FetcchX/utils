import { getToken, getTokenByName } from ".";

const chain_id: any = {
  "1": "1",
  "2": "137",
  "3": "43114",
  "4": "56",
};

export const getForeignAsset = (
  token_address: string,
  from_chain: string,
  to_chain: string
) => {
  const token = getToken(token_address, from_chain);

  if (token.extensions) {
    if (token.extensions.bridgeInfo) {
      const t = token.extensions.bridgeInfo[chain_id[to_chain]];

      if (t) {
        return t.tokenAddress;
      }
    }
  }

  return to_chain === "3"
    ? getTokenByName("BUSD", to_chain).address
    : getTokenByName("USDC", to_chain).address;
};
