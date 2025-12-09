
import { ArrowType } from "../../common/enums/ArrowType"
import { TriangleRight, TriangleDown, TriangleUp } from "common/styles/tableStyles"


export const getArrowIcon = (state: ArrowType | undefined): JSX.Element => {
    if (state === ArrowType.up) return <TriangleUp />
    else if (state === ArrowType.down) return <TriangleDown />
    else return <TriangleRight />
}