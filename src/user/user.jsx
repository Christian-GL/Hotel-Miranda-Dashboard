
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"

import * as userJS from "./user.js"
import * as gb from '../common/styles/globalVars.js'
import { dateFormatToYYYYMMDD } from "../common/utils/formUtils.js"
import { TableDisplayIndicator } from "../common/components/tableDisplaySelector/tableDisplaySelector.jsx"
import { TableSearchTerm } from "../common/components/tableSearchTerm/tableSearchTerm.jsx"
import { ButtonCreate } from "../common/components/buttonCreate/buttonCreate.jsx"
import { Table, THTable, TriangleUp, TriangleRight, TriangleDown, DivImgTable, ImgTableUser, PTable, PStatusAvailableUsers, IconPhone, IconOptions, DivCtnOptions, ButtonOption } from "../common/styles/table.js"
import { usePagination } from "../common/hooks/usePagination.js"
import * as paginationJS from '../common/styles/pagination.js'
import { getUserAllData, getUserAllStatus } from "./features/userSlice.js"
import { UserFetchAllThunk } from "./features/thunks/userFetchAllThunk.js"
import { UserDeleteByIdThunk } from "./features/thunks/userDeleteByIdThunk.js"


export const User = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const nameColumnList = ['', 'Name', 'Start date', 'Job description', 'Contact', 'Status', '']
    const userAll = useSelector(getUserAllData)
    const userAllLoading = useSelector(getUserAllStatus)
    const [inputText, setInputText] = useState('')
    const [tableOptionsDisplayed, setTableOptionsDisplayed] = useState()
    const [filteredUsers, setFilteredUsers] = useState([])
    // export enum ButtonType {     <-- Hacer cuando se pase fichero a TS y hacer en las otras 3 páginas el equivalente.
    //     all = "all",
    //     active = "active",
    //     inactive = "inactive"
    // }
    const [selectedButton, setSelectedButton] = useState('all')
    const [arrowStates, setArrowStates] = useState({
        name: 'right',
        startDate: 'down'
    })
    const {
        currentPageItems,
        currentPage,
        totalPages,
        goToNextPage,
        goToPrevPage,
        resetPage,
        lastPage
    } = usePagination(filteredUsers, 10)

    useEffect(() => {
        if (userAllLoading === "idle") { dispatch(UserFetchAllThunk()) }
        else if (userAllLoading === "fulfilled") { displayEmployee() }
        else if (userAllLoading === "rejected") { alert("Error en la api") }
    }, [userAllLoading, userAll, inputText, selectedButton, arrowStates])

    const navigateToUserCreate = () => {
        navigate('user-create')
    }
    const navigateToUserUpdate = (id) => {
        navigate(`user-update/${id}`)
    }

    const handleInputTerm = (e) => {
        setInputText(e.target.value)
        resetPage()
    }
    const handleTableFilter = (type) => {
        setSelectedButton(type)
        displayEmployee()
    }
    const displayEmployee = () => {
        let filteredData
        switch (selectedButton) {
            case 'all':
                filteredData = userAll.filter(user =>
                    user.full_name.toLowerCase().includes(inputText.toLowerCase())
                )
                break
            case 'active':
                filteredData = userAll.filter(user =>
                    user.full_name.toLowerCase().includes(inputText.toLowerCase()) && user.status_active === true
                )
                break
            case 'inactive':
                filteredData = userAll.filter(user =>
                    user.full_name.toLowerCase().includes(inputText.toLowerCase()) && user.status_active === false
                )
                break
        }
        const sortedData = sortData(filteredData)
        setFilteredUsers(sortedData)
    }
    const sortData = (filteredData) => {
        const activeColumn = Object.keys(arrowStates).find(key => arrowStates[key] !== 'right')
        let sortedData
        if (activeColumn) {
            sortedData = filteredData.sort((a, b) => {
                let valueA
                let valueB

                if (activeColumn === 'name') {
                    valueA = a.full_name.toLowerCase()
                    valueB = b.full_name.toLowerCase()
                }
                else if (activeColumn === 'startDate') {
                    valueA = new Date(dateFormatToYYYYMMDD(a.start_date))
                    valueB = new Date(dateFormatToYYYYMMDD(b.start_date))
                }

                if (arrowStates[activeColumn] === 'down') {
                    return valueB > valueA ? -1 : 1
                } else {
                    return valueA > valueB ? -1 : 1
                }
            })
        }
        return sortedData
    }
    const handleColumnClick = (column) => {
        setArrowStates(prevState => {
            const newState = { ...prevState }

            if (newState[column] === 'right') { newState[column] = 'down' }
            else if (newState[column] === 'down') { newState[column] = 'up' }
            else if (newState[column] === 'up') { newState[column] = 'down' }

            Object.keys(newState).forEach(key => {
                if (key !== column) {
                    newState[key] = 'right'
                }
            })

            return newState
        })

        handleTableFilter(selectedButton)
    }
    const getArrowIcon = (column) => {
        const state = arrowStates[column]
        if (state === 'up') { return <TriangleUp /> }
        else if (state === 'down') { return <TriangleDown /> }
        else { return <TriangleRight /> }
    }
    const displayMenuOptions = (index) => {
        tableOptionsDisplayed === index ?
            setTableOptionsDisplayed() :
            setTableOptionsDisplayed(index)
    }
    const deleteUserById = (id, index) => {
        dispatch(UserDeleteByIdThunk(parseInt(id)))
        displayMenuOptions(index)
    }


    return (

        <userJS.SectionPageUser>

            <userJS.DivCtnFuncionality>
                <userJS.DivCtnTableDisplayFilter>
                    <TableDisplayIndicator text='All Employee' onClick={() => handleTableFilter('all')} isSelected={selectedButton === 'all'} />
                    <TableDisplayIndicator text='Active Employee' onClick={() => handleTableFilter('active')} isSelected={selectedButton === 'active'} />
                    <TableDisplayIndicator text='Inactive Employee' onClick={() => handleTableFilter('inactive')} isSelected={selectedButton === 'inactive'} />
                </userJS.DivCtnTableDisplayFilter>

                <userJS.DivCtnSearch>
                    <TableSearchTerm onchange={handleInputTerm} placeholder='Search employee by name' />
                </userJS.DivCtnSearch>

                <userJS.DivCtnButton>
                    <ButtonCreate onClick={navigateToUserCreate} children='+ New Employee' />
                </userJS.DivCtnButton>
            </userJS.DivCtnFuncionality>

            <Table rowlistlength={`${filteredUsers.length + 1}`} columnlistlength={`${nameColumnList.length}`} >
                {nameColumnList.map((nameColumn, index) =>
                    index === 1 || index === 2 ?
                        <THTable key={index} onClick={() => handleColumnClick(index === 1 ? 'name' : 'startDate')} cursorPointer='yes'>
                            {nameColumn}
                            {index === 1 ? getArrowIcon("name") : getArrowIcon("startDate")}
                        </THTable> :
                        <THTable key={index}>{nameColumn}</THTable>
                )}
                {currentPageItems.map((userData, index) => {
                    return [
                        <DivImgTable key={index + '-1'}>
                            <ImgTableUser src={`${userData.photo}`} />
                        </DivImgTable>,

                        <PTable key={index + '-2'} flexdirection='column' alignitems='left' justifycontent='center'>
                            <div style={{ color: `${gb.colorGreen}` }}>
                                <b>{userData.full_name}</b>
                            </div>
                            <div>#<b>{userData.id}</b></div>
                            <div>{userData.email}</div>
                        </PTable>,

                        <PTable key={index + '-3'}>
                            {userData.start_date}
                        </PTable>,

                        <PTable key={index + '-4'}>
                            {userData.description}
                        </PTable>,

                        <PTable key={index + '-5'} flexdirection='row'>
                            <IconPhone />
                            {userData.phone_number}
                        </PTable>,

                        <PTable key={index + '-6'}>
                            {userData.status_active === true ?
                                <PStatusAvailableUsers status={userData.status_active}>
                                    Active
                                </PStatusAvailableUsers> :

                                <PStatusAvailableUsers status={userData.status_active}>
                                    Inactive
                                </PStatusAvailableUsers>
                            }
                        </PTable>,

                        <PTable key={index + '-7'}>
                            <IconOptions onClick={() => { displayMenuOptions(index) }} />
                            <DivCtnOptions display={`${tableOptionsDisplayed === index ? 'flex' : 'none'}`} >
                                <ButtonOption onClick={() => { navigateToUserUpdate(userData.id) }}>Update</ButtonOption>
                                <ButtonOption onClick={() => { deleteUserById(userData.id, index) }}>Delete</ButtonOption>
                            </DivCtnOptions>
                        </PTable>
                    ]
                }
                )}
            </Table>

            <paginationJS.DivCtnPagination>
                <paginationJS.ButtonSwitchPage onClick={resetPage} disabled={currentPage === 1} margin='0 1rem 0 0'>
                    &lt;&lt;
                </paginationJS.ButtonSwitchPage>
                <paginationJS.ButtonSwitchPage onClick={goToPrevPage} disabled={currentPage === 1}>
                    &lt;
                </paginationJS.ButtonSwitchPage>
                <paginationJS.SpanPageCount>
                    {currentPage} of {totalPages}
                </paginationJS.SpanPageCount>
                <paginationJS.ButtonSwitchPage onClick={goToNextPage} disabled={currentPage === totalPages}>
                    &gt;
                </paginationJS.ButtonSwitchPage>
                <paginationJS.ButtonSwitchPage onClick={lastPage} disabled={currentPage === totalPages} margin='0 0 0 1rem'>
                    &gt;&gt;
                </paginationJS.ButtonSwitchPage>
            </paginationJS.DivCtnPagination>

        </userJS.SectionPageUser>

    )
}