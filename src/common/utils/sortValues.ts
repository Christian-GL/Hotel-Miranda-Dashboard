
import { ArrowType } from "common/enums/ArrowType"


export const sortValues = <T>(valueA: T, valueB: T, arrowDirection: ArrowType): number => {
    if (arrowDirection === ArrowType.up) {
        return valueA < valueB ?
            1 :
            valueA > valueB ?
                -1 :
                0
    }
    else {
        return valueA > valueB ?
            1 :
            valueA < valueB ?
                -1 :
                0
    }
}