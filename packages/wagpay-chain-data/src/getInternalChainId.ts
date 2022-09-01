export const getInternalChainId = (chainId: number) => {
    switch(chainId) {
        case 1:
            return 1
        case 137:
            return 2
        case 56:
            return 3
        case 43114:
            return 4
        case 10:
            return 6
        case 42161:
            return 7
        default:
            throw "Chain not found"
    }
}