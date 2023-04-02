const ALPHABET: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'


const encryptByCaesar = (message: string, key: number): string => {
    const transformLetter = (initial: string): string => {
        const initialIndex: number = ALPHABET.indexOf(initial)
        if (initialIndex === -1) {
            return initial
        }

        return ALPHABET[(initialIndex + key) % ALPHABET.length]
    }

    return Array.from(message).map((symbol: string): string => transformLetter(symbol)).join('')
}

const decryptFromCaesar = (encryptedMessage: string, key: number): string => {
    const transformLetter = (initial: string): string => {
        const initialIndex: number = ALPHABET.indexOf(initial)
        if (initialIndex === -1) {
            return initial
        }
        
        return ALPHABET[(initialIndex + ALPHABET.length - key) % ALPHABET.length]
    }

    return Array.from(encryptedMessage).map((symbol: string): string => transformLetter(symbol)).join('')
}


const main = (): void => {
    const testMessage: string = 'TEST MESSAGE !'.toUpperCase()

    const encrypted: string = encryptByCaesar(testMessage, 2)
    const decrypted: string = decryptFromCaesar(encrypted, 2)

    console.log(encrypted)
    console.log(decrypted)
}

main()