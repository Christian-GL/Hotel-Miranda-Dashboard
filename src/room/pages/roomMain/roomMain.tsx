
import React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"

import { SectionPage, CtnFuncionality, CtnAllDisplayFilter, CtnTableDisplayFilter, CtnSearch, CtnButton } from "../../../common/styles/funcionalityStyles"
import { useLoginOptionsContext } from "../../../signIn/features/loginProvider"
import { ActiveButtonType } from "../../../common/enums/activeButtonType"
import { ArchivedButtonType } from "../../../common/enums/archivedButtonType"
import { RoomButtonType } from "../../enums/roomButtonType"
import { AppDispatch } from '../../../common/redux/store'
import { ApiStatus } from "../../../common/enums/ApiStatus"
import { Role } from "../../../user/enums/role"
import { RoomInterfaceId } from "./../../interfaces/roomInterface"
import { getArrowIcon } from "common/utils/getArrowIcon"
import { sortValues } from "common/utils/sortValues"
import { handleColumnClick } from "common/utils/handleColumnClick"
import { handleNonAdminClick } from 'common/utils/nonAdminPopupMessage'
import { customPopupMessage } from 'common/utils/customPopupMessage'
import { ArrowType } from "../../../common/enums/ArrowType"
import { OptionYesNo } from "common/enums/optionYesNo"
import { RoomNameColumn } from "../../enums/roomNameColumn"
import { PopupText } from "../../../common/components/popupText/popupText"
import { PopupTextInterface } from '../../../common/interfaces/popupTextInterface'
import { TableDisplaySelector } from "../../../common/components/tableDisplaySelector/tableDisplaySelector"
import { TableSearchTerm } from "../../../common/components/tableSearchTerm/tableSearchTerm"
import { TablePagination } from "../../../common/components/tablePagination/tablePagination"
import { ButtonCreate } from "../../../common/components/buttonCreate/buttonCreate"
import { applyDiscount } from "../../../common/utils/tableUtils"
import { usePagination } from "../../../common/hooks/usePagination"
import {
    EmptyTableMessage, Table, TitleColumn, TriangleUp, TriangleRight, TriangleDown, CtnImgTable, TextStatusAvailableUsers,
    ImgTableRoom, CtnCell, TextStatusRoomList, CtnMenuOptions, IconOptions, CtnOptions, ButtonOption
} from "../../../common/styles/tableStyles"
import { getRoomAllData, getRoomAllStatus, getRoomErrorMessage } from "./../../features/roomSlice"
import { RoomFetchAllThunk } from "./../../features/thunks/roomFetchAllThunk"
import { RoomUpdateThunk } from "./../../features/thunks/roomUpdateThunk"
import { RoomDeleteByIdThunk } from "./../../features/thunks/roomDeleteByIdThunk"
import { getBookingAllData, getBookingAllStatus, getBookingErrorMessage } from "../../../booking/features/bookingSlice"
import { BookingFetchAllThunk } from "../../../booking/features/thunks/bookingFetchAllThunk"
import { BookingInterfaceId } from "../../../booking/interfaces/bookingInterface"


export const RoomMain = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const { getRole } = useLoginOptionsContext()
    const roomAll: RoomInterfaceId[] = useSelector(getRoomAllData)
    const roomAllLoading: ApiStatus = useSelector(getRoomAllStatus)
    const roomErrorMessage = useSelector(getRoomErrorMessage)
    const bookingAll: BookingInterfaceId[] = useSelector(getBookingAllData)
    const bookingAllLoading: ApiStatus = useSelector(getBookingAllStatus)
    const bookingErrorMessage = useSelector(getBookingErrorMessage)
    const [inputText, setInputText] = useState<string>('')
    const [tableOptionsDisplayed, setTableOptionsDisplayed] = useState<string>('')
    const [activeFilterButton, setActiveFilterButton] = useState<ActiveButtonType>(ActiveButtonType.active)
    const [archivedFilterButton, setArchivedFilterButton] = useState<ArchivedButtonType>(ArchivedButtonType.notArchived)
    const [filteredRooms, setFilteredRooms] = useState<RoomInterfaceId[]>([])
    const [selectedButton, setSelectedButton] = useState<RoomButtonType>(RoomButtonType.all)
    const sortableColumns: RoomNameColumn[] = [
        RoomNameColumn.number,
        RoomNameColumn.type,
        RoomNameColumn.price,
        RoomNameColumn.discount
    ]
    type ArrowStates = Partial<Record<RoomNameColumn, ArrowType>>
    const [arrowStates, setArrowStates] = useState<ArrowStates>({
        [RoomNameColumn.number]: ArrowType.down,
        [RoomNameColumn.type]: ArrowType.right,
        [RoomNameColumn.price]: ArrowType.right,
        [RoomNameColumn.discount]: ArrowType.right
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
    } = usePagination<RoomInterfaceId>(filteredRooms, 10)

    useEffect(() => {
        if (roomAllLoading === ApiStatus.idle) { dispatch(RoomFetchAllThunk()) }
        else if (roomAllLoading === ApiStatus.fulfilled) { displayRooms() }
        else if (roomAllLoading === ApiStatus.rejected && roomErrorMessage) { customPopupMessage(setInfoPopup, setShowPopup, 'API Error', roomErrorMessage) }
    }, [roomAllLoading, roomAll, inputText, selectedButton, activeFilterButton, archivedFilterButton, arrowStates])
    useEffect(() => {
        if (bookingAllLoading === ApiStatus.idle) { dispatch(BookingFetchAllThunk()) }
        else if (bookingAllLoading === ApiStatus.fulfilled) { }
        else if (bookingAllLoading === ApiStatus.rejected && bookingErrorMessage) { customPopupMessage(setInfoPopup, setShowPopup, 'API Error', bookingErrorMessage) }
    }, [bookingAllLoading, bookingAll])

    const filterByIdOrNumber = (rooms: RoomInterfaceId[], searchText: string): RoomInterfaceId[] => {
        const normalizedText = searchText.toLowerCase()
        return rooms.filter(room =>
            room._id.toLocaleLowerCase().includes(normalizedText)
            || room.number.toString().includes(normalizedText)
        )
    }
    const filterByActiveStatus = (rooms: RoomInterfaceId[], activeFilterButton: ActiveButtonType): RoomInterfaceId[] => {
        const now = new Date()
        switch (activeFilterButton) {
            case ActiveButtonType.active:
                return rooms.filter(user =>
                    user.isActive === OptionYesNo.yes
                )
            case ActiveButtonType.inactive:
                return rooms.filter(user =>
                    user.isActive === OptionYesNo.no
                )
            case ActiveButtonType.all:
            default:
                return rooms
        }
    }
    const filterByArchivedStatus = (rooms: RoomInterfaceId[], archivedFilterButton: ArchivedButtonType): RoomInterfaceId[] => {
        switch (archivedFilterButton) {
            case ArchivedButtonType.archived:
                return rooms.filter(room => room.isArchived === OptionYesNo.yes)

            case ArchivedButtonType.notArchived:
                return rooms.filter(room => room.isArchived === OptionYesNo.no)

            case ArchivedButtonType.all:
            default:
                return rooms
        }
    }
    const displayRooms = (): void => {
        let filteredData = roomAll

        filteredData = filterByIdOrNumber(filteredData, inputText)
        filteredData = filterByActiveStatus(filteredData, activeFilterButton)
        filteredData = filterByArchivedStatus(filteredData, archivedFilterButton)

        setFilteredRooms(sortData(filteredData))
        resetPage()
    }
    const sortData = (filteredData: RoomInterfaceId[]): RoomInterfaceId[] => {
        const arrowStateColumns = Object.keys(arrowStates) as RoomNameColumn[]
        const activeColumn = arrowStateColumns.find(key => arrowStates[key] !== ArrowType.right)
        if (!activeColumn) return filteredData

        const activeColumnArrowDirection = arrowStates[activeColumn]!
        const sortedData = [...filteredData]

        sortedData.sort((a, b) => {
            let valueA: any
            let valueB: any
            switch (activeColumn) {
                case RoomNameColumn.number:
                    valueA = parseInt(a.number)
                    valueB = parseInt(b.number)
                    break
                case RoomNameColumn.type:
                    valueA = a.type.toLowerCase()
                    valueB = b.type.toLowerCase()
                    break
                case RoomNameColumn.price:
                    valueA = a.price
                    valueB = b.price
                    break
                case RoomNameColumn.discount:
                    valueA = a.discount
                    valueB = b.discount
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
    const toggleArchivedRoom = async (room: RoomInterfaceId): Promise<void> => {
        const updatedRoom = {
            ...room,
            isArchived: room.isArchived === OptionYesNo.no
                ? OptionYesNo.yes
                : OptionYesNo.no
        }
        try {
            await dispatch(RoomUpdateThunk({ idRoom: room._id, updatedRoomData: updatedRoom })).unwrap()
            displayMenuOptions(room._id)
            resetPage()
        }
        catch (error) {
            customPopupMessage(setInfoPopup, setShowPopup, 'API Error', String(error))
        }
    }
    const deleteRoomById = async (id: string): Promise<void> => {
        try {
            await dispatch(RoomDeleteByIdThunk(id)).unwrap()
            displayMenuOptions(id)
            resetPage()
        }
        catch (error) {
            customPopupMessage(setInfoPopup, setShowPopup, 'API Error', String(error))
        }
    }
    const isAvailable = (room: RoomInterfaceId): boolean => {
        // !!! USAR DATOS ASOCIADOS DE LAS BOOKINGS
        // return !Array.isArray(room.booking_id_list) ||
        //     room.booking_id_list.length === 0 ||
        //     !room.booking_id_list.some(booking => {
        //         const actualDate = new Date()
        //         const checkIn = new Date(booking.check_in_date)
        //         const checkOut = new Date(booking.check_out_date)
        //         return actualDate >= checkIn && actualDate <= checkOut
        //     })
        return false
    }


    return (
        <SectionPage>

            <CtnFuncionality>
                <CtnAllDisplayFilter>
                    {/* !!! AÑADIR FILTRO: */}
                    {/* <CtnTableDisplayFilter>
                        <TableDisplaySelector text='All Rooms' onClick={() => handleTableFilter(RoomButtonType.all)} isSelected={selectedButton === RoomButtonType.all} />
                        <TableDisplaySelector text='Available Rooms' onClick={() => handleTableFilter(RoomButtonType.available)} isSelected={selectedButton === RoomButtonType.available} />
                        <TableDisplaySelector text='Booked Rooms' onClick={() => handleTableFilter(RoomButtonType.booked)} isSelected={selectedButton === RoomButtonType.booked} />
                    </CtnTableDisplayFilter> */}
                    <CtnTableDisplayFilter>
                        <TableDisplaySelector text='All Rooms' onClick={() => setActiveFilterButton(ActiveButtonType.all)} isSelected={activeFilterButton === ActiveButtonType.all} />
                        <TableDisplaySelector text='Active' onClick={() => setActiveFilterButton(ActiveButtonType.active)} isSelected={activeFilterButton === ActiveButtonType.active} />
                        <TableDisplaySelector text='Inactive' onClick={() => setActiveFilterButton(ActiveButtonType.inactive)} isSelected={activeFilterButton === ActiveButtonType.inactive} />
                    </CtnTableDisplayFilter>
                    <CtnTableDisplayFilter>
                        <TableDisplaySelector text='All Rooms' onClick={() => setArchivedFilterButton(ArchivedButtonType.all)} isSelected={archivedFilterButton === ArchivedButtonType.all} />
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
                        placeholder="Search room by ID/number"
                    />
                </CtnSearch>

                <CtnButton>
                    <ButtonCreate onClick={getRole() === Role.admin ? () => navigate('room-create') : () => handleNonAdminClick(setInfoPopup, setShowPopup)}>
                        + New Room
                    </ButtonCreate>
                </CtnButton>
            </CtnFuncionality>

            {showPopup && <PopupText isSlider={false} title={infoPopup.title} text={infoPopup.text} onClose={() => setShowPopup(false)} />}

            {currentPageItems.length === 0
                ? <EmptyTableMessage>No rooms found</EmptyTableMessage>
                : <Table rowlistlength={filteredRooms.length + 1} columnlistlength={Object.values(RoomNameColumn).length + 2} >
                    <TitleColumn>{''}</TitleColumn>
                    {Object.values(RoomNameColumn).map(entry => {
                        if (sortableColumns.includes(entry)) {
                            return (
                                <TitleColumn
                                    key={entry}
                                    onClick={() => handleColumnClick(entry, sortableColumns, setArrowStates, () => displayRooms())}
                                    cursorPointer="yes"
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
                    {currentPageItems.map(roomData => (
                        <React.Fragment key={roomData._id}>
                            <CtnImgTable>
                                <ImgTableRoom src={`${roomData.photos[0]}`} />
                            </CtnImgTable>

                            <CtnCell flexdirection='column' alignitems='left' justifycontent='center'>
                                <div>Nº {roomData.number}</div>
                                <div>#<b>{roomData._id}</b></div>
                            </CtnCell>

                            <CtnCell>
                                {roomData.type}
                            </CtnCell>

                            <CtnCell>
                                <p>{roomData.amenities.join(', ')}</p>
                            </CtnCell>

                            <CtnCell>
                                <b>${roomData.price}</b>&nbsp;/night
                            </CtnCell>

                            <CtnCell>
                                {roomData.discount === 0 ?
                                    <>No Discount</> :
                                    <><b>${applyDiscount(roomData.price, roomData.discount)}</b>&nbsp;/night&nbsp;(-{roomData.discount}%)</>
                                }
                            </CtnCell>

                            <CtnCell>
                                {
                                    isAvailable(roomData) ?
                                        <TextStatusRoomList status='Available'>Available</TextStatusRoomList> :
                                        <TextStatusRoomList status='Booking'>Booking</TextStatusRoomList>
                                }
                            </CtnCell>

                            <CtnCell>
                                {roomData.isArchived === OptionYesNo.no
                                    ? <TextStatusAvailableUsers active={true}>Active</TextStatusAvailableUsers>
                                    : <TextStatusAvailableUsers active={false}>Archived</TextStatusAvailableUsers>
                                }
                            </CtnCell>

                            <CtnCell justifycontent="flex-end">
                                <CtnMenuOptions>
                                    <IconOptions onClick={() => { displayMenuOptions(roomData._id) }} />
                                    <CtnOptions display={`${tableOptionsDisplayed === roomData._id ? 'flex' : 'none'}`} isInTable={true} >
                                        <ButtonOption onClick={() => { navigate(`room-update/${roomData._id}`) }}>Update</ButtonOption>
                                        <ButtonOption onClick={() => toggleArchivedRoom(roomData)}>
                                            {roomData.isArchived === OptionYesNo.no ? 'Archive' : 'Unarchive'}
                                        </ButtonOption>
                                        <ButtonOption
                                            onClick={getRole() === Role.admin
                                                ? () => { deleteRoomById(roomData._id) }
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
        </SectionPage>
    )
}