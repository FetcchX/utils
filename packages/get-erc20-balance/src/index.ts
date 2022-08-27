import { ethers } from 'ethers'
import { writeFileSync } from 'fs'

import abi from "./abi.json"

// this function will come from @wagpay/chain-data
export const getChainData = (chain: string): string => {
    return ""
}

export interface ExtraConfig {
    startBlock: number
    endBlock: number
    rpcUrl: string
    paginateLimit: number
}

export const getErc20Balance = async (userAddress: string, tokenAddress: string, chain: string, extraConfig: ExtraConfig) => {
    const chainData: any = getChainData(chain)

    const provider = ethers.getDefaultProvider(extraConfig.rpcUrl)

    // 1. Loop over transactions in token address from startBlock to endBlock
    // 2. Check if from or to is the given address
    // 3. Keep a variable and deduct or add balance accordingly

    const contract = new ethers.Contract(tokenAddress, abi, provider)

    let balance: { [key: string]: number } = {}

    if(extraConfig.paginateLimit > 0 && extraConfig.endBlock - extraConfig.startBlock > extraConfig.paginateLimit) {
        let currentBlock = extraConfig.startBlock

        while(currentBlock < extraConfig.endBlock) {
            let endCurrBlock = extraConfig.paginateLimit + currentBlock
            console.log(`started block ${currentBlock} - ${endCurrBlock}`)

            const events = await contract.queryFilter("*", currentBlock, endCurrBlock)

            events.map(event => {
                const args = event.args
                
                if(args) {
                    const from = args.from
                    const to = args.to
                    const value = Number(ethers.utils.formatUnits(args.value, 6).toString())

                    console.log("event logged")

                    if(!balance[from]) balance[from] = -value
                    else balance[from] -= value

                    if(!balance[to]) balance[to] = value
                    else balance[to] += value
                }
            })
            console.log(`ended block ${currentBlock} - ${endCurrBlock}`)

            currentBlock += (extraConfig.paginateLimit + 1)
        }
    }

    console.log(balance)

    return balance
}


getErc20Balance("0x0a59649758aa4d66e25f08dd01271e891fe52199", "0x925e9A45C2B576D6AE81d0C4fD57241c7B7364Ed", "1", {
    startBlock: 27783283,
    endBlock: 27783558,
    rpcUrl: 'https://polygon-mumbai.g.alchemy.com/v2/Tv9MYE2mD4zn3ziBLd6S94HvLLjTocju',
    paginateLimit: 100
}).then(a => console.log(a)).catch(e => console.error(e))