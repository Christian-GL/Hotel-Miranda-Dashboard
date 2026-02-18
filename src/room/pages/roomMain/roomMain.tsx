
import React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"

import roomDefaultImg from '../../../assets/img/roomDefault.jpg'
import { SectionPage, CtnFuncionality, CtnAllDisplayFilter, CtnTableDisplayFilter, CtnSearch, CtnButton } from "../../../common/styles/funcionalityStyles"
import { useLoginOptionsContext } from "../../../signIn/features/loginProvider"
import { ActiveButtonType } from "../../../common/enums/activeButtonType"
import { ArchivedButtonType } from "../../../common/enums/archivedButtonType"
import { AppDispatch } from '../../../common/redux/store'
import { ApiStatus } from "../../../common/enums/ApiStatus"
import { Role } from "../../../user/enums/role"
import { RoomInterfaceId } from "./../../interfaces/roomInterface"
import { ApiErrorResponseInterface } from "common/interfaces/apiResponses/apiErrorResponseInterface"
import { getArrowIcon } from "common/utils/getArrowIcon"
import { sortValues } from "common/utils/sortValues"
import { handleColumnClick } from "common/utils/handleColumnClick"
import { handleNonAdminClick } from 'common/utils/nonAdminPopupMessage'
import { handleSelectionPopupMessage } from 'common/utils/selectionPopupMessage'
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
    EmptyTableMessage, Table, TitleColumn, TriangleUp, TriangleRight, TriangleDown, TextStatusAvailableUsers,
    ImgRoom, CtnCell, TextCell, TextId, TextStatusRoomList, CtnMenuOptions, IconOptions, CtnOptions, ButtonOption
} from "../../../common/styles/tableStyles"
import { getRoomAllData, getRoomAllStatus } from "./../../features/roomSlice"
import { RoomFetchAllThunk } from "./../../features/thunks/roomFetchAllThunk"
import { RoomArchiveThunk } from "../../features/thunks/roomArchiveThunk"
import { RoomDeleteByIdThunk } from "./../../features/thunks/roomDeleteByIdThunk"
import { getBookingAllData, getBookingAllStatus } from "../../../booking/features/bookingSlice"
import { BookingFetchAllThunk } from "../../../booking/features/thunks/bookingFetchAllThunk"
import { BookingInterfaceId } from "../../../booking/interfaces/bookingInterface"


