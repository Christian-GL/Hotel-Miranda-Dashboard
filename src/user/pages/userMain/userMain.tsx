
import React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"

import * as userMainStyles from "./userMainStyles.ts"
import { UserButtonType } from "../../enums/userButtonType.ts"
import { UserColumnSort } from '../../enums/userColumnSort.ts'
import { AppDispatch } from '../../../common/redux/store.ts'
import { ApiStatus } from "../../../common/enums/ApiStatus.ts"
import { UserInterface } from "./../../interfaces/userInterface.ts"
import { UserColumnsArrowStatesInterface } from "./../../interfaces/userColumnsArrowStatesInterface.ts"
import { formatDateForPrint } from '../../../common/utils/dateUtils.ts'
import { ArrowType } from "../../../common/enums/ArrowType.ts"
import { TableDisplaySelector } from "../../../common/components/tableDisplaySelector/tableDisplaySelector.tsx"
import { TableSearchTerm } from "../../../common/components/tableSearchTerm/tableSearchTerm.tsx"
import { ButtonCreate } from "../../../common/components/buttonCreate/buttonCreate.tsx"
import {
    Table, THTable, TriangleUp, TriangleRight, TriangleDown, DivNameTable, DivImgTable, ImgTableUser, PTable,
    PStatusAvailableUsers, IconPhone, IconOptions, DivCtnOptions, ButtonOption
} from "../../../common/styles/tableStyles.ts"
import { usePagination } from "../../../common/hooks/usePagination.ts"
import * as paginationStyles from '../../../common/styles/pagination.ts'
import { getUserAllData, getUserAllStatus } from "./../../features/userSlice.ts"
import { UserFetchAllThunk } from "./../../features/thunks/userFetchAllThunk.ts"
import { UserDeleteByIdThunk } from "./../../features/thunks/userDeleteByIdThunk.ts"


