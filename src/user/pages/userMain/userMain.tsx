
import React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"

import * as userMainStyles from "./userMainStyles"
import { UserButtonType } from "../../enums/userButtonType"
import { AppDispatch } from '../../../common/redux/store'
import { ApiStatus } from "../../../common/enums/ApiStatus"
import { UserInterface } from "./../../interfaces/userInterface"
import { formatDateForPrint } from '../../../common/utils/dateUtils'
import { getArrowIcon } from "common/utils/getArrowIcon"
import { sortValues } from "common/utils/sortValues"
import { capitalizeFirstLetter } from "common/utils/capitalizeFirstLetter"
import { ArrowType } from "../../../common/enums/ArrowType"
import { UserNameColumn } from "../../enums/userNameColumn"
import { TableDisplaySelector } from "../../../common/components/tableDisplaySelector/tableDisplaySelector"
import { TableSearchTerm } from "../../../common/components/tableSearchTerm/tableSearchTerm"
import { ButtonCreate } from "../../../common/components/buttonCreate/buttonCreate"
import {
    Table, THTable, DivNameTable, DivImgTable, ImgTableUser, PTable,
    PStatusAvailableUsers, IconPhone, IconOptions, DivCtnOptions, ButtonOption
} from "../../../common/styles/tableStyles"
import { usePagination } from "../../../common/hooks/usePagination"
import * as paginationStyles from '../../../common/styles/pagination'
import { getUserAllData, getUserAllStatus } from "./../../features/userSlice"
import { UserFetchAllThunk } from "./../../features/thunks/userFetchAllThunk"
import { UserDeleteByIdThunk } from "./../../features/thunks/userDeleteByIdThunk"


export const UserMain = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const userAll: UserInterface[] = useSelector(getUserAllData)
    const userAllLoading: ApiStatus = useSelector(getUserAllStatus)
    const [inputText, setInputText] = useState<string>('')
    const [tableOptionsDisplayed, setTableOptionsDisplayed] = useState<number>(-1)
    const [selectedButton, setSelectedButton] = useState<UserButtonType>(UserButtonType.all)
    const [filteredUsers, setFilteredUsers] = useState<UserInterface[]>([])
    const sortableColumns: UserNameColumn[] = [
        UserNameColumn.userInfo,
        UserNameColumn.role,
        UserNameColumn.startDate,
        UserNameColumn.endDate
    ]
    type ArrowStates = Partial<Record<UserNameColumn, ArrowType>>
    const [arrowStates, setArrowStates] = useState<ArrowStates>({
        [UserNameColumn.userInfo]: ArrowType.right,
        [UserNameColumn.role]: ArrowType.right,
        [UserNameColumn.startDate]: ArrowType.right,
        [UserNameColumn.endDate]: ArrowType.right
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

    const handleInputTerm = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setInputText(e.target.value)
        resetPage()
    }
    const handleTableFilter = (type: UserButtonType): void => {
        setSelectedButton(type)
        displayEmployee()
    }
    const displayEmployee = (): void => {
        let filteredData: UserInterface[]
        switch (selectedButton) {
            case UserButtonType.all:
                filteredData = userAll.filter(user =>
                    user.full_name.toLowerCase().includes(inputText.toLowerCase())
                )
                break
            case UserButtonType.active:
                filteredData = userAll.filter(user =>
                    user.full_name.toLowerCase().includes(inputText.toLowerCase())
                    && new Date(user.start_date) < new Date()
                    && new Date(user.end_date) > new Date()
                )
                break
            case UserButtonType.inactive:
                filteredData = userAll.filter(user =>
                    user.full_name.toLowerCase().includes(inputText.toLowerCase())
                    && (new Date(user.start_date) > new Date()
                        || new Date(user.end_date) < new Date())
                )
                break
            // !!! AÑADIR OPION PARA VER TAMBIEN ARCHIVADOS:
        }
        setFilteredUsers(sortData(filteredData))
        resetPage()
    }
    const sortData = (filteredData: UserInterface[]): UserInterface[] => {
        const arrowStateColumns = Object.keys(arrowStates) as UserNameColumn[]
        const activeColumn = arrowStateColumns.find(key => arrowStates[key] !== ArrowType.right)
        if (!activeColumn) return filteredData

        const activeColumnArrowDirection = arrowStates[activeColumn]!
        const sortedData = [...filteredData]

        sortedData.sort((a, b) => {
            let valueA: any
            let valueB: any
            switch (activeColumn) {
                case UserNameColumn.userInfo:
                case UserNameColumn.role:
                    valueA = a.full_name.toLowerCase()
                    valueB = b.full_name.toLowerCase()
                    break
                case UserNameColumn.startDate:
                    valueA = new Date(a.start_date).getTime()
                    valueB = new Date(b.start_date).getTime()
                    break
                case UserNameColumn.endDate:
                    valueA = new Date(a.end_date).getTime()
                    valueB = new Date(b.end_date).getTime()
                    break
                default:
                    return 0
            }

            return sortValues(valueA, valueB, activeColumnArrowDirection)
        })

        return sortedData
    }
    const handleColumnClick = (nameColumn: UserNameColumn): void => {
        setArrowStates(prevState => {
            const newState: Partial<Record<UserNameColumn, ArrowType>> = { ...prevState }

            if (newState[nameColumn] === ArrowType.right) { newState[nameColumn] = ArrowType.down }
            else if (newState[nameColumn] === ArrowType.down) { newState[nameColumn] = ArrowType.up }
            else if (newState[nameColumn] === ArrowType.up) { newState[nameColumn] = ArrowType.down }

            sortableColumns.forEach(col => {
                if (col !== nameColumn) {
                    newState[col] = ArrowType.right
                }
            })

            return newState
        })

        handleTableFilter(selectedButton)
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
                    <ButtonCreate onClick={() => navigate('user-create')} children='+ New Employee' />
                </userMainStyles.DivCtnButton>
            </userMainStyles.DivCtnFuncionality>

            {/* length + 2 debido a las 2 columnas añadidas sin encabezado */}
            <Table rowlistlength={filteredUsers.length + 1} columnlistlength={Object.values(UserNameColumn).length + 2}>
                <THTable>{''}</THTable>
                {Object.values(UserNameColumn).map(entry => {
                    if (sortableColumns.includes(entry)) {
                        return (
                            <THTable key={entry} onClick={() => handleColumnClick(entry)} cursorPointer="yes">
                                {entry}
                                {getArrowIcon(arrowStates[entry])}
                            </THTable>
                        )
                    }
                    else {
                        return (
                            <THTable key={entry}>
                                {entry}
                            </THTable>
                        )
                    }
                })}
                <THTable>{''}</THTable>
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

                        <PTable key={index + '-7'}>
                            {capitalizeFirstLetter(userData.role)}
                        </PTable>,

                        <PTable key={index + '-6'}>
                            {userData.job_position}
                        </PTable>,

                        <PTable key={index + '-4'}>
                            {formatDateForPrint(userData.start_date)}
                        </PTable>,

                        <PTable key={index + '-5'}>
                            {formatDateForPrint(userData.end_date)}
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
                                <ButtonOption onClick={() => { () => navigate(`user-update/${userData._id}`) }}>Update</ButtonOption>
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