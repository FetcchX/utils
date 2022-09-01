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