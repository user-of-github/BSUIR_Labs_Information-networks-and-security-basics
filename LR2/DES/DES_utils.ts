import { BYTES_COUNT } from './DES_data'


// to fill with zeros if necessary
export const convertToBinaryWithZerosBeforeNumber = (byte: number): string => {
    const initial: string = byte.toString(2)
    const response: string = [...Array(BYTES_COUNT - initial.length).fill(0), ...initial].join('')
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
export const getKeyAfterShiftingItPartsToLeft = (initialKey: number[], shiftCount: number): number[] => {
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