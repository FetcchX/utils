import chains from "../chain.json";
import { tokens } from "../tokens";

export interface Token {
  name: string;
  symbol: string;
  decimals: number;
}

export interface Explorer {
  name: string;
  url: string;
  standard: string;
}

export interface Chain {
  internalId: number;
  chainId: number;
  name: string;
  icon: string;
  explorers: Explorer[];
  chainType: string;
  rpcUrls: string[];
  tokens: { [key: string]: Token };
  nativeCurrency: Token;
  faucet: string;
  shortName: string;
}

export const chainData: Chain[] = chains as unknown as Chain[];

export const getChain = (params: { internalId?: number; chainId?: number }) => {
  if (!params.internalId && !params.chainId) {
    throw "either send internalId or chainId";
  }

  if (params.internalId) {
    return chainData.find((chain) => chain.internalId === params.internalId);
  } else {
    return chainData.find((chain) => chain.chainId === params.chainId);
  }
};

export const getChains = () => {
  return chainData;
};

export const getTokens = (internalId?: number) => {
  if (!internalId) {
    return tokens;
  }
  return tokens[internalId];
};

export const getTokenByName = (name: string, chain: string) => {
    const tokens = getTokens(Number(chain))

    return tokens.find((t: any) => t.symbol === name)
}

export const getToken = (address: string, chain: string) => {
  const allTokens = tokens[chain];

  return allTokens.find(
    (token: any) => token.address.toLowerCase() === address.toLowerCase()
  );
};

export * from "./getForeignAsset";
export * from "./getInternalChainId";
