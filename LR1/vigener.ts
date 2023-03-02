const ALPHABET: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'


const generateFullKey = (initialKey: string, length: number): string => {
    let response: string = ''

    while (response.length < length) {
        response += initialKey
    }

    response = response.slice(0, length)

    return response
}


const encryptByVigener = (message: string, fullKey: string): string => {
    const transformLetter = (symbol: string, index: number): string => {
        const initialIndex: number = ALPHABET.indexOf(symbol)

        if (initialIndex === -1) {
            return symbol
        }

        const shiftValue: number = ALPHABET.indexOf(fullKey[index])
        const finalIndex: number = (initialIndex + shiftValue) % ALPHABET.length
        return ALPHABET[finalIndex]
    }

    return [...message].map(transformLetter).join('')
}

const decryptFromVigener = (message: string, fullKey: string): string => {
    const transformLetter = (symbol: string, index: number): string => {
        const initialIndex: number = ALPHABET.indexOf(symbol)

        if (initialIndex === -1) {
            return symbol
        }

        const shiftValue: number = ALPHABET.indexOf(fullKey[index])
        
        const finalIndex: number = (initialIndex + ALPHABET.length - shiftValue) % ALPHABET.length
        
        return ALPHABET[finalIndex]
    }

    return [...message].map(transformLetter).join('')
}


const main = (): void => {
    const baseKey: string = 'LEMON'
    
    const message: string = 'ATTACK AT DAWN'
    const fullKey: string = generateFullKey(baseKey, message.length)

    const encrypted: string = encryptByVigener(message, fullKey)
    console.log(encrypted)

    const decrypted: string = decryptFromVigener(encrypted, fullKey)
    console.log(decrypted)
}


main()