import { 
    BYTES_COUNT, 
    INITIAL_PERMUTATION, 
    KEY_PERMUTATION, 
    KEY_FINAL_PERMUTATION, 
    EXPANSION_TABLE 
} from './DES_data'
import { 
    Bit,
    splitArrayIntoTwoEqualParts, 
    convertToBinaryWithZerosBeforeNumber, 
    getKeyAfterShiftingItPartsToLeft,
    xorBitArrays,
    getSBlocks
} from './DES_utils'


export const encryptWithDES = (messageSource: string, keySource: string): string => {
    const messageBytesInitial: number[] = [...messageSource].map((_: string, index: number): number => messageSource.charCodeAt(index))
    const keyBytesInitial: number[] = [...keySource].map((_: string, index: number): number => keySource.charCodeAt(index))

    //  expanded (extended) to 8 bytes
    const messageBytes: number[] = [...Array(BYTES_COUNT - messageBytesInitial.length).fill(0), ...messageBytesInitial]
    const keyBytes: number[] = [...Array(BYTES_COUNT - keyBytesInitial.length).fill(0), ...keyBytesInitial]

    // split message to bits and initially permutate it. Then split on left and right parts
    const messageBits: Bit[] = Array.from(messageBytes.map(convertToBinaryWithZerosBeforeNumber).join('')).map(Number) as Bit[]
    const messageBitsInitiallyPermutated: Bit[] = INITIAL_PERMUTATION.map((index: number): Bit => messageBits[index - 1])
    const [L0, R0] = splitArrayIntoTwoEqualParts(messageBitsInitiallyPermutated)

    // split key on bits and permutate it
    const keyBits: Bit[] = Array.from(keyBytes.map(convertToBinaryWithZerosBeforeNumber).join('')).map(Number) as Bit[]
    const keyBitsPermutated: Bit[] = KEY_PERMUTATION.map((index: number): Bit => keyBits[index - 1])
    
    // shift left and right parts of key
    const keyWithShiftedParts: Bit[] = getKeyAfterShiftingItPartsToLeft(keyBitsPermutated, 1)

    // permutate it accorfing to key final permutation table ===> so I'll get key of 1st round
    const keyFinallyPermutated: Bit[] = KEY_FINAL_PERMUTATION.map((index: number): Bit => keyWithShiftedParts[index - 1])
    // keyFinallyPermutated <==> key of 1st round <==> K1


    // now expanding (extending) right part of message (R0) from 32 bits to 48 bits
    const expandedR0: Bit[] = EXPANSION_TABLE.map((index: number): Bit => R0[index - 1])

    const expandedR0xoredWithK1: Bit[] = xorBitArrays(expandedR0, keyFinallyPermutated)

    const [s1, s2, s3, s4, s5, s6, s7, s8] = getSBlocks(expandedR0xoredWithK1)
    

    return messageSource
}





const messageInitial: string = 'message'
const keyInitial: string = 'key'

const messageShortenedTo8bytes: string = messageInitial.slice(0, BYTES_COUNT)
const keyShortenedTo8bytes: string = keyInitial.slice(0, BYTES_COUNT)

encryptWithDES(messageShortenedTo8bytes, keyShortenedTo8bytes)


