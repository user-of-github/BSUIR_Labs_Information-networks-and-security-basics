export class DesService {
    private static readonly zeroBit: '0' = '0';
    private static readonly oneBit: '1' = '1';

    private static readonly sizeOfBlock: number = 128;

    private static readonly sizeOfChar: number = 16;

    private static readonly shiftKey: number = 2;

    private static readonly numberOfRounds: number = 16;

    private static blocks: string[] = [];

    private static readonly blankSymbol: string = '#';

    public static encrypt(sourceMessage: string, sourceKey: string): string {
        let message: string = DesService.makeStringLengthMultipleOfBlockSize(sourceMessage);

        DesService.splitStringIntoBlocks(message);

        const keyLength: number = message.length / (2 * DesService.blocks.length);
        const alignedKey: string = DesService.alignKey(sourceKey, keyLength);

        let key: string = DesService.convertStringToBinaryFormat(alignedKey);


        for (let roundCounter: number = 0; roundCounter < DesService.numberOfRounds; ++roundCounter) {
            for (let blockIndex: number = 0; blockIndex < DesService.blocks.length; ++blockIndex) {
                //console.log('Block #', blockIndex, ' ', DES.blocks[blockIndex])
                DesService.blocks[blockIndex] = DesService.encodeSingleBlockWithDESPerOneRound(DesService.blocks[blockIndex], key);
            }

            key = DesService.transformKeyToNextRound(key);
        }

        const resultRaw: string = DesService.blocks.join('');
        const result: number[] = DesService.convertStringFromBinaryFormatToDecimalBytesArray(resultRaw);

        return String.fromCharCode(...result);
    }

    public static decrypt(encryptedMessageSource: string, keySource: string): string {
        let key: string = DesService.getDecryptionKey(encryptedMessageSource, keySource);
        const message: string = DesService.convertStringToBinaryFormat(encryptedMessageSource);

        DesService.splitBinaryStringIntoBlocks(message);

        for (let roundsCount: number = 0; roundsCount < DesService.numberOfRounds; ++roundsCount) {
            for (let blockIndex: number = 0; blockIndex < DesService.blocks.length; ++blockIndex) {
                DesService.blocks[blockIndex] = DesService.decodeSingleBlockFromDESPerOneRound(DesService.blocks[blockIndex], key);
            }

            key = DesService.transformKeyToPreviousRound(key);
        }

        const binaryResponse: string = DesService.blocks.join('');

        const untrimmedResponse: string = DesService.convertStringFromBinaryFormat(binaryResponse);
        const trimmedResponse: string = DesService.cutSymbolsFromStartAndEndOfString(untrimmedResponse, DesService.blankSymbol);

        return trimmedResponse;
    }

    private static encodeSingleBlockWithDESPerOneRound(block: string, key: string): string {
        const L0: string = block.slice(0, Math.ceil(block.length / 2));
        const R0: string = block.slice(Math.ceil(block.length / 2));

        return R0 + DesService.performXOROperation(L0, DesService.performXOROperation(R0, key));
    }

    private static decodeSingleBlockFromDESPerOneRound(block: string, key: string): string {
        const L0: string = block.slice(0, Math.ceil(block.length / 2));
        const R0: string = block.slice(Math.ceil(block.length / 2));

        return DesService.performXOROperation(DesService.performXOROperation(L0, key), R0) + L0;
    }

    private static transformKeyToNextRound(sourceKey: string): string {
        let response: string = String(sourceKey);

        for (let counter: number = 0; counter < DesService.shiftKey; ++counter) {
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
            response += first[index] !== second[index] ? DesService.oneBit : DesService.zeroBit;

        return response;
    }


    private static makeStringLengthMultipleOfBlockSize(source: string): string {
        let response: string = source;

        while (response.length * DesService.sizeOfChar % DesService.sizeOfBlock != 0)
            response += DesService.blankSymbol;

        return response;
    }

    private static splitStringIntoBlocks(source: string): void {
        this.blocks = new Array<string>(source.length * DesService.sizeOfChar / DesService.sizeOfBlock).fill('');

        const lengthOfBlock: number = source.length / this.blocks.length;

        for (let index: number = 0; index < DesService.blocks.length; ++index) {
            const subBlock: string = source.slice(index * lengthOfBlock, index * lengthOfBlock + lengthOfBlock);
            DesService.blocks[index] = DesService.convertStringToBinaryFormat(subBlock);
            //console.log('SUBBLOCK ', DES.blocks[index]);
        }
    }

    private static convertStringToBinaryFormat(source: string): string {
        let response: string = '';

        for (let index: number = 0; index < source.length; ++index) {
            let charBinary: string = source.charCodeAt(index).toString(2);

            while (charBinary.length < DesService.sizeOfChar)
                charBinary = DesService.zeroBit + charBinary;

            response += charBinary;
        }

        return response;
    }

    private static convertBytesDecimalArrayToBinaryFormat(source: number[]): string {
        let response: string = '';

        for (let index: number = 0; index < source.length; ++index) {
            let charBinary: string = source[index].toString(2);

            while (charBinary.length < DesService.sizeOfChar)
                charBinary = DesService.zeroBit + charBinary;

            response += charBinary;
        }

        return response;
    }

    private static convertStringFromBinaryFormatToDecimalBytesArray(sourceString: string): number[] {
        let response: number[] = [];
        let source: string = sourceString;

        while (source.length > 0) {
            const symbolCodeBinary: string = source.slice(0, DesService.sizeOfChar);
            source = source.slice(DesService.sizeOfChar);

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
            const symbolCodeBinary: string = source.slice(0, DesService.sizeOfChar);
            source = source.slice(DesService.sizeOfChar);

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
                response = DesService.zeroBit + response;

        return response;
    }

    private static getDecryptionKey(messageEncrypted: string, keySource: string) {
        let message: string = DesService.makeStringLengthMultipleOfBlockSize(messageEncrypted);

        DesService.splitStringIntoBlocks(message);

        let key: string = DesService.alignKey(keySource, message.length / (2 * DesService.blocks.length));
        key = DesService.convertStringToBinaryFormat(key);

        for (let counter: number = 0; counter < DesService.numberOfRounds; ++counter)
            key = DesService.transformKeyToNextRound(key);


        return DesService.transformKeyToPreviousRound(key);
    }

    private static transformKeyToPreviousRound(keySource: string): string {
        let response: string = keySource;
        for (let counter: number = 0; counter < DesService.shiftKey; ++counter) {
            response += response[0];
            response = response.slice(1);
        }

        return response;
    }

    private static splitBinaryStringIntoBlocks(input: string): void {
        DesService.blocks = new Array<string>(Math.ceil(input.length / DesService.sizeOfBlock)).fill('');

        const lengthOfBlock: number = Math.ceil(input.length / DesService.blocks.length);

        for (let blockIndex: number = 0; blockIndex < DesService.blocks.length; ++blockIndex) {
            DesService.blocks[blockIndex] = input.slice(blockIndex * lengthOfBlock, blockIndex * lengthOfBlock + lengthOfBlock);
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