export const UserMain = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const nameColumnList: string[] = ['', 'Personal data', 'Phone number', 'Start date', 'End date', 'Job position', 'Role', 'Status', '']
    const userAll: UserInterface[] = useSelector(getUserAllData)
    const userAllLoading: ApiStatus = useSelector(getUserAllStatus)
    const [inputText, setInputText] = useState<string>('')
    const [tableOptionsDisplayed, setTableOptionsDisplayed] = useState<number>(-1)
    const [selectedButton, setSelectedButton] = useState<UserButtonType>(UserButtonType.all)
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
        else if (userAllLoading === ApiStatus.rejected) { alert("Error in API userMain") }
    }, [userAllLoading, userAll, inputText, selectedButton, arrowStates])

    const navigateToUserCreate = () => navigate('user-create')
    const navigateToUserUpdate = (id: string) => navigate(`user-update/${id}`)

    const handleInputTerm = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setInputText(e.target.value)
        resetPage()
    }
    const handleTableFilter = (type: UserButtonType): void => {
        setSelectedButton(type)
        displayEmployee()
    }
    const displayEmployee = (): void => {
        // !!! FUNCIÓN OPTIMIZABLE:
        let filteredData: UserInterface[]
        switch (selectedButton) {
            case UserButtonType.all:
                filteredData = userAll.filter(user =>
                    user.full_name.toLowerCase().includes(inputText.toLowerCase())
                )
                break
            case UserButtonType.active:
                filteredData = userAll.filter(user =>
                    user.full_name.toLowerCase().includes(inputText.toLowerCase()) && new Date(user.start_date) < new Date() && new Date(user.end_date) > new Date()
                )
                break
            case UserButtonType.inactive:
                filteredData = userAll.filter(user =>
                    user.full_name.toLowerCase().includes(inputText.toLowerCase()) && (new Date(user.start_date) > new Date() || new Date(user.end_date) < new Date())
                )
                break
            // !!! AÑADIR OPION PARA VER TAMBIEN ARCHIVADOS:
        }
        const sortedData = sortData(filteredData)
        setFilteredUsers(sortedData)
        resetPage()
    }
    const sortData = (filteredData: UserInterface[]): UserInterface[] => {
        // !!! OPTIMIZAR LA SIGUIENTE LINEA:
        const activeColumn = (Object.keys(arrowStates) as (keyof UserColumnsArrowStatesInterface)[]).find(key => arrowStates[key] !== ArrowType.right)
        let sortedData: UserInterface[] = [...filteredData]
        if (activeColumn) {
            if (activeColumn === UserColumnSort.name) {
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
            else if (activeColumn === UserColumnSort.startDate) {
                sortedData.sort((a, b) => {
                    let valueA: Date = new Date(a.start_date)
                    let valueB: Date = new Date(b.start_date)
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
    const handleColumnClick = (nameColumn: UserColumnSort): void => {
        setArrowStates(prevState => {
            const newState: UserColumnsArrowStatesInterface = { ...prevState }

            if (newState[nameColumn] === ArrowType.right) { newState[nameColumn] = ArrowType.down }
            else if (newState[nameColumn] === ArrowType.down) { newState[nameColumn] = ArrowType.up }
            else if (newState[nameColumn] === ArrowType.up) { newState[nameColumn] = ArrowType.down }

            Object.keys(newState as UserColumnsArrowStatesInterface).forEach((key) => {
                const typedKey = key as keyof UserColumnsArrowStatesInterface

                if (typedKey !== nameColumn) {
                    newState[typedKey] = ArrowType.right
                }
            })

            return newState
        })
        handleTableFilter(selectedButton)
    }
    const getArrowIcon = (nameColumn: UserColumnSort): JSX.Element => {
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
    const deleteUserById = (id: string, index: number): void => {
        dispatch(UserDeleteByIdThunk(id))
        displayMenuOptions(index)
        resetPage()
    }


    return (<>
        <userMainStyles.SectionPageUser>

            <userMainStyles.DivCtnFuncionality>
                <userMainStyles.DivCtnTableDisplayFilter>
                    <TableDisplaySelector text='All Employee' onClick={() => handleTableFilter(UserButtonType.all)} isSelected={selectedButton === UserButtonType.all} />
                    <TableDisplaySelector text='Active Employee' onClick={() => handleTableFilter(UserButtonType.active)} isSelected={selectedButton === UserButtonType.active} />
                    <TableDisplaySelector text='Inactive Employee' onClick={() => handleTableFilter(UserButtonType.inactive)} isSelected={selectedButton === UserButtonType.inactive} />
                </userMainStyles.DivCtnTableDisplayFilter>

                <userMainStyles.DivCtnSearch>
                    <TableSearchTerm onchange={handleInputTerm} placeholder='Search employee by name' />
                </userMainStyles.DivCtnSearch>

                <userMainStyles.DivCtnButton>
                    <ButtonCreate onClick={navigateToUserCreate} children='+ New Employee' />
                </userMainStyles.DivCtnButton>
            </userMainStyles.DivCtnFuncionality>


            <Table rowlistlength={filteredUsers.length + 1} columnlistlength={nameColumnList.length}>
                {nameColumnList.map((nameColumn, index) =>
                    index === 1 || index === 2 ?
                        <THTable key={index} onClick={() => handleColumnClick(index === 1 ? UserColumnSort.name : UserColumnSort.startDate)} cursorPointer='yes'>
                            {nameColumn}
                            {index === 1 ? getArrowIcon(UserColumnSort.name) : getArrowIcon(UserColumnSort.startDate)}
                        </THTable> :
                        <THTable key={index}>{nameColumn}</THTable>
                )}
                {currentPageItems.map((userData: UserInterface, index: number) => {
                    return [
                        <DivImgTable key={index + '-1'}>
                            <ImgTableUser src={`${userData.photo}`} />
                        </DivImgTable>,

                        <PTable key={index + '-2'} flexdirection='column' alignitems='left' justifycontent='center'>
                            <DivNameTable>
                                <b>{userData.full_name}</b>
                            </DivNameTable>
                            <div>{userData.email}</div>
                            <div>#<b>{userData._id}</b></div>
                        </PTable>,

                        <PTable key={index + '-3'}>
                            <IconPhone />
                            {userData.phone_number}
                        </PTable>,

                        <PTable key={index + '-4'}>
                            {formatDateForPrint(userData.start_date)}
                        </PTable>,

                        <PTable key={index + '-5'}>
                            {formatDateForPrint(userData.end_date)}
                        </PTable>,

                        <PTable key={index + '-6'}>
                            {userData.job_position}
                        </PTable>,

                        <PTable key={index + '-7'}>
                            {userData.role}
                        </PTable>,

                        <PTable key={index + '-9'}>
                            {new Date(userData.start_date) < new Date() && new Date(userData.end_date) > new Date() ?
                                <PStatusAvailableUsers active={true}>
                                    Active
                                </PStatusAvailableUsers>
                                :
                                <PStatusAvailableUsers active={false}>
                                    Inactive
                                </PStatusAvailableUsers>
                            }
                        </PTable>,

                        <PTable key={index + '-10'}>
                            <IconOptions onClick={() => { displayMenuOptions(index) }} />
                            <DivCtnOptions display={`${tableOptionsDisplayed === index ? 'flex' : 'none'}`} isInTable={true} >
                                <ButtonOption onClick={() => { navigateToUserUpdate(userData._id) }}>Update</ButtonOption>
                                <ButtonOption onClick={() => { deleteUserById(userData._id, index) }}>Delete</ButtonOption>
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

        </userMainStyles.SectionPageUser >
    </>)
}