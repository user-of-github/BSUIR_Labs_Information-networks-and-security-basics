import { Bit } from './DES_types'



// to fill with zeros if necessary
export const convertToBinaryWithZerosBeforeNumber = (byte: number, necessaryLength: number): string => {
    const initial: string = byte.toString(2)
    const response: string = [...Array(necessaryLength - initial.length).fill(0), ...initial].join('')
    return response
}

const performSingleLeftCycleShift = <ValueType>(array: ValueType[]): void => {
    const tempFirst: ValueType = array[0]

    for (let index: number = 0; index < array.length - 1; ++index) {
        array[index] = array[index + 1]
    }

    array[array.length - 1] = tempFirst
}

export const performSeveralLeftCycleShifts = <ValueType>(array: ValueType[], shiftsCount: number = 1): void => {
    for (let counter: number = 1; counter <= shiftsCount; ++counter) {
        performSingleLeftCycleShift<ValueType>(array)
    }
}

// we need to shift separately key's left part and key's right part
export const getKeyAfterShiftingItPartsToLeft = (initialKey: Bit[], shiftCount: number): Bit[] => {
    const [leftPart, rightPart] = splitArrayIntoTwoEqualParts(initialKey)

    performSeveralLeftCycleShifts(leftPart, 1)
    performSeveralLeftCycleShifts(rightPart, 1)

    return [...leftPart, ...rightPart]
}

export const splitArrayIntoTwoEqualParts = <ValueType>(array: ValueType[]): [ValueType[], ValueType[]] => {
    const middleIndex: number = Math.ceil(array.length / 2)

    const left: ValueType[] = array.slice(0, middleIndex)
    const right: ValueType[] = array.slice(-middleIndex)

    return [left, right]
}

export const xorBitArrays = (first: Bit[], second: Bit[]): Bit[] => {
    if (first.length !== second.length) throw Error('xorBitArrays: The lengths of the arrays do not match')
    
    return first.map((firstBit: Bit, index: number): Bit => {
        const secondBit: Bit = second[index]

        if (firstBit === 0 && secondBit === 0) return 0
        if (firstBit === 1 && secondBit === 1) return 0

        return 1
    })
}

export const getSBlocks = (array: Bit[]): [Bit[], Bit[], Bit[], Bit[], Bit[], Bit[], Bit[], Bit[]] => {
    if (array.length !== 48) throw Error('getSBlocks: array\'s length does not equal 48')

    return [
        array.slice(0, 6),
        array.slice(6, 12),
        array.slice(12, 18),
        array.slice(18, 24),
        array.slice(24, 30),
        array.slice(30, 36),
        array.slice(36, 42),
        array.slice(42, 48)
    ]
}

export const transformSBlockWithHelpOfSBox = (sBlock: Bit[], sBlockIndex: number, S_BOXES: number[][][]): string => {
    const rowNumber: number = Number.parseInt([sBlock[0], sBlock[sBlock.length - 1]].join(''), 2)
    const colNumber: number = Number.parseInt(sBlock.slice(1, sBlock.length - 2).join(''), 2)

    const valueFromSBlocksArray: number = S_BOXES[sBlockIndex][rowNumber][colNumber]
    const binaryValue: string = convertToBinaryWithZerosBeforeNumber(valueFromSBlocksArray, 4)

    return binaryValue
}