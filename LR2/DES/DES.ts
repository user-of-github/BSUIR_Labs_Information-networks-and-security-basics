export class DES {
    private static readonly zeroBit: '0' = '0';
    private static readonly oneBit: '1' = '1';

    private static readonly sizeOfBlock: number = 128;

    private static readonly sizeOfChar: number = 16;

    private static readonly shiftKey: number = 2;

    private static readonly numberOfRounds: number = 16;

    private static blocks: string[] = [];

    private static readonly blankSymbol: string = '#';

    public static encrypt(sourceMessage: string, sourceKey: string): string {
        let message: string = DES.makeStringLengthMultipleOfBlockSize(sourceMessage);

        DES.splitStringIntoBlocks(message);

        const keyLength: number = message.length / (2 * DES.blocks.length);
        const alignedKey: string = DES.alignKey(sourceKey, keyLength);

        let key: string = DES.convertStringToBinaryFormat(alignedKey);


        for (let roundCounter: number = 0; roundCounter < DES.numberOfRounds; ++roundCounter) {
            for (let blockIndex: number = 0; blockIndex < DES.blocks.length; ++blockIndex) {
                //console.log('Block #', blockIndex, ' ', DES.blocks[blockIndex])
                DES.blocks[blockIndex] = DES.encodeSingleBlockWithDESPerOneRound(DES.blocks[blockIndex], key);
            }

            key = DES.transformKeyToNextRound(key);
        }

        const resultRaw: string = DES.blocks.join('');
        const result: number[] = DES.convertStringFromBinaryFormatToDecimalBytesArray(resultRaw);

        return String.fromCharCode(...result);
    }

    public static decrypt(encryptedMessageSource: string, keySource: string): string {
        let key: string = DES.getDecryptionKey(encryptedMessageSource, keySource);
        const message: string = DES.convertStringToBinaryFormat(encryptedMessageSource);

        DES.cutBinaryStringIntoBlocks(message);

        for (let roundsCount: number = 0; roundsCount < DES.numberOfRounds; ++roundsCount) {
            for (let blockIndex: number = 0; blockIndex < DES.blocks.length; ++blockIndex) {
                DES.blocks[blockIndex] = DES.decodeSingleBlockFromDESPerOneRound(DES.blocks[blockIndex], key);
            }

            key = DES.transformKeyToPreviousRound(key);
        }

        const binaryResponse: string = DES.blocks.join('');

        return DES.convertStringFromBinaryFormat(binaryResponse);
    }

    private static encodeSingleBlockWithDESPerOneRound(block: string, key: string): string {
        const L0: string = block.slice(0, Math.ceil(block.length / 2));
        const R0: string = block.slice(Math.ceil(block.length / 2));

        return R0 + DES.performXOROperation(L0, DES.performXOROperation(R0, key));
    }

    private static decodeSingleBlockFromDESPerOneRound(block: string, key: string): string {
        const L0: string = block.slice(0, Math.ceil(block.length / 2));
        const R0: string = block.slice(Math.ceil(block.length / 2));

        return DES.performXOROperation(DES.performXOROperation(L0, key), R0) + L0;
    }

    private static transformKeyToNextRound(sourceKey: string): string {
        let response: string = String(sourceKey);

        for (let counter: number = 0; counter < DES.shiftKey; ++counter) {
            response = response[response.length - 1] + response;
            response = response.slice(0, -1);
        }

        return response;
    }

    private static performXOROperation(first: string, second: string): string {
        let response: string = '';

        if (first.length !== second.length)
            throw Error('performXOROperation: strings\' lengthes do not match');

        for (let index = 0; index < first.length; ++index)
            response += first[index] !== second[index] ? DES.oneBit : DES.zeroBit;

        return response;
    }


    private static makeStringLengthMultipleOfBlockSize(source: string): string {
        let response: string = source;

        while (response.length * DES.sizeOfChar % DES.sizeOfBlock != 0)
            response += DES.blankSymbol;

        return response;
    }

    private static splitStringIntoBlocks(source: string): void {
        this.blocks = new Array<string>(source.length * DES.sizeOfChar / DES.sizeOfBlock).fill('');

        const lengthOfBlock: number = source.length / this.blocks.length;

        for (let index: number = 0; index < DES.blocks.length; ++index) {
            const subBlock: string = source.slice(index * lengthOfBlock, index * lengthOfBlock + lengthOfBlock);
            //console.log('SUBBLOCK', subBlock)
            DES.blocks[index] = DES.convertStringToBinaryFormat(subBlock);
            console.log('SUBBLOCK ', DES.blocks[index]);
        }
    }

    private static convertStringToBinaryFormat(source: string): string {
        let response: string = '';

        for (let index: number = 0; index < source.length; ++index) {
            let charBinary: string = source.charCodeAt(index).toString(2);

            while (charBinary.length < DES.sizeOfChar)
                charBinary = DES.zeroBit + charBinary;

            response += charBinary;
        }

        return response;
    }

    private static convertBytesDecimalArrayToBinaryFormat(source: number[]): string {
        let response: string = '';

        for (let index: number = 0; index < source.length; ++index) {
            let charBinary: string = source[index].toString(2);

            while (charBinary.length < DES.sizeOfChar)
                charBinary = DES.zeroBit + charBinary;

            response += charBinary;
        }

        return response;
    }

    private static convertStringFromBinaryFormatToDecimalBytesArray(sourceString: string): number[] {
        let response: number[] = [];
        let source: string = sourceString;

        while (source.length > 0) {
            const symbolCodeBinary: string = source.slice(0, DES.sizeOfChar);
            source = source.slice(DES.sizeOfChar);

            const symbolCodeDecimal: number = Number.parseInt(symbolCodeBinary, 2);

            //console.log(symbolCodeDecimal)
            response.push(symbolCodeDecimal);
        }

        return response;
    }

    private static convertStringFromBinaryFormat(sourceString: string) {
        let response: string = '';
        let source: string = sourceString;

        while (source.length > 0) {
            const symbolCodeBinary: string = source.slice(0, DES.sizeOfChar);
            source = source.slice(DES.sizeOfChar);

            const symbolCodeDecimal: number = Number.parseInt(symbolCodeBinary, 2);

            //console.log(symbolCodeDecimal)
            response += String.fromCharCode(symbolCodeDecimal);
        }

        return response;
    }

    private static alignKey(source: string, keyLength: number): string {
        let response: string = source;

        if (source.length > keyLength)
            response = response.slice(0, keyLength);
        else

            while (response.length < keyLength)
                response = DES.zeroBit + response;

        return response;
    }

    private static getDecryptionKey(messageEncrypted: string, keySource: string) {
        let message: string = DES.makeStringLengthMultipleOfBlockSize(messageEncrypted);

        DES.splitStringIntoBlocks(message);

        let key: string = DES.alignKey(keySource, message.length / (2 * DES.blocks.length));
        key = DES.convertStringToBinaryFormat(key);

        for (let counter: number = 0; counter < DES.numberOfRounds; ++counter)
            key = DES.transformKeyToNextRound(key);


        return DES.transformKeyToPreviousRound(key);
    }

    private static transformKeyToPreviousRound(keySource: string): string {
        let response: string = keySource;
        for (let counter: number = 0; counter < DES.shiftKey; ++counter) {
            response += response[0];
            response = response.slice(1);
        }

        return response;
    }

    private static cutBinaryStringIntoBlocks(input: string): void {
        DES.blocks = new Array<string>(Math.ceil(input.length / DES.sizeOfBlock)).fill('');

        const lengthOfBlock: number = Math.ceil(input.length / DES.blocks.length);

        for (let blockIndex: number = 0; blockIndex < DES.blocks.length; ++blockIndex) {
            DES.blocks[blockIndex] = input.slice(blockIndex * lengthOfBlock, blockIndex * lengthOfBlock + lengthOfBlock);
        }
    }

    private static cutSymbolsFromStartAndEndOfString(sourceString: string, symbol: string): string {
        let response: string = String(sourceString);

        while (response.length > 0 && response[0] === symbol)
            response = response.slice(1);

        while (response.length > 0 && response[response.length - 1] === symbol)
            response = response.slice(0, -1);

        return response;
    }
}


const message = 'message';
const key = 'key';


const encrypted: string = DES.encrypt(message, key);
const decrypted = DES.decrypt(encrypted, key);

//console.log('ENCRYPTED: ', encrypted)
//console.log('ENCRYPTED BYTES: ', Array.from(encrypted).map(symbol => symbol.charCodeAt(0)))
console.log(decrypted);
