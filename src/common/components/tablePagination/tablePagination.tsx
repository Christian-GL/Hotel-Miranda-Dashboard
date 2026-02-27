
import React from 'react'

import { ButtonSwitchPage, DivCtnPagination, SpanPageCount } from 'common/components/tablePagination/tablePaginationStyles'
import { TablePaginationInterface } from 'common/interfaces/tablePaginationInterface'


export const TablePagination: React.FC<TablePaginationInterface> = ({
    currentPage,
    totalPages,
    onReset,
    onPrev,
    onNext,
    onLast
}) => {
    return (
        <DivCtnPagination>
            <ButtonSwitchPage onClick={onReset} disabled={currentPage === 1} margin="0 1rem 0 0">
                &lt;&lt;
            </ButtonSwitchPage>

            <ButtonSwitchPage onClick={onPrev} disabled={currentPage === 1}    >
                &lt;
            </ButtonSwitchPage>

            <SpanPageCount>
                {currentPage} of {totalPages}
            </SpanPageCount>

            <ButtonSwitchPage onClick={onNext} disabled={currentPage === totalPages}  >
                &gt;
            </ButtonSwitchPage>

            <ButtonSwitchPage onClick={onLast} disabled={currentPage === totalPages} margin="0 0 0 1rem"  >
                &gt;&gt;
            </ButtonSwitchPage>
        </DivCtnPagination>
    )
}
