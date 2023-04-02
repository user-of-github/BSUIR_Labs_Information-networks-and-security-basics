import { BYTES_COUNT, INITIAL_PERMUTATION, KEY_PERMUTATION, KEY_FINAL_PERMUTATION } from './DES_data'
import { splitArrayIntoTwoEqualParts, convertToBinaryWithZerosBeforeNumber, getKeyAfterShiftingItPartsToLeft } from './DES_utils'


export const encryptWithDES = (messageSource: string, keySource: string): string => {
    const messageBytesInitial: number[] = [...messageSource].map((_: string, index: number): number => messageSource.charCodeAt(index))
    const keyBytesInitial: number[] = [...keySource].map((_: string, index: number): number => keySource.charCodeAt(index))

    //  expanded (extended) to 8 bytes
    const messageBytes: number[] = [...Array(BYTES_COUNT - messageBytesInitial.length).fill(0), ...messageBytesInitial]
    const keyBytes: number[] = [...Array(BYTES_COUNT - keyBytesInitial.length).fill(0), ...keyBytesInitial]

    // split message to bits and initially permutate it. Then split on left and right parts
    const messageBits: number[] = Array.from(messageBytes.map(convertToBinaryWithZerosBeforeNumber).join('')).map(Number)
    const messageBitsInitiallyPermutated: number[] = INITIAL_PERMUTATION.map((index: number): number => messageBits[index - 1])
    const [L0, R0] = splitArrayIntoTwoEqualParts(messageBitsInitiallyPermutated)

    // split key on bits and permutate it
    const keyBits: number[] = Array.from(keyBytes.map(convertToBinaryWithZerosBeforeNumber).join('')).map(Number)
    const keyBitsPermutated: number[] = KEY_PERMUTATION.map((index: number): number => keyBits[index - 1])
    
    // shift left and right parts of key
    const keyWithShiftedParts: number[] = getKeyAfterShiftingItPartsToLeft(keyBitsPermutated, 1)

    // permutate it accorfing to key final permutation table ===> so I'll get key of 1st round
    const keyFinallyPermutated: number[] = KEY_FINAL_PERMUTATION.map((index: number): number => keyWithShiftedParts[index - 1])
    // keyFinallyPermutated <==> key of 1st round


    // now expanding (extending) right part of message (R0) from 32 bits to 48 bits

    return messageSource
}





const messageInitial: string = 'message'
const keyInitial: string = 'key'

const messageShortenedTo8bytes: string = messageInitial.slice(0, BYTES_COUNT)
const keyShortenedTo8bytes: string = keyInitial.slice(0, BYTES_COUNT)

encryptWithDES(messageShortenedTo8bytes, keyShortenedTo8bytes)