export const RoomMain = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const { getRole } = useLoginOptionsContext()
    const roomAll: RoomInterfaceId[] = useSelector(getRoomAllData)
    const roomAllLoading: ApiStatus = useSelector(getRoomAllStatus)
    const bookingAll: BookingInterfaceId[] = useSelector(getBookingAllData)
    const bookingAllLoading: ApiStatus = useSelector(getBookingAllStatus)
    const [inputText, setInputText] = useState<string>('')
    const [tableOptionsDisplayed, setTableOptionsDisplayed] = useState<string>('')
    const [activeFilterButton, setActiveFilterButton] = useState<ActiveButtonType>(ActiveButtonType.active)
    const [archivedFilterButton, setArchivedFilterButton] = useState<ArchivedButtonType>(ArchivedButtonType.notArchived)
    const [filteredRooms, setFilteredRooms] = useState<RoomInterfaceId[]>([])
    const sortableColumns: RoomNameColumn[] = [
        RoomNameColumn.number,
        RoomNameColumn.type,
        RoomNameColumn.originalPrice,
        RoomNameColumn.discount,
        RoomNameColumn.finalPrice
    ]
    type ArrowStates = Partial<Record<RoomNameColumn, ArrowType>>
    const [arrowStates, setArrowStates] = useState<ArrowStates>({
        [RoomNameColumn.number]: ArrowType.down,
        [RoomNameColumn.type]: ArrowType.right,
        [RoomNameColumn.originalPrice]: ArrowType.right,
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
    }, [roomAllLoading, roomAll, inputText, activeFilterButton, archivedFilterButton, arrowStates])
    useEffect(() => {
        if (bookingAllLoading === ApiStatus.idle) { dispatch(BookingFetchAllThunk()) }
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
                case RoomNameColumn.originalPrice:
                    valueA = a.price
                    valueB = b.price
                    break
                case RoomNameColumn.discount:
                    valueA = a.discount
                    valueB = b.discount
                    break
                case RoomNameColumn.finalPrice:
                    valueA = applyDiscount(a.price, a.discount)
                    valueB = applyDiscount(b.price, b.discount)
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
    const toggleArchivedRoom = async (idRoom: string, roomArchivedValue: OptionYesNo): Promise<void> => {
        const newArchivedValue = roomArchivedValue === OptionYesNo.no
            ? OptionYesNo.yes
            : OptionYesNo.no
        try {
            await dispatch(RoomArchiveThunk({ idRoom: idRoom, isArchived: newArchivedValue })).unwrap()
            displayMenuOptions(idRoom)
            resetPage()
        }
        catch (error) {
            const apiError = error as ApiErrorResponseInterface
            customPopupMessage(setInfoPopup, setShowPopup, 'API Error', apiError.message)
        }
    }
    const deleteRoomById = async (id: string): Promise<void> => {
        try {
            await dispatch(RoomDeleteByIdThunk(id)).unwrap()
            displayMenuOptions(id)
            resetPage()
        }
        catch (error) {
            const apiError = error as ApiErrorResponseInterface
            customPopupMessage(setInfoPopup, setShowPopup, 'API Error', apiError.message)
        }
    }
    const isAvailableNow = (room: RoomInterfaceId): boolean => {
        const now = new Date()
        const relevantBookings = bookingAll.filter(booking =>
            booking.room_id_list?.includes(room._id)
        )
        const isAvailable = !relevantBookings.some(booking => {
            const checkIn = new Date(booking.check_in_date)
            const checkOut = new Date(booking.check_out_date)
            return checkIn <= now && now < checkOut
        })
        return isAvailable
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
                        <TableDisplaySelector text='All Status' onClick={() => setActiveFilterButton(ActiveButtonType.all)} isSelected={activeFilterButton === ActiveButtonType.all} />
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
                    <ButtonCreate onClick={() => navigate('room-create')}>
                        + New Room
                    </ButtonCreate>
                </CtnButton>
            </CtnFuncionality>

            {showPopup && <PopupText
                title={infoPopup.title}
                text={infoPopup.text}
                onConfirm={infoPopup.onConfirm}
                onCancel={infoPopup.onCancel}
                onClose={() => { setShowPopup(false); setTableOptionsDisplayed('') }}
            />}

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
                    {currentPageItems.map(roomData => {
                        const priceDiscounted = applyDiscount(roomData.price, roomData.discount)
                        const discountAmount = roomData.price - priceDiscounted

                        return (
                            <React.Fragment key={roomData._id}>
                                <CtnCell>
                                    <ImgRoom
                                        src={roomData.photos?.[0] || roomDefaultImg}
                                        onError={(e) => { e.currentTarget.src = roomDefaultImg }}
                                    />
                                </CtnCell>

                                <CtnCell flexdirection='column' alignitems='left' justifycontent='center'>
                                    <TextCell fontSize="1.5em">Nº {roomData.number}</TextCell>
                                    <TextId>#{roomData._id}</TextId>
                                </CtnCell>

                                <CtnCell>
                                    <TextCell>{roomData.type}</TextCell>
                                </CtnCell>

                                <CtnCell flexdirection='column' alignitems='left' justifycontent='center'>
                                    {roomData.amenities.map(amenity => (
                                        <TextCell>• {amenity}</TextCell>
                                    ))}
                                </CtnCell>

                                <CtnCell>
                                    <TextCell><b>${roomData.price}</b></TextCell>
                                </CtnCell>

                                <CtnCell>
                                    {roomData.discount === 0
                                        ? <TextCell>No Discount</TextCell>
                                        : <TextCell><b>${discountAmount.toFixed(2)}</b> ({roomData.discount}%)</TextCell>
                                    }
                                </CtnCell>

                                <CtnCell>
                                    <TextCell><b>${priceDiscounted}</b></TextCell>
                                </CtnCell>

                                <CtnCell>
                                    {isAvailableNow(roomData)
                                        ? <TextStatusRoomList status='Available'>Available</TextStatusRoomList>
                                        : <TextStatusRoomList status='Booking'>Booking</TextStatusRoomList>
                                    }
                                </CtnCell>

                                <CtnCell>
                                    {roomData.isActive === OptionYesNo.yes
                                        ? <TextStatusAvailableUsers active={true}>Active</TextStatusAvailableUsers>
                                        : <TextStatusAvailableUsers active={false}>Not active</TextStatusAvailableUsers>
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
                                            <ButtonOption
                                                onClick={() => { navigate(`room-update/${roomData._id}`) }}
                                            >Update
                                            </ButtonOption>
                                            <ButtonOption
                                                onClick={() => handleSelectionPopupMessage(
                                                    setInfoPopup,
                                                    setShowPopup,
                                                    `${roomData.isArchived === OptionYesNo.no ? 'Archive' : 'Unarchive'} room #${roomData._id}`,
                                                    `Are you sure you want to ${roomData.isArchived === OptionYesNo.no ? 'archive' : 'unarchive'} this room?`,
                                                    () => { toggleArchivedRoom(roomData._id, roomData.isArchived); displayMenuOptions('') },
                                                    () => setTableOptionsDisplayed('')
                                                )}
                                            >{roomData.isArchived === OptionYesNo.no ? 'Archive' : 'Unarchive'}
                                            </ButtonOption>
                                            <ButtonOption
                                                onClick={getRole() === Role.admin
                                                    ? () => handleSelectionPopupMessage(
                                                        setInfoPopup,
                                                        setShowPopup,
                                                        `Delete room #${roomData._id}`,
                                                        'Are you sure you want to delete this room? This action cannot be undone.',
                                                        () => { deleteRoomById(roomData._id); displayMenuOptions('') },
                                                        () => setTableOptionsDisplayed('')
                                                    )
                                                    : () => handleNonAdminClick(setInfoPopup, setShowPopup)
                                                }
                                                disabledClick={getRole() !== Role.admin}
                                            >Delete
                                            </ButtonOption>
                                        </CtnOptions>
                                    </CtnMenuOptions>
                                </CtnCell>
                            </React.Fragment>
                        )
                    })}
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