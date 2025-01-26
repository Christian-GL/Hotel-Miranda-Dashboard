
import { useState } from 'react'


export const usePagination = (data, itemsPerPage) => {

    const [currentPage, setCurrentPage] = useState(1)
    const totalPages = Math.ceil(data.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = currentPage * itemsPerPage
    const currentPageItems = data.slice(startIndex, endIndex)

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1)
        }
    }
    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1)
        }
    }
    const resetPage = () => {
        setCurrentPage(1)
    }
    const lastPage = () => {
        setCurrentPage(totalPages)
    }

    return {
        currentPageItems,
        currentPage,
        totalPages,
        goToNextPage,
        goToPrevPage,
        resetPage,
        lastPage
    }
}