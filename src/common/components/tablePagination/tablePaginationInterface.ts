
export interface TablePaginationInterface {
    currentPage: number
    totalPages: number
    onReset: () => void
    onPrev: () => void
    onNext: () => void
    onLast: () => void
}