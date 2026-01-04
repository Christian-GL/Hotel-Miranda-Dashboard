
import React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"

import * as userMainStyles from "./userMainStyles"
import { CtnFuncionality, CtnAllDisplayFilter, CtnTableDisplayFilter, CtnSearch, CtnButton } from "../../../common/styles/funcionalityStyles"
import { useLoginOptionsContext } from "../../../signIn/features/loginProvider"
import { UserButtonType } from "../../enums/userButtonType"
import { AppDispatch } from '../../../common/redux/store'
import { ApiStatus } from "../../../common/enums/ApiStatus"
import { Role } from "../../enums/role"
import { UserInterface } from "./../../interfaces/userInterface"
import { formatDateForPrint } from '../../../common/utils/dateUtils'
import { getArrowIcon } from "common/utils/getArrowIcon"
import { sortValues } from "common/utils/sortValues"
import { handleColumnClick } from "common/utils/handleColumnClick"
import { capitalizeFirstLetter } from "common/utils/capitalizeFirstLetter"
import { ArrowType } from "../../../common/enums/ArrowType"
import { OptionYesNo } from "common/enums/optionYesNo"
import { UserNameColumn } from "../../enums/userNameColumn"
import { PopupText } from "../../../common/components/popupText/popupText"
import { PopupTextInterface } from '../../../common/interfaces/popupTextInterface'
import { TableDisplaySelector } from "../../../common/components/tableDisplaySelector/tableDisplaySelector"
import { TableSearchTerm } from "../../../common/components/tableSearchTerm/tableSearchTerm"
import { TablePagination } from "../../../common/components/tablePagination/tablePagination"
import { ButtonCreate } from "../../../common/components/buttonCreate/buttonCreate"
import {
    Table, THTable, DivNameTable, DivImgTable, ImgTableUser, PTable,
    PStatusAvailableUsers, IconPhone, IconOptions, DivCtnOptions, ButtonOption
} from "../../../common/styles/tableStyles"
import { usePagination } from "../../../common/hooks/usePagination"
import { getUserAllData, getUserAllStatus } from "./../../features/userSlice"
import { UserFetchAllThunk } from "./../../features/thunks/userFetchAllThunk"
import { UserUpdateThunk } from "./../../features/thunks/userUpdateThunk"
import { UserDeleteByIdThunk } from "./../../features/thunks/userDeleteByIdThunk"


export const UserMain = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const { getRole } = useLoginOptionsContext()
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
        [UserNameColumn.userInfo]: ArrowType.down,
        [UserNameColumn.role]: ArrowType.right,
        [UserNameColumn.startDate]: ArrowType.right,
        [UserNameColumn.endDate]: ArrowType.right
    })
    const [showPopup, setShowPopup] = useState<boolean>(false)
    const [infoPopup, setInfoPopup] = useState<PopupTextInterface>({ title: '', text: '' })
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
    const handleTableFilter = (selectedButton: UserButtonType): void => {
        setSelectedButton(selectedButton)
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
                    valueA = a.full_name.toLowerCase()
                    valueB = b.full_name.toLowerCase()
                    break
                case UserNameColumn.role:
                    valueA = a.role.toLowerCase()
                    valueB = b.role.toLowerCase()
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
    const displayMenuOptions = (index: number): void => {
        tableOptionsDisplayed === index ?
            setTableOptionsDisplayed(-1) :
            setTableOptionsDisplayed(index)
    }
    const archiveUserById = (id: string, user: UserInterface, index: number): void => {
        const updatedUser = {
            ...user,
            isArchived: OptionYesNo.yes
        }
        dispatch(UserUpdateThunk({ idUser: id, updatedUserData: updatedUser }))
        displayMenuOptions(index)
        resetPage()
    }
    const deleteUserById = (id: string, index: number): void => {
        dispatch(UserDeleteByIdThunk(id))
        displayMenuOptions(index)
        resetPage()
    }
    const handleNonAdminClick = () => {
        setInfoPopup({
            title: 'Access denied',
            text: 'You need administrator privileges to perform this operation'
        })
        setShowPopup(true)
    }


    return (<>
        <userMainStyles.SectionPageUser>

            <CtnFuncionality>
                <CtnAllDisplayFilter>
                    <CtnTableDisplayFilter>
                        <TableDisplaySelector text='All Employee' onClick={() => handleTableFilter(UserButtonType.all)} isSelected={selectedButton === UserButtonType.all} />
                        <TableDisplaySelector text='Active' onClick={() => handleTableFilter(UserButtonType.active)} isSelected={selectedButton === UserButtonType.active} />
                        <TableDisplaySelector text='Inactive' onClick={() => handleTableFilter(UserButtonType.inactive)} isSelected={selectedButton === UserButtonType.inactive} />
                    </CtnTableDisplayFilter>
                    <CtnTableDisplayFilter>
                        <TableDisplaySelector text='All Employee' onClick={() => handleTableFilter(UserButtonType.all)} isSelected={selectedButton === UserButtonType.all} />
                        <TableDisplaySelector text='Not Archived' onClick={() => handleTableFilter(UserButtonType.active)} isSelected={selectedButton === UserButtonType.active} />
                        <TableDisplaySelector text='Archived' onClick={() => handleTableFilter(UserButtonType.inactive)} isSelected={selectedButton === UserButtonType.inactive} />
                    </CtnTableDisplayFilter>
                </CtnAllDisplayFilter>

                <CtnSearch>
                    <TableSearchTerm onchange={handleInputTerm} placeholder='Search employee by name' />
                </CtnSearch>

                <CtnButton>
                    <ButtonCreate
                        disabledClick={getRole() !== Role.admin}
                        onClick={getRole() === Role.admin ? () => navigate('user-create') : handleNonAdminClick}
                    >
                        + New Employee
                    </ButtonCreate>
                </CtnButton>

            </CtnFuncionality>

            {showPopup && <PopupText isSlider={false} title={infoPopup.title} text={infoPopup.text} onClose={() => setShowPopup(false)} />}

            <Table rowlistlength={filteredUsers.length + 1} columnlistlength={Object.values(UserNameColumn).length + 2}>
                <THTable>{''}</THTable>
                {Object.values(UserNameColumn).map(entry => {
                    if (sortableColumns.includes(entry)) {
                        return (
                            <THTable
                                key={entry}
                                onClick={() => handleColumnClick(entry, sortableColumns, setArrowStates, () => displayEmployee())}
                                cursorPointer="yes"
                            >
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

                        <PTable key={index + '-4'}>
                            {capitalizeFirstLetter(userData.role)}
                        </PTable>,

                        <PTable key={index + '-5'}>
                            {userData.job_position}
                        </PTable>,

                        <PTable key={index + '-6'}>
                            {formatDateForPrint(userData.start_date)}
                        </PTable>,

                        <PTable key={index + '-7'}>
                            {formatDateForPrint(userData.end_date)}
                        </PTable>,

                        <PTable key={index + '-8'}>
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

                        <PTable key={index + '-9'}>
                            <IconOptions onClick={() => { displayMenuOptions(index) }} />
                            <DivCtnOptions display={`${tableOptionsDisplayed === index ? 'flex' : 'none'}`} isInTable={true} >
                                <ButtonOption
                                    // !!! SI EL USUARIO SE QUIERE EDITAR A SI MISMO (REPLANTEAR CONCEPTO):
                                    // onClick={getRole() === Role.admin || userData._id === localStorage.getItem('loggedUserID')
                                    onClick={getRole() === Role.admin
                                        ? () => { navigate(`user-update/${userData._id}`) }
                                        : handleNonAdminClick}
                                    // disabledClick={!(getRole() === Role.admin || userData._id === localStorage.getItem('loggedUserID'))}
                                    disabledClick={getRole() !== Role.admin}
                                >Update
                                </ButtonOption>
                                <ButtonOption
                                    onClick={getRole() === Role.admin
                                        ? () => { archiveUserById(userData._id, userData, index) }
                                        : handleNonAdminClick}
                                    disabledClick={getRole() !== Role.admin}
                                >Archive
                                </ButtonOption>
                                <ButtonOption
                                    onClick={getRole() === Role.admin
                                        ? () => { deleteUserById(userData._id, index) }
                                        : handleNonAdminClick}
                                    disabledClick={getRole() !== Role.admin}
                                >Delete
                                </ButtonOption>
                            </DivCtnOptions>
                        </PTable>
                    ]
                }
                )}
            </Table>

            <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onReset={resetPage}
                onPrev={goToPrevPage}
                onNext={goToNextPage}
                onLast={lastPage}
            />

        </userMainStyles.SectionPageUser >
    </>)
}