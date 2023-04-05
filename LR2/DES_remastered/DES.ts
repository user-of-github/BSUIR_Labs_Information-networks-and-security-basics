export class DES {
    private static readonly zeroBit: '0' = '0'
    private static readonly oneBit: '1' = '1'

    private static readonly sizeOfBlock: number = 128

    private static readonly sizeOfChar: number = 16

    private static readonly shiftKey: number = 2

    private static readonly numberOfRounds: number = 16

    private static blocks: string[] = []

    private static readonly blankSymbol: string = '$'

    public static decrypt(message: string, key: string): string {
        return message
    }

    public static encrypt(sourceMessage: string, sourceKey: string): string {
        let message: string = DES.makeStringLengthMultipleOfBlockSize(sourceMessage)

        DES.splitStringIntoBlocks(message)

        const keyLength: number = message.length / (2 * DES.blocks.length)
        const alignedKey: string = DES.alignKey(sourceKey, keyLength)

        let key: string = DES.convertStringToBinaryFormat(alignedKey)

        for (let roundCounter: number = 0; roundCounter < DES.numberOfRounds; ++roundCounter) {
            for (let blockIndex: number = 0; blockIndex < DES.blocks.length; ++blockIndex)
                DES.blocks[blockIndex] = DES.encodeSingleBlockWithDESPerOneRound(DES.blocks[blockIndex], key)

            key = DES.transformKeyToNextRound(key)
        }

        const result: string = DES.blocks.join('')

        return DES.convertStringFromBinaryFormat(result)
    }

    private static encodeSingleBlockWithDESPerOneRound(block: string, key: string): string {
        const L0: string = block.slice(0, Math.ceil(block.length / 2))
        const R0: string = block.slice(Math.ceil(block.length / 2))

        return R0 + DES.performXOROperation(L0, DES.performXOROperation(R0, key))
    }

    private static transformKeyToNextRound(sourceKey: string): string {
        let response: string = String(sourceKey)

        for (let counter: number = 0; counter < DES.shiftKey; ++counter) {
            response = response[response.length - 1] + response
            response = response.slice(0, -1)
        }

        return response
    }

    private static performXOROperation(first: string, second: string): string {
        let response: string = ''

        if (first.length !== second.length)
            throw Error('performXOROperation: strings\' lengthes do not match')

        for (let index = 0; index < first.length; ++index)
            response += first[index] !== second[index] ? '1' : '0'

        return response
    }


    private static makeStringLengthMultipleOfBlockSize(source: string): string {
        let response: string = source

        while (response.length * DES.sizeOfChar % DES.sizeOfBlock != 0)
            response += DES.blankSymbol

        return response
    }

    private static splitStringIntoBlocks(source: string): void {
        this.blocks = Array<string>(source.length * DES.sizeOfChar / DES.sizeOfBlock)

        const lengthOfBlock: number = source.length / this.blocks.length

        for (let index: number = 0; index < DES.blocks.length; ++index) {
            const subBlock: string = source.slice(index * lengthOfBlock, index * lengthOfBlock + lengthOfBlock)
            DES.blocks[index] = DES.convertStringToBinaryFormat(subBlock)
        }
    }

    private static convertStringToBinaryFormat(source: string): string {
        let response: string = ''

        for (let index: number = 0; index < source.length; ++index) {
            let charBinary: string = source.charCodeAt(index).toString(2)

            while (charBinary.length < DES.sizeOfChar)
                charBinary = DES.zeroBit + charBinary

            response += charBinary
        }

        return response
    }

    private static convertStringFromBinaryFormat(sourceString: string) {
        let response: string = ''
        let source: string = sourceString

        while (source.length > 0) {
            const symbolCodeBinary: string = source.slice(0, DES.sizeOfChar)
            source = source.slice(DES.sizeOfChar)

            const symbolCodeDecimal: number = Number.parseInt(symbolCodeBinary, 2)

            response += String.fromCharCode(symbolCodeDecimal)
        }

        return response
    }

    private static alignKey(source: string, keyLength: number): string {
        let response: string = source

        if (source.length > keyLength)
            response = response.slice(0, keyLength)
        else

            while (response.length < keyLength)
                response = DES.zeroBit + response

        return response
    }
}
