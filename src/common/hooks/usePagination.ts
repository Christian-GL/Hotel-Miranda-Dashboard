
import { useState } from 'react'

import { UserInterface } from '../../user/interfaces/userInterface.ts'


export const usePagination = (data: UserInterface[], itemsPerPage: number) => {

    const sortedData = [...data]

    const [currentPage, setCurrentPage] = useState(1)
    const totalPages = Math.ceil(sortedData.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = currentPage * itemsPerPage
    const currentPageItems = sortedData.slice(startIndex, endIndex)

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