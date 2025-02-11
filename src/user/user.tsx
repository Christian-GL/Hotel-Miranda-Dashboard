
import React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"

import * as userStyles from "./userStyles.ts"
import * as gb from '../common/styles/globalVars.ts'
import { AppDispatch } from '../common/redux/store.ts'
import { ApiStatus } from "../common/enums/ApiStatus.ts"
import { UserInterface } from "./interfaces/userInterface.ts"
import { UserColumnsArrowStatesInterface } from "./interfaces/userColumnsArrowStatesInterface.ts"
import { ArrowType } from "../common/enums/ArrowType.ts"
import { dateFormatToYYYYMMDD } from "../common/utils/formUtils.ts"
import { TableDisplayIndicator } from "../common/components/tableDisplaySelector/tableDisplaySelector.tsx"
import { TableSearchTerm } from "../common/components/tableSearchTerm/tableSearchTerm.tsx"
import { ButtonCreate } from "../common/components/buttonCreate/buttonCreate.tsx"
import {
    Table, THTable, TriangleUp, TriangleRight, TriangleDown, DivImgTable, ImgTableUser, PTable,
    PStatusAvailableUsers, IconPhone, IconOptions, DivCtnOptions, ButtonOption
} from "../common/styles/tableStyles.ts"
import { usePagination } from "../common/hooks/usePagination.ts"
import * as paginationStyles from '../common/styles/pagination.ts'
import { getUserAllData, getUserAllStatus } from "./features/userSlice.ts"
import { UserFetchAllThunk } from "./features/thunks/userFetchAllThunk.ts"
import { UserDeleteByIdThunk } from "./features/thunks/userDeleteByIdThunk.ts"


export const User = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    enum ButtonType {
        all = "all",
        active = "active",
        inactive = "inactive"
    }
    enum columnsSortAvailable {
        name = 'name',
        startDate = 'startDate'
    }
    const nameColumnList: string[] = ['', 'Name', 'Start date', 'Job description', 'Contact', 'Status', '']
    const userAll: UserInterface[] = useSelector(getUserAllData)
    const userAllLoading: ApiStatus = useSelector(getUserAllStatus)
    const [inputText, setInputText] = useState<string>('')
    const [tableOptionsDisplayed, setTableOptionsDisplayed] = useState<number>(-1)
    const [selectedButton, setSelectedButton] = useState<ButtonType>(ButtonType.all)
    const [filteredUsers, setFilteredUsers] = useState<UserInterface[]>([])
    const [arrowStates, setArrowStates] = useState<UserColumnsArrowStatesInterface>({
        name: ArrowType.right,
        startDate: ArrowType.down
    })
    const {
        currentPageItems,
        currentPage,
        totalPages,
        goToNextPage,
        goToPrevPage,
        resetPage,
        lastPage
    } = usePagination<UserInterface>(filteredUsers, 10)

    useEffect(() => {
        if (userAllLoading === ApiStatus.idle) { dispatch(UserFetchAllThunk()) }
        else if (userAllLoading === ApiStatus.fulfilled) { displayEmployee() }
        else if (userAllLoading === ApiStatus.rejected) { alert("Error en la api de users") }
    }, [userAllLoading, userAll, inputText, selectedButton, arrowStates])

    const navigateToUserCreate = () => navigate('user-create')
    const navigateToUserUpdate = (id: number) => navigate(`user-update/${id}`)

    const handleInputTerm = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setInputText(e.target.value)
        resetPage()
    }
    const handleTableFilter = (type: ButtonType): void => {
        setSelectedButton(type)
        displayEmployee()
    }
    const displayEmployee = (): void => {
        let filteredData: UserInterface[]
        switch (selectedButton) {
            case ButtonType.all:
                filteredData = userAll.filter(user =>
                    user.full_name.toLowerCase().includes(inputText.toLowerCase())
                )
                break
            case ButtonType.active:
                filteredData = userAll.filter(user =>
                    user.full_name.toLowerCase().includes(inputText.toLowerCase()) && user.status_active === true
                )
                break
            case ButtonType.inactive:
                filteredData = userAll.filter(user =>
                    user.full_name.toLowerCase().includes(inputText.toLowerCase()) && user.status_active === false
                )
                break
        }
        const sortedData = sortData(filteredData)
        setFilteredUsers(sortedData)
        resetPage()
    }
    const sortData = (filteredData: UserInterface[]): UserInterface[] => {
        const activeColumn = Object.keys(arrowStates).find(key => arrowStates[key] !== ArrowType.right)
        let sortedData: UserInterface[] = [...filteredData]
        if (activeColumn) {
            if (activeColumn === columnsSortAvailable.name) {
                sortedData.sort((a, b) => {
                    let valueA: string = a.full_name.toLowerCase()
                    let valueB: string = b.full_name.toLowerCase()
                    if (arrowStates[activeColumn] === ArrowType.up) {
                        return valueB > valueA ? 1 : (valueB < valueA ? -1 : 0)
                    } else {
                        return valueA > valueB ? 1 : (valueA < valueB ? -1 : 0)
                    }
                })
            }
            else if (activeColumn === columnsSortAvailable.startDate) {
                sortedData.sort((a, b) => {
                    let valueA: Date = new Date(dateFormatToYYYYMMDD(a.start_date))
                    let valueB: Date = new Date(dateFormatToYYYYMMDD(b.start_date))
                    if (arrowStates[activeColumn] === ArrowType.up) {
                        return valueB > valueA ? 1 : (valueB < valueA ? -1 : 0)
                    } else {
                        return valueA > valueB ? 1 : (valueA < valueB ? -1 : 0)
                    }
                })
            }
        }
        return sortedData
    }
    const handleColumnClick = (nameColumn: columnsSortAvailable): void => {
        setArrowStates(prevState => {
            const newState: UserColumnsArrowStatesInterface = { ...prevState }

            if (newState[nameColumn] === ArrowType.right) { newState[nameColumn] = ArrowType.down }
            else if (newState[nameColumn] === ArrowType.down) { newState[nameColumn] = ArrowType.up }
            else if (newState[nameColumn] === ArrowType.up) { newState[nameColumn] = ArrowType.down }

            Object.keys(newState).forEach(key => {
                if (key !== nameColumn) {
                    newState[key] = ArrowType.right
                }
            })

            return newState
        })
        handleTableFilter(selectedButton)
    }
    const getArrowIcon = (nameColumn: columnsSortAvailable): JSX.Element => {
        const state = arrowStates[nameColumn]
        if (state === ArrowType.up) { return <TriangleUp /> }
        else if (state === ArrowType.down) { return <TriangleDown /> }
        else { return <TriangleRight /> }
    }
    const displayMenuOptions = (index: number): void => {
        tableOptionsDisplayed === index ?
            setTableOptionsDisplayed(-1) :
            setTableOptionsDisplayed(index)
    }
    const deleteUserById = (id: number, index: number): void => {
        dispatch(UserDeleteByIdThunk(id))
        displayMenuOptions(index)
        resetPage()
    }


    return (<>
        <userStyles.SectionPageUser>

            <userStyles.DivCtnFuncionality>
                <userStyles.DivCtnTableDisplayFilter>
                    <TableDisplayIndicator text='All Employee' onClick={() => handleTableFilter(ButtonType.all)} isSelected={selectedButton === ButtonType.all} />
                    <TableDisplayIndicator text='Active Employee' onClick={() => handleTableFilter(ButtonType.active)} isSelected={selectedButton === ButtonType.active} />
                    <TableDisplayIndicator text='Inactive Employee' onClick={() => handleTableFilter(ButtonType.inactive)} isSelected={selectedButton === ButtonType.inactive} />
                </userStyles.DivCtnTableDisplayFilter>

                <userStyles.DivCtnSearch>
                    <TableSearchTerm onchange={handleInputTerm} placeholder='Search employee by name' />
                </userStyles.DivCtnSearch>

                <userStyles.DivCtnButton>
                    <ButtonCreate onClick={navigateToUserCreate} children='+ New Employee' />
                </userStyles.DivCtnButton>
            </userStyles.DivCtnFuncionality>


            <Table rowlistlength={filteredUsers.length + 1} columnlistlength={nameColumnList.length}>
                {nameColumnList.map((nameColumn, index) =>
                    index === 1 || index === 2 ?
                        <THTable key={index} onClick={() => handleColumnClick(index === 1 ? columnsSortAvailable.name : columnsSortAvailable.startDate)} cursorPointer='yes'>
                            {nameColumn}
                            {index === 1 ? getArrowIcon(columnsSortAvailable.name) : getArrowIcon(columnsSortAvailable.startDate)}
                        </THTable> :
                        <THTable key={index}>{nameColumn}</THTable>
                )}
                {currentPageItems.map((userData: UserInterface, index: number) => {
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
                            <DivCtnOptions display={`${tableOptionsDisplayed === index ? 'flex' : 'none'}`} isInTable={true} >
                                <ButtonOption onClick={() => { navigateToUserUpdate(userData.id) }}>Update</ButtonOption>
                                <ButtonOption onClick={() => { deleteUserById(userData.id, index) }}>Delete</ButtonOption>
                            </DivCtnOptions>
                        </PTable>
                    ]
                }
                )}
            </Table>

            <paginationStyles.DivCtnPagination>
                <paginationStyles.ButtonSwitchPage onClick={resetPage} disabled={currentPage === 1} margin='0 1rem 0 0'>
                    &lt;&lt;
                </paginationStyles.ButtonSwitchPage>
                <paginationStyles.ButtonSwitchPage onClick={goToPrevPage} disabled={currentPage === 1}>
                    &lt;
                </paginationStyles.ButtonSwitchPage>
                <paginationStyles.SpanPageCount>
                    {currentPage} of {totalPages}
                </paginationStyles.SpanPageCount>
                <paginationStyles.ButtonSwitchPage onClick={goToNextPage} disabled={currentPage === totalPages}>
                    &gt;
                </paginationStyles.ButtonSwitchPage>
                <paginationStyles.ButtonSwitchPage onClick={lastPage} disabled={currentPage === totalPages} margin='0 0 0 1rem'>
                    &gt;&gt;
                </paginationStyles.ButtonSwitchPage>
            </paginationStyles.DivCtnPagination>

        </userStyles.SectionPageUser >
    </>)
}