
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"

import * as userJS from "./user.js"
import * as gb from '../common/styles/globalVars.js'
import { TableDisplayIndicator } from "../common/components/tableDisplaySelector/tableDisplaySelector.jsx"
import { TableSearchTerm } from "../common/components/tableSearchTerm/tableSearchTerm.jsx"
import { ButtonCreate } from "../common/components/buttonCreate/buttonCreate.jsx"
import { Table, THTable, DivImgTable, ImgTableUser, PTable, PStatusAvailableUsers, IconPhone, IconOptions, DivCtnOptions, ButtonOption } from "../common/styles/table.js"
import { usePagination } from "../common/hooks/usePagination.js"
import * as paginationJS from '../common/styles/pagination.js'
import { getUserAllData, getUserAllStatus, getUserError } from "./features/userSlice.js"
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
    const [selectedButton, setSelectedButton] = useState('all')
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
        else if (userAllLoading === "fulfilled") { displayAllEmployee() }
        else if (userAllLoading === "rejected") { alert("Error en la api") }
    }, [userAllLoading, userAll, inputText])

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
        switch (type) {
            case 'all':
                displayAllEmployee()
                break
            case 'active':
                displayActiveEmployee()
                break
            case 'inactive':
                displayInactiveEmployee()
                break
        }
    }
    const displayAllEmployee = () => {
        const filtered = userAll.filter(user =>
            user.full_name.toLowerCase().includes(inputText.toLowerCase())
        )
        setFilteredUsers(filtered)
    }
    const displayActiveEmployee = () => {
        const filtered = userAll.filter(user =>
            user.full_name.toLowerCase().includes(inputText.toLowerCase()) && user.status_active === true
        )
        setFilteredUsers(filtered)
    }
    const displayInactiveEmployee = () => {
        const filtered = userAll.filter(user =>
            user.full_name.toLowerCase().includes(inputText.toLowerCase()) && user.status_active === false
        )
        setFilteredUsers(filtered)
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