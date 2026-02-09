
import React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"

import { SectionPage, CtnFuncionality, CtnAllDisplayFilter, CtnTableDisplayFilter, CtnSearch, CtnButton } from "../../../common/styles/funcionalityStyles"
import { useLoginOptionsContext } from "../../../signIn/features/loginProvider"
import { BookingButtonType } from "../../enums/bookingButtonType"
import { ArchivedButtonType } from "../../../common/enums/archivedButtonType"
import { AppDispatch } from '../../../common/redux/store'
import { ApiStatus } from "../../../common/enums/ApiStatus"
import { Role } from "../../../user/enums/role"
import { BookingStatus } from "../../enums/bookingStatus"
import { BookingInterfaceId } from "./../../interfaces/bookingInterface"
import { getArrowIcon } from "../../../common/utils/getArrowIcon"
import { sortValues } from "../../../common/utils/sortValues"
import { handleColumnClick } from "../../../common/utils/handleColumnClick"
import { handleNonAdminClick } from '../../../common/utils/nonAdminPopupMessage'
import { handleSelectionPopupMessage } from '../../../common/utils/selectionPopupMessage'
import { customPopupMessage } from '../../../common/utils/customPopupMessage'
import { checkBookingStatus } from "../../../common/utils/checkBookingStatus"
import { formatDateForPrint } from '../../../common/utils/dateUtils'
import { ArrowType } from "../../../common/enums/ArrowType"
import { OptionYesNo } from "../../../common/enums/optionYesNo"
import { BookingNameColumn } from "../../enums/bookingNameColumn"
import { PopupText } from "../../../common/components/popupText/popupText"
import { PopupTextInterface } from '../../../common/interfaces/popupTextInterface'
import { TableDisplaySelector } from "../../../common/components/tableDisplaySelector/tableDisplaySelector"
import { TableSearchTerm } from "../../../common/components/tableSearchTerm/tableSearchTerm"
import { TablePagination } from "../../../common/components/tablePagination/tablePagination"
import { ButtonCreate } from "../../../common/components/buttonCreate/buttonCreate"
import {
    EmptyTableMessage, Table, TitleColumn, TriangleUp, TriangleRight, TriangleDown, ImgUser, CtnCell, TextId, BookingStatusInfo,
    TextStatusAvailableUsers, IconPhone, ButtonView, TotalBookingStatus, CtnMenuOptions, IconOptions, CtnOptions, ButtonOption,
    TextCell
} from "../../../common/styles/tableStyles"
import { usePagination } from "../../../common/hooks/usePagination"
import { getBookingAllData, getBookingAllStatus, getBookingErrorMessage } from "./../../features/bookingSlice"
import { BookingFetchAllThunk } from "./../../features/thunks/bookingFetchAllThunk"
import { BookingUpdateThunk } from "./../../features/thunks/bookingUpdateThunk"
import { BookingDeleteByIdThunk } from "./../../features/thunks/bookingDeleteByIdThunk"
import { RoomInterfaceId } from "../../../room/interfaces/roomInterface"
import { getRoomAllData, getRoomAllStatus, getRoomErrorMessage } from "../../../room/features/roomSlice"
import { RoomFetchAllThunk } from "../../../room/features/thunks/roomFetchAllThunk"
import { ClientInterfaceId } from "../../../client/interfaces/clientInterface"
import { getClientAllData, getClientAllStatus, getClientErrorMessage } from "../../../client/features/clientSlice"
import { ClientFetchAllThunk } from "../../../client/features/thunks/clientFetchAllThunk"


export const BookingMain = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const { getRole } = useLoginOptionsContext()
    const bookingAll: BookingInterfaceId[] = useSelector(getBookingAllData)
    const bookingAllLoading: ApiStatus = useSelector(getBookingAllStatus)
    const bookingErrorMessage = useSelector(getBookingErrorMessage)
    const roomAll: RoomInterfaceId[] = useSelector(getRoomAllData)
    const roomAllLoading: ApiStatus = useSelector(getRoomAllStatus)
    const roomErrorMessage = useSelector(getRoomErrorMessage)
    const clientAll: ClientInterfaceId[] = useSelector(getClientAllData)
    const clientAllLoading: ApiStatus = useSelector(getClientAllStatus)
    const clientErrorMessage = useSelector(getClientErrorMessage)
    const [inputText, setInputText] = useState<string>('')
    const [tableOptionsDisplayed, setTableOptionsDisplayed] = useState<string>('')
    const [bookingStatusButton, setBookingStatusButton] = useState<BookingButtonType>(BookingButtonType.all)
    const [archivedFilterButton, setArchivedFilterButton] = useState<ArchivedButtonType>(ArchivedButtonType.notArchived)
    const [filteredBookings, setFilteredBookings] = useState<BookingInterfaceId[]>([])
    const sortableColumns: BookingNameColumn[] = [
        BookingNameColumn.orderDate,
        BookingNameColumn.checkIn,
        BookingNameColumn.checkOut
    ]
    type ArrowStates = Partial<Record<BookingNameColumn, ArrowType>>
    const [arrowStates, setArrowStates] = useState<ArrowStates>({
        [BookingNameColumn.orderDate]: ArrowType.down,
        [BookingNameColumn.checkIn]: ArrowType.right,
        [BookingNameColumn.checkOut]: ArrowType.right
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
    } = usePagination<BookingInterfaceId>(filteredBookings, 10)

    useEffect(() => {
        if (bookingAllLoading === ApiStatus.idle) { dispatch(BookingFetchAllThunk()) }
        else if (bookingAllLoading === ApiStatus.fulfilled) { displayBookings() }
        else if (bookingAllLoading === ApiStatus.rejected && bookingErrorMessage) { customPopupMessage(setInfoPopup, setShowPopup, 'API Error', bookingErrorMessage) }
    }, [bookingAllLoading, bookingAll, inputText, archivedFilterButton, bookingStatusButton, arrowStates])
    useEffect(() => {
        if (roomAllLoading === ApiStatus.idle) { dispatch(RoomFetchAllThunk()) }
        else if (roomAllLoading === ApiStatus.fulfilled) { }
        else if (roomAllLoading === ApiStatus.rejected && roomErrorMessage) { customPopupMessage(setInfoPopup, setShowPopup, 'API Error', roomErrorMessage) }
    }, [roomAllLoading, roomAll])
    useEffect(() => {
        if (clientAllLoading === ApiStatus.idle) { dispatch(ClientFetchAllThunk()) }
        else if (clientAllLoading === ApiStatus.fulfilled) { }
        else if (clientAllLoading === ApiStatus.rejected && clientErrorMessage) { customPopupMessage(setInfoPopup, setShowPopup, 'API Error', clientErrorMessage) }
    }, [clientAllLoading, clientAll])

    const filterByIdOrClientName = (bookings: BookingInterfaceId[], clients: ClientInterfaceId[], searchText: string): BookingInterfaceId[] => {
        const normalizedText = searchText.trim().toLowerCase()
        if (!normalizedText) return bookings

        const clientNameMap = new Map<string, string>(
            clients.map(client => [client._id, client.full_name.toLowerCase()])
        )
        return bookings.filter(booking => {
            const clientName = clientNameMap.get(booking.client_id)
            return clientName?.includes(normalizedText)
                || booking._id.toLocaleLowerCase().includes(normalizedText)
        })
    }
    const filterByBookingStatus = (bookings: BookingInterfaceId[], bookingStatusButton: BookingButtonType): BookingInterfaceId[] => {
        const now = new Date()

        switch (bookingStatusButton) {
            case BookingButtonType.checkIn:
                return bookings.filter(booking =>
                    new Date(booking.check_in_date) > now
                )
            case BookingButtonType.inProgress:
                return bookings.filter(booking =>
                    new Date(booking.check_in_date) <= now
                    && new Date(booking.check_out_date) >= now
                )
            case BookingButtonType.checkOut:
                return bookings.filter(booking =>
                    new Date(booking.check_out_date) < now
                )
            case BookingButtonType.all:
            default:
                return bookings
        }
    }
    const filterByArchivedStatus = (bookings: BookingInterfaceId[], archivedFilterButton: ArchivedButtonType): BookingInterfaceId[] => {
        switch (archivedFilterButton) {
            case ArchivedButtonType.archived:
                return bookings.filter(booking => booking.isArchived === OptionYesNo.yes)

            case ArchivedButtonType.notArchived:
                return bookings.filter(booking => booking.isArchived === OptionYesNo.no)

            case ArchivedButtonType.all:
            default:
                return bookings
        }
    }
    const displayBookings = (): void => {
        let filteredDataBookings = bookingAll
        let filteredDataClients = clientAll

        filteredDataBookings = filterByIdOrClientName(filteredDataBookings, filteredDataClients, inputText)
        filteredDataBookings = filterByBookingStatus(filteredDataBookings, bookingStatusButton)
        filteredDataBookings = filterByArchivedStatus(filteredDataBookings, archivedFilterButton)

        setFilteredBookings(sortData(filteredDataBookings))
        resetPage()
    }
    const sortData = (filteredData: BookingInterfaceId[]): BookingInterfaceId[] => {
        const arrowStateColumns = Object.keys(arrowStates) as BookingNameColumn[]
        const activeColumn = arrowStateColumns.find(key => arrowStates[key] !== ArrowType.right)
        if (!activeColumn) return filteredData

        const activeColumnArrowDirection = arrowStates[activeColumn]!
        const sortedData = [...filteredData]

        sortedData.sort((a, b) => {
            let valueA: any
            let valueB: any
            switch (activeColumn) {
                case BookingNameColumn.orderDate:
                    valueA = new Date(a.order_date).getTime()
                    valueB = new Date(b.order_date).getTime()
                    break
                case BookingNameColumn.checkIn:
                    valueA = new Date(a.check_in_date).getTime()
                    valueB = new Date(b.check_in_date).getTime()
                    break
                case BookingNameColumn.checkOut:
                    valueA = new Date(a.check_out_date).getTime()
                    valueB = new Date(b.check_out_date).getTime()
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
    const toggleArchivedBooking = async (booking: BookingInterfaceId): Promise<void> => {
        const updatedBooking = {
            ...booking,
            isArchived: booking.isArchived === OptionYesNo.no
                ? OptionYesNo.yes
                : OptionYesNo.no
        }
        try {
            await dispatch(BookingUpdateThunk({ idBooking: booking._id, updatedBookingData: updatedBooking })).unwrap()
            displayMenuOptions(booking._id)
            resetPage()
        }
        catch (error) {
            customPopupMessage(setInfoPopup, setShowPopup, 'API Error', String(error))
        }
    }
    const deleteBookingById = async (id: string): Promise<void> => {
        try {
            await dispatch(BookingDeleteByIdThunk(id)).unwrap()
            displayMenuOptions(id)
            resetPage()
        }
        catch (error) {
            customPopupMessage(setInfoPopup, setShowPopup, 'API Error', String(error))
        }
    }
    const renderBookingStatus = (status: BookingStatus) => {
        switch (status) {
            case BookingStatus.checkIn:
                return <BookingStatusInfo status={status}>Check-in</BookingStatusInfo>
            case BookingStatus.inProgress:
                return <BookingStatusInfo status={status}>In progress</BookingStatusInfo>
            case BookingStatus.checkOut:
                return <BookingStatusInfo status={status}>Check-out</BookingStatusInfo>
            default:
                return <BookingStatusInfo status={status}>Status error</BookingStatusInfo>
        }
    }


    return (
        <SectionPage>
            <CtnFuncionality>
                <CtnAllDisplayFilter>
                    <CtnTableDisplayFilter>
                        <TableDisplaySelector text='All Bookings' onClick={() => setBookingStatusButton(BookingButtonType.all)} isSelected={bookingStatusButton === BookingButtonType.all} />
                        <TableDisplaySelector text='Check In' onClick={() => setBookingStatusButton(BookingButtonType.checkIn)} isSelected={bookingStatusButton === BookingButtonType.checkIn} />
                        <TableDisplaySelector text='In Progress' onClick={() => setBookingStatusButton(BookingButtonType.inProgress)} isSelected={bookingStatusButton === BookingButtonType.inProgress} />
                        <TableDisplaySelector text='Check Out' onClick={() => setBookingStatusButton(BookingButtonType.checkOut)} isSelected={bookingStatusButton === BookingButtonType.checkOut} />
                    </CtnTableDisplayFilter>
                    <CtnTableDisplayFilter>
                        <TableDisplaySelector text='All Bookings' onClick={() => setArchivedFilterButton(ArchivedButtonType.all)} isSelected={archivedFilterButton === ArchivedButtonType.all} />
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
                        placeholder="Search booking by ID/client name"
                    />
                </CtnSearch>

                <CtnButton>
                    <ButtonCreate onClick={() => navigate('booking-create')} >
                        + New Booking
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
                ? <EmptyTableMessage>No bookings found</EmptyTableMessage>
                : <Table rowlistlength={filteredBookings.length + 1} columnlistlength={Object.values(BookingNameColumn).length + 1} >
                    {Object.values(BookingNameColumn).map(entry => {
                        if (sortableColumns.includes(entry)) {
                            return (
                                <TitleColumn
                                    key={entry}
                                    onClick={() => handleColumnClick(entry, sortableColumns, setArrowStates, () => displayBookings())}
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
                    {currentPageItems.map(bookingData => {
                        const client = clientAll.find(client => client._id === bookingData.client_id)
                        const rooms = bookingData.room_id_list
                            .map(roomId => roomAll.find(room => room._id === roomId)?.number)
                            .filter((number): number is string => Boolean(number))

                        return (
                            <React.Fragment key={bookingData._id}>
                                <CtnCell>
                                    <TextId>#{bookingData._id}</TextId>
                                </CtnCell>

                                <CtnCell flexdirection="column" alignitems="left" justifycontent="center">
                                    {rooms.length > 0
                                        ? rooms.map((roomNumber, i) => (
                                            <TextCell key={i} fontSize="1.5em">Nº {roomNumber}</TextCell>
                                        ))
                                        : <TextCell>Rooms assigned error</TextCell>
                                    }
                                </CtnCell>

                                <CtnCell>
                                    <ButtonView onClick={() => navigate(`booking-details/${bookingData._id}`)}>View details</ButtonView>
                                </CtnCell>

                                <CtnCell>
                                    {renderBookingStatus(checkBookingStatus(bookingData.check_in_date, bookingData.check_out_date))}
                                </CtnCell>

                                <CtnCell flexdirection='column' alignitems='left' justifycontent='center'>
                                    <TextCell>{formatDateForPrint(bookingData.check_in_date)}</TextCell>
                                </CtnCell>

                                <CtnCell flexdirection='column' alignitems='left' justifycontent='center'>
                                    <TextCell>{formatDateForPrint(bookingData.check_out_date)}</TextCell>
                                </CtnCell>

                                <CtnCell flexdirection="column" alignitems="left" justifycontent="center">
                                    {client
                                        ? <>
                                            <TextCell>#<b>{client._id}</b></TextCell>
                                            <TextCell isName>{client.full_name}</TextCell>
                                            <TextCell>{client.email}</TextCell>
                                            <TextCell>
                                                <IconPhone width="1.25rem" />
                                                {client.phone_number}
                                            </TextCell>
                                        </>
                                        : <TextCell>No client data</TextCell>
                                    }
                                </CtnCell>

                                <CtnCell>
                                    <ButtonView onClick={() => {
                                        setInfoPopup({
                                            title: `${clientAll.find(client => client._id === bookingData.client_id)?.full_name} special request:`,
                                            text: bookingData.special_request
                                        })
                                        setShowPopup(true)
                                    }}
                                    >View request</ButtonView>
                                </CtnCell>

                                <CtnCell flexdirection='column' alignitems='left' justifycontent='center' >
                                    <TextCell>{formatDateForPrint(bookingData.order_date)}</TextCell>
                                </CtnCell>

                                <CtnCell>
                                    {bookingData.isArchived === OptionYesNo.no
                                        ? <TextStatusAvailableUsers active={true}>Active</TextStatusAvailableUsers>
                                        : <TextStatusAvailableUsers active={false}>Archived</TextStatusAvailableUsers>
                                    }
                                </CtnCell>

                                <CtnCell justifycontent="flex-end">
                                    <CtnMenuOptions>
                                        <IconOptions onClick={() => { displayMenuOptions(bookingData._id) }} />
                                        <CtnOptions display={`${tableOptionsDisplayed === bookingData._id ? 'flex' : 'none'}`} isInTable={true} >
                                            <ButtonOption
                                                onClick={() => { navigate(`booking-update/${bookingData._id}`) }}
                                            >Update
                                            </ButtonOption>
                                            <ButtonOption
                                                onClick={() => handleSelectionPopupMessage(
                                                    setInfoPopup,
                                                    setShowPopup,
                                                    `${bookingData.isArchived === OptionYesNo.no ? 'Archive' : 'Unarchive'} booking #${bookingData._id}`,
                                                    `Are you sure you want to ${bookingData.isArchived === OptionYesNo.no ? 'archive' : 'unarchive'} this booking?`,
                                                    () => { toggleArchivedBooking(bookingData); displayMenuOptions('') },
                                                    () => setTableOptionsDisplayed('')
                                                )}
                                            >{bookingData.isArchived === OptionYesNo.no ? 'Archive' : 'Unarchive'}
                                            </ButtonOption>
                                            <ButtonOption
                                                onClick={getRole() === Role.admin
                                                    ? () => handleSelectionPopupMessage(
                                                        setInfoPopup,
                                                        setShowPopup,
                                                        `Delete booking #${bookingData._id}`,
                                                        'Are you sure you want to delete this booking? This action cannot be undone.',
                                                        () => { deleteBookingById(bookingData._id); displayMenuOptions('') },
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

        </SectionPage >
    )
}