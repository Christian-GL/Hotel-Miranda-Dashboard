
import React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"

import { SectionPage, CtnFuncionality, CtnAllDisplayFilter, CtnTableDisplayFilter, CtnSearch, CtnButton } from "../../../common/styles/funcionalityStyles"
import { useLoginOptionsContext } from "../../../signIn/features/loginProvider"
import { ActiveButtonType } from "../../../common/enums/activeButtonType"
import { ArchivedButtonType } from "../../../common/enums/archivedButtonType"
import { AppDispatch } from '../../../common/redux/store'
import { ApiStatus } from "../../../common/enums/ApiStatus"
import { Role } from "../../enums/role"
import { UserInterfaceId } from "./../../interfaces/userInterface"
import { formatDateForPrint } from '../../../common/utils/dateUtils'
import { getArrowIcon } from "common/utils/getArrowIcon"
import { sortValues } from "common/utils/sortValues"
import { handleColumnClick } from "common/utils/handleColumnClick"
import { handleNonAdminClick } from 'common/utils/nonAdminPopupMessage'
import { customPopupMessage } from 'common/utils/customPopupMessage'
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
    EmptyTableMessage, Table, TitleColumn, ImgTableUser, CtnCell, TextCell, TextId,
    TextStatusAvailableUsers, IconPhone, CtnMenuOptions, IconOptions, CtnOptions, ButtonOption
} from "../../../common/styles/tableStyles"
import { usePagination } from "../../../common/hooks/usePagination"
import { getUserAllData, getUserAllStatus, getUserErrorMessage } from "./../../features/userSlice"
import { UserFetchAllThunk } from "./../../features/thunks/userFetchAllThunk"
import { UserUpdateThunk } from "./../../features/thunks/userUpdateThunk"
import { UserDeleteByIdThunk } from "./../../features/thunks/userDeleteByIdThunk"


export const UserMain = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const { getRole } = useLoginOptionsContext()
    const userAll: UserInterfaceId[] = useSelector(getUserAllData)
    const userAllLoading: ApiStatus = useSelector(getUserAllStatus)
    const userErrorMessage = useSelector(getUserErrorMessage)
    const [inputText, setInputText] = useState<string>('')
    const [tableOptionsDisplayed, setTableOptionsDisplayed] = useState<string>('')
    const [activeFilterButton, setActiveFilterButton] = useState<ActiveButtonType>(ActiveButtonType.active)
    const [archivedFilterButton, setArchivedFilterButton] = useState<ArchivedButtonType>(ArchivedButtonType.notArchived)
    const [filteredUsers, setFilteredUsers] = useState<UserInterfaceId[]>([])
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
    } = usePagination<UserInterfaceId>(filteredUsers, 10)

    useEffect(() => {
        if (userAllLoading === ApiStatus.idle) { dispatch(UserFetchAllThunk()) }
        else if (userAllLoading === ApiStatus.fulfilled) { displayEmployee() }
        else if (userAllLoading === ApiStatus.rejected && userErrorMessage) { customPopupMessage(setInfoPopup, setShowPopup, 'API Error', userErrorMessage) }
    }, [userAllLoading, userAll, inputText, activeFilterButton, archivedFilterButton, arrowStates])

    const filterByIdOrName = (users: UserInterfaceId[], searchText: string): UserInterfaceId[] => {
        const normalizedText = searchText.toLowerCase()
        return users.filter(user =>
            user._id.toLocaleLowerCase().includes(normalizedText)
            || user.full_name.toLowerCase().includes(normalizedText)
        )
    }
    const filterByActiveStatus = (users: UserInterfaceId[], activeFilterButton: ActiveButtonType): UserInterfaceId[] => {
        const now = new Date()
        switch (activeFilterButton) {
            case ActiveButtonType.active:
                return users.filter(user =>
                    new Date(user.start_date) < now
                    && new Date(user.end_date) > now
                )
            case ActiveButtonType.inactive:
                return users.filter(user =>
                    new Date(user.start_date) > now
                    || new Date(user.end_date) < now
                )
            case ActiveButtonType.all:
            default:
                return users
        }
    }
    const filterByArchivedStatus = (users: UserInterfaceId[], archivedFilterButton: ArchivedButtonType): UserInterfaceId[] => {
        switch (archivedFilterButton) {
            case ArchivedButtonType.archived:
                return users.filter(user => user.isArchived === OptionYesNo.yes)

            case ArchivedButtonType.notArchived:
                return users.filter(user => user.isArchived === OptionYesNo.no)

            case ArchivedButtonType.all:
            default:
                return users
        }
    }
    const displayEmployee = (): void => {
        let filteredData = userAll

        filteredData = filterByIdOrName(filteredData, inputText)
        filteredData = filterByActiveStatus(filteredData, activeFilterButton)
        filteredData = filterByArchivedStatus(filteredData, archivedFilterButton)

        setFilteredUsers(sortData(filteredData))
        resetPage()
    }
    const sortData = (filteredData: UserInterfaceId[]): UserInterfaceId[] => {
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
    const displayMenuOptions = (id: string): void => {
        tableOptionsDisplayed === id
            ? setTableOptionsDisplayed('')
            : setTableOptionsDisplayed(id)
    }
    // !!! ESTA FUNCIÓN PUEDE SER COMÚN (DELETE TAMBIÉN)
    const toggleArchivedUser = async (user: UserInterfaceId): Promise<void> => {
        const updatedUser = {
            ...user,
            isArchived: user.isArchived === OptionYesNo.no
                ? OptionYesNo.yes
                : OptionYesNo.no
        }
        try {
            await dispatch(UserUpdateThunk({ idUser: user._id, updatedUserData: updatedUser })).unwrap()
            displayMenuOptions(user._id)
            resetPage()
        }
        catch (error) {
            customPopupMessage(setInfoPopup, setShowPopup, 'API Error', String(error))
        }
    }
    const deleteUserById = async (id: string): Promise<void> => {
        try {
            await dispatch(UserDeleteByIdThunk(id)).unwrap()
            displayMenuOptions(id)
            resetPage()
        }
        catch (error) {
            customPopupMessage(setInfoPopup, setShowPopup, 'API Error', String(error))
        }
    }


    return (<>
        <SectionPage>

            <CtnFuncionality>
                <CtnAllDisplayFilter>
                    <CtnTableDisplayFilter>
                        <TableDisplaySelector text='All Employee' onClick={() => setActiveFilterButton(ActiveButtonType.all)} isSelected={activeFilterButton === ActiveButtonType.all} />
                        <TableDisplaySelector text='Active' onClick={() => setActiveFilterButton(ActiveButtonType.active)} isSelected={activeFilterButton === ActiveButtonType.active} />
                        <TableDisplaySelector text='Inactive' onClick={() => setActiveFilterButton(ActiveButtonType.inactive)} isSelected={activeFilterButton === ActiveButtonType.inactive} />
                    </CtnTableDisplayFilter>
                    <CtnTableDisplayFilter>
                        <TableDisplaySelector text='All Employee' onClick={() => setArchivedFilterButton(ArchivedButtonType.all)} isSelected={archivedFilterButton === ArchivedButtonType.all} />
                        <TableDisplaySelector text='Not Archived' onClick={() => setArchivedFilterButton(ArchivedButtonType.notArchived)} isSelected={archivedFilterButton === ArchivedButtonType.notArchived} />
                        <TableDisplaySelector text='Archived' onClick={() => setArchivedFilterButton(ArchivedButtonType.archived)} isSelected={archivedFilterButton === ArchivedButtonType.archived} />
                    </CtnTableDisplayFilter>
                </CtnAllDisplayFilter>

                <CtnSearch>
                    <TableSearchTerm
                        onchange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setInputText(e.target.value)
                            resetPage()
                        }}
                        placeholder="Search user by ID/name"
                    />
                </CtnSearch>

                <CtnButton>
                    <ButtonCreate
                        disabledClick={getRole() !== Role.admin}
                        onClick={getRole() === Role.admin ? () => navigate('user-create') : () => handleNonAdminClick(setInfoPopup, setShowPopup)}
                    >
                        + New Employee
                    </ButtonCreate>
                </CtnButton>

            </CtnFuncionality>

            {showPopup && <PopupText isSlider={false} title={infoPopup.title} text={infoPopup.text} onClose={() => setShowPopup(false)} />}

            {currentPageItems.length === 0
                ? <EmptyTableMessage>No users found</EmptyTableMessage>
                : <Table rowlistlength={filteredUsers.length + 1} columnlistlength={Object.values(UserNameColumn).length + 2}>
                    <TitleColumn>{''}</TitleColumn>
                    {Object.values(UserNameColumn).map(entry => {
                        if (sortableColumns.includes(entry)) {
                            return (
                                <TitleColumn
                                    key={entry}
                                    onClick={() => handleColumnClick(entry, sortableColumns, setArrowStates, () => displayEmployee())}
                                    isCursorPointer={true}
                                >
                                    {entry}
                                    {getArrowIcon(arrowStates[entry])}
                                </TitleColumn>
                            )
                        }
                        else {
                            return (
                                <TitleColumn key={entry}>
                                    {entry}
                                </TitleColumn>
                            )
                        }
                    })}
                    <TitleColumn>{''}</TitleColumn>
                    {currentPageItems.map(userData => (
                        <React.Fragment key={userData._id}>
                            <CtnCell>
                                <ImgTableUser src={`${userData.photo}`} />
                            </CtnCell>

                            <CtnCell flexdirection='column' alignitems='left' justifycontent='center'>
                                <TextCell isName={true}>{userData.full_name}</TextCell>
                                <TextCell>{userData.email}</TextCell>
                                <TextId>#{userData._id}</TextId>
                            </CtnCell>

                            <CtnCell>
                                <IconPhone />
                                <TextCell>{userData.phone_number}</TextCell>
                            </CtnCell>

                            <CtnCell>
                                <TextCell>{capitalizeFirstLetter(userData.role)}</TextCell>
                            </CtnCell>

                            <CtnCell>
                                <TextCell isTextBreakable={true} minWidth="15rem">{userData.job_position}</TextCell>
                            </CtnCell>

                            <CtnCell>
                                <TextCell>{formatDateForPrint(userData.start_date)}</TextCell>
                            </CtnCell>

                            <CtnCell>
                                <TextCell>{formatDateForPrint(userData.end_date)}</TextCell>
                            </CtnCell>

                            <CtnCell>
                                {new Date(userData.start_date) < new Date() && new Date(userData.end_date) > new Date()
                                    ? <TextStatusAvailableUsers active={true}>Active</TextStatusAvailableUsers>
                                    : <TextStatusAvailableUsers active={false}>Inactive</TextStatusAvailableUsers>
                                }
                            </CtnCell>

                            <CtnCell>
                                {userData.isArchived === OptionYesNo.no
                                    ? <TextStatusAvailableUsers active={true}>Active</TextStatusAvailableUsers>
                                    : <TextStatusAvailableUsers active={false}>Archived</TextStatusAvailableUsers>
                                }
                            </CtnCell>

                            <CtnCell justifycontent="flex-end">
                                <CtnMenuOptions>
                                    <IconOptions onClick={() => { displayMenuOptions(userData._id) }} />
                                    <CtnOptions display={`${tableOptionsDisplayed === userData._id ? 'flex' : 'none'}`} isInTable={true} >
                                        <ButtonOption
                                            // !!! SI EL USUARIO SE QUIERE EDITAR A SI MISMO (REPLANTEAR CONCEPTO):
                                            // onClick={getRole() === Role.admin || userData._id === localStorage.getItem('loggedUserID')
                                            onClick={getRole() === Role.admin
                                                ? () => { navigate(`user-update/${userData._id}`) }
                                                : () => handleNonAdminClick(setInfoPopup, setShowPopup)}
                                            // disabledClick={!(getRole() === Role.admin || userData._id === localStorage.getItem('loggedUserID'))}
                                            disabledClick={getRole() !== Role.admin}
                                        >Update
                                        </ButtonOption>
                                        <ButtonOption
                                            onClick={getRole() === Role.admin
                                                ? () => { toggleArchivedUser(userData) }
                                                : () => handleNonAdminClick(setInfoPopup, setShowPopup)}
                                            disabledClick={getRole() !== Role.admin}
                                        >{userData.isArchived === OptionYesNo.no ? 'Archive' : 'Unarchive'}
                                        </ButtonOption>
                                        <ButtonOption
                                            onClick={getRole() === Role.admin
                                                ? () => { deleteUserById(userData._id) }
                                                : () => handleNonAdminClick(setInfoPopup, setShowPopup)}
                                            disabledClick={getRole() !== Role.admin}
                                        >Delete
                                        </ButtonOption>
                                    </CtnOptions>
                                </CtnMenuOptions>
                            </CtnCell>
                        </React.Fragment>
                    ))}
                </Table>
            }

            <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onReset={resetPage}
                onPrev={goToPrevPage}
                onNext={goToNextPage}
                onLast={lastPage}
            />

        </SectionPage >
    </>)
}