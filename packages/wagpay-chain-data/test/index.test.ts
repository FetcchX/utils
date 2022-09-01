import { chainData } from "../src"

const main = () => {
    chainData.map(chain => {
        console.log(chain.nativeCurrency.name)
    })
}

main()