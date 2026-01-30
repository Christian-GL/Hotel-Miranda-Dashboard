
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
import { BookingInterfaceId } from "./../../interfaces/bookingInterface"
import { getArrowIcon } from "common/utils/getArrowIcon"
import { sortValues } from "common/utils/sortValues"
import { handleColumnClick } from "common/utils/handleColumnClick"
import { handleNonAdminClick } from 'common/utils/nonAdminPopupMessage'
import { customPopupMessage } from 'common/utils/customPopupMessage'
import { ArrowType } from "../../../common/enums/ArrowType"
import { OptionYesNo } from "../../../common/enums/optionYesNo"
import { BookingNameColumn } from "../../enums/bookingNameColumn"
import { PopupText } from "../../../common/components/popupText/popupText"
import { PopupTextInterface } from '../../../common/interfaces/popupTextInterface'
import { formatDateForPrint } from '../../../common/utils/dateUtils'
import { TableDisplaySelector } from "../../../common/components/tableDisplaySelector/tableDisplaySelector"
import { TableSearchTerm } from "../../../common/components/tableSearchTerm/tableSearchTerm"
import { TablePagination } from "../../../common/components/tablePagination/tablePagination"
import { ButtonCreate } from "../../../common/components/buttonCreate/buttonCreate"
import {
    EmptyTableMessage, Table, TitleColumn, TriangleUp, TriangleRight, TriangleDown, CtnNameTable, CtnImgTable, ImgTableUser, CtnCell,
    TextStatusAvailableUsers, IconPhone, ButtonView, TextStatusBooking, CtnMenuOptions, IconOptions, CtnOptions, ButtonOption
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
    const [tableOptionsDisplayed, setTableOptionsDisplayed] = useState<number>(-1)
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
    const displayMenuOptions = (index: number): void => {
        tableOptionsDisplayed === index ?
            setTableOptionsDisplayed(-1) :
            setTableOptionsDisplayed(index)
    }
    const toggleArchivedBooking = async (id: string, booking: BookingInterfaceId, index: number): Promise<void> => {
        const updatedBooking = {
            ...booking,
            isArchived: booking.isArchived === OptionYesNo.no
                ? OptionYesNo.yes
                : OptionYesNo.no
        }
        try {
            await dispatch(BookingUpdateThunk({ idBooking: id, updatedBookingData: updatedBooking })).unwrap()
            displayMenuOptions(index)
            resetPage()
        }
        catch (error) {
            customPopupMessage(setInfoPopup, setShowPopup, 'API Error', String(error))
        }
    }
    const deleteBookingById = async (id: string, index: number): Promise<void> => {
        try {
            await dispatch(BookingDeleteByIdThunk(id)).unwrap()
            displayMenuOptions(index)
            resetPage()
        }
        catch (error) {
            customPopupMessage(setInfoPopup, setShowPopup, 'API Error', String(error))
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
                    <ButtonCreate onClick={getRole() === Role.admin ? () => navigate('booking-create') : () => handleNonAdminClick(setInfoPopup, setShowPopup)} >
                        + New Booking
                    </ButtonCreate>
                </CtnButton>
            </CtnFuncionality>

            {showPopup && <PopupText isSlider={false} title={infoPopup.title} text={infoPopup.text} onClose={() => setShowPopup(false)} />}

            {currentPageItems.length === 0
                ? <EmptyTableMessage>No bookings found</EmptyTableMessage>
                : <Table rowlistlength={filteredBookings.length + 1} columnlistlength={Object.values(BookingNameColumn).length + 1} >
                    {Object.values(BookingNameColumn).map(entry => {
                        if (sortableColumns.includes(entry)) {
                            return (
                                <TitleColumn
                                    key={entry}
                                    onClick={() => handleColumnClick(entry, sortableColumns, setArrowStates, () => displayBookings())}
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
                    {currentPageItems.map((bookingData, index) => {
                        return [
                            <CtnCell key={index + '-1'}>
                                #<b>{bookingData._id}</b>
                            </CtnCell>,

                            <CtnCell key={index + '-2'}>
                                <ButtonView onClick={() => navigate(`booking-details/${bookingData._id}`)}>View details</ButtonView>
                            </CtnCell>,

                            <CtnCell key={index + '-3'} flexdirection='column' alignitems='left' justifycontent='center' >
                                {formatDateForPrint(bookingData.order_date)}
                            </CtnCell>,

                            <CtnCell key={index + '-4'} flexdirection='column' alignitems='left' justifycontent='center'>
                                {formatDateForPrint(bookingData.check_in_date)}
                            </CtnCell>,

                            <CtnCell key={index + '-5'} flexdirection='column' alignitems='left' justifycontent='center'>
                                {formatDateForPrint(bookingData.check_out_date)}
                            </CtnCell>,

                            <CtnCell key={index + '-6'}>
                                <ButtonView onClick={() => {
                                    setInfoPopup({
                                        title: `${clientAll.find(client => client._id === bookingData.client_id)?.full_name} special request:`,
                                        text: bookingData.special_request
                                    })
                                    setShowPopup(true)
                                }}
                                >View details</ButtonView>
                            </CtnCell>,

                            <CtnCell key={index + '-7'} flexdirection="column" alignitems="left" justifycontent="center"   >
                                {
                                    (() => {
                                        const rooms = bookingData.room_id_list
                                            .map(roomId => roomAll.find(room => room._id === roomId)?.number)
                                            .filter((number): number is string => Boolean(number))

                                        if (rooms.length > 0) {
                                            return rooms.map((roomNumber, i) => (
                                                <div key={i}>Room Nº {roomNumber}</div>
                                            ))
                                        }
                                        else {
                                            return <div>No rooms assigned</div>
                                        }
                                    })()
                                }
                            </CtnCell>,

                            <CtnCell key={index + '-8'} flexdirection="column" alignitems="left" justifycontent="center"  >
                                {
                                    (() => {
                                        const client = clientAll.find(client => client._id === bookingData.client_id)
                                        if (client) {
                                            return (<>
                                                <div>#<b>{client._id}</b></div>
                                                <div><CtnNameTable><b>{client.full_name}</b></CtnNameTable></div>
                                                <div>{client.email}</div>
                                                <div><IconPhone width="1.25rem" />{client.phone_number}</div>
                                            </>)
                                        }
                                        else {
                                            return <div>No client data</div>
                                        }
                                    })()
                                }
                            </CtnCell>,

                            <CtnCell key={index + '9'}>
                                {bookingData.isArchived === OptionYesNo.no
                                    ? <TextStatusAvailableUsers active={true}>Active</TextStatusAvailableUsers>
                                    : <TextStatusAvailableUsers active={false}>Archived</TextStatusAvailableUsers>
                                }
                            </CtnCell>,

                            <CtnCell key={index + '-10'} justifycontent="flex-end">
                                <CtnMenuOptions>
                                    <IconOptions onClick={() => { displayMenuOptions(index) }} />
                                    <CtnOptions display={`${tableOptionsDisplayed === index ? 'flex' : 'none'}`} isInTable={true} >
                                        <ButtonOption onClick={() => { navigate(`booking-update/${bookingData._id}`) }}>Update</ButtonOption>
                                        <ButtonOption onClick={() => toggleArchivedBooking(bookingData._id, bookingData, index)}>
                                            {bookingData.isArchived === OptionYesNo.no ? 'Archive' : 'Unarchive'}
                                        </ButtonOption>
                                        <ButtonOption
                                            onClick={getRole() === Role.admin
                                                ? () => { deleteBookingById(bookingData._id, index) }
                                                : () => handleNonAdminClick(setInfoPopup, setShowPopup)}
                                            disabledClick={getRole() !== Role.admin}
                                        >Delete
                                        </ButtonOption>
                                    </CtnOptions>
                                </CtnMenuOptions>
                            </CtnCell>
                        ]
                    }
                    )}
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