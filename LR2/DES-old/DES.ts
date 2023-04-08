import { Bit } from './DES_types'
import {
    BYTES_COUNT,
    INITIAL_PERMUTATION,
    KEY_PERMUTATION,
    KEY_FINAL_PERMUTATION,
    EXPANSION_TABLE,
    S_BOXES,
    FINAL_PERMUTATION
} from './DES_data'
import {
    splitArrayIntoTwoEqualParts,
    convertToBinaryWithZerosBeforeNumber,
    getKeyAfterShiftingItPartsToLeft,
    xorBitArrays,
    getSBlocks,
    transformSBlockWithHelpOfSBox
} from './DES_utils'


export const encryptWithDES = (messageSource: string, keySource: string): number[] => {
    const messageBytesInitial: number[] = [...messageSource].map((_: string, index: number): number => messageSource.charCodeAt(index))
    const keyBytesInitial: number[] = [...keySource].map((_: string, index: number): number => keySource.charCodeAt(index))


    //  expanded (extended) to 8 bytes
    const messageBytes: number[] = [...Array(BYTES_COUNT - messageBytesInitial.length).fill(0), ...messageBytesInitial]
    const keyBytes: number[] = [...Array(BYTES_COUNT - keyBytesInitial.length).fill(0), ...keyBytesInitial]


    // split message to bits and initially permutate it. Then split on left and right parts
    const messageBits: Bit[] =
        messageBytes
            .map((messageByte: number): string => convertToBinaryWithZerosBeforeNumber(messageByte, BYTES_COUNT))
            .join('')
            .split('')
            .map(Number) as Bit[]
    const messageBitsInitiallyPermutated: Bit[] = INITIAL_PERMUTATION.map((index: number): Bit => messageBits[index - 1])
    const [L0, R0] = splitArrayIntoTwoEqualParts(messageBitsInitiallyPermutated)

    // split key on bits and permutate it
    const keyBits: Bit[] =
        keyBytes
            .map((keyByte: number): string => convertToBinaryWithZerosBeforeNumber(keyByte, BYTES_COUNT))
            .join('')
            .split('')
            .map(Number) as Bit[]
    const keyBitsPermutated: Bit[] = KEY_PERMUTATION.map((index: number): Bit => keyBits[index - 1])


    // shift left and right parts of key
    const keyWithShiftedParts: Bit[] = getKeyAfterShiftingItPartsToLeft(keyBitsPermutated, 1)

    // permutate it accorfing to key final permutation table ===> so I'll get key of 1st round
    const keyFinallyPermutated: Bit[] = KEY_FINAL_PERMUTATION.map((index: number): Bit => keyWithShiftedParts[index - 1])
    // keyFinallyPermutated <==> key of 1st round <==> K1


    // now expanding (extending) right part of message (R0) from 32 bits to 48 bits
    const expandedR0: Bit[] = EXPANSION_TABLE.map((index: number): Bit => R0[index - 1])

    // xor it with key (k1 or keyFinallyPermutated)
    const expandedR0xoredWithK1: Bit[] = xorBitArrays(expandedR0, keyFinallyPermutated)

    // divide/split resut into 8 blocks (8 6-bit blocks)
    const sBlocks: Bit[][] = getSBlocks(expandedR0xoredWithK1) // 8   s-blocks

    // for every s-block find number in its s-box, convert this number to binary
    const bit32Block: Bit[] =
        sBlocks
            .map((sBlock: Bit[], index: number): string => transformSBlockWithHelpOfSBox(sBlock, index, S_BOXES))
            .join('')
            .split('')
            .map(Number) as Bit[]

    
    // function of encryption
    const bit32BlockPermutated: Bit[] = FINAL_PERMUTATION.map((index: number) => bit32Block[index])


    // now xor this function with L0 (left part of permutated message bits)
    const L0xoredWithBit32BlockPermuted: Bit[] = xorBitArrays(bit32BlockPermutated, L0) // L0 ENCRYPTED

    const somethingStange: Bit[] = [...L0xoredWithBit32BlockPermuted, ...R0]
    
    return [
        Number.parseInt(somethingStange.slice(0, 8).join(''), 2),
        Number.parseInt(somethingStange.slice(8, 16).join(''), 2),
        Number.parseInt(somethingStange.slice(16, 24).join(''), 2),
        Number.parseInt(somethingStange.slice(24, 32).join(''), 2),
        Number.parseInt(somethingStange.slice(32, 40).join(''), 2),
        Number.parseInt(somethingStange.slice(40, 48).join(''), 2),
        Number.parseInt(somethingStange.slice(48, 56).join(''), 2),
        Number.parseInt(somethingStange.slice(56, 64).join(''), 2),
    ]
}





const messageInitial: string = 'message'
const keyInitial: string = 'keykey'

const messageShortenedTo8bytes: string = messageInitial.slice(0, BYTES_COUNT)
const keyShortenedTo8bytes: string = keyInitial.slice(0, BYTES_COUNT)

const encrypted: number[] = encryptWithDES(messageShortenedTo8bytes, keyShortenedTo8bytes)

console.log(encrypted)
console.log(String.fromCharCode(...encrypted))


