
import { ArrowType } from "common/enums/ArrowType"


type GenericArrowStates<T extends string> = Partial<Record<T, ArrowType>>

export const handleColumnClick = <T extends string>(
    column: T,
    sortableColumns: T[],
    setArrowStates: React.Dispatch<React.SetStateAction<GenericArrowStates<T>>>,
    displayElementsFunction: () => void
) => {

    setArrowStates(prevState => {
        const newState: GenericArrowStates<T> = { ...prevState }
        const current = newState[column]

        if (current === ArrowType.right) newState[column] = ArrowType.down
        else if (current === ArrowType.down) newState[column] = ArrowType.up
        else if (current === ArrowType.up) newState[column] = ArrowType.down
        else newState[column] = ArrowType.down

        sortableColumns.forEach(col => {
            if (col !== column) {
                newState[col] = ArrowType.right
            }
        })

        return newState
    })

    displayElementsFunction()
}