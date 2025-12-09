
import { ArrowType } from "common/enums/ArrowType"


export type GenericArrowStates<T extends string | number> =
    Partial<Record<T, ArrowType>>;

export function handleColumnClick<T extends string | number>(
    column: T,
    sortableColumns: T[],
    setArrowStates: React.Dispatch<
        React.SetStateAction<GenericArrowStates<T>>
    >,
    onAfterChange?: () => void
) {
    setArrowStates(prevState => {
        const newState: GenericArrowStates<T> = { ...prevState };

        // Alternar flechas en la columna clicada
        const current = newState[column];

        if (current === ArrowType.right) newState[column] = ArrowType.down;
        else if (current === ArrowType.down) newState[column] = ArrowType.up;
        else if (current === ArrowType.up) newState[column] = ArrowType.down;
        else newState[column] = ArrowType.down;

        // Resetear las demás columnas
        sortableColumns.forEach(col => {
            if (col !== column) {
                newState[col] = ArrowType.right;
            }
        });

        return newState;
    });

    // Llamada opcional (por ejemplo, filtrar tabla)
    if (onAfterChange) onAfterChange();
}