
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
import { BookingInterface } from "./../../interfaces/bookingInterface"
import { getArrowIcon } from "common/utils/getArrowIcon"
import { sortValues } from "common/utils/sortValues"
import { handleColumnClick } from "common/utils/handleColumnClick"
import { handleNonAdminClick } from 'common/utils/nonAdminPopupMessage'
import { ArrowType } from "../../../common/enums/ArrowType"
import { OptionYesNo } from "common/enums/optionYesNo"
import { BookingNameColumn } from "../../enums/bookingNameColumn"
import { PopupText } from "../../../common/components/popupText/popupText"
import { PopupTextInterface } from '../../../common/interfaces/popupTextInterface'
import { formatDateForPrint } from '../../../common/utils/dateUtils'
import { TableDisplaySelector } from "../../../common/components/tableDisplaySelector/tableDisplaySelector"
import { TableSearchTerm } from "../../../common/components/tableSearchTerm/tableSearchTerm"
import { TablePagination } from "../../../common/components/tablePagination/tablePagination"
import { ButtonCreate } from "../../../common/components/buttonCreate/buttonCreate"
import {
    Table, THTable, TriangleUp, TriangleRight, TriangleDown, DivNameTable, DivImgTable, ImgTableUser, PTable,
    IconPhone, ButtonView, PStatusBooking, CtnMenuOptions, IconOptions, CtnOptionsDisplayed, ButtonOption
} from "../../../common/styles/tableStyles"
import { usePagination } from "../../../common/hooks/usePagination"
import { getBookingAllData, getBookingAllStatus } from "./../../features/bookingSlice"
import { BookingFetchAllThunk } from "./../../features/thunks/bookingFetchAllThunk"
import { BookingUpdateThunk } from "./../../features/thunks/bookingUpdateThunk"
import { BookingDeleteByIdThunk } from "./../../features/thunks/bookingDeleteByIdThunk"
import { RoomInterface } from "../../../room/interfaces/roomInterface"
import { getRoomAllData, getRoomAllStatus } from "../../../room/features/roomSlice"
import { RoomFetchAllThunk } from "../../../room/features/thunks/roomFetchAllThunk"
import { ClientInterface } from "../../../client/interfaces/clientInterface"
import { getClientAllData, getClientAllStatus } from "../../../client/features/clientSlice"
import { ClientFetchAllThunk } from "../../../client/features/thunks/clientFetchAllThunk"


export const BookingMain = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const { getRole } = useLoginOptionsContext()
    const bookingAll: BookingInterface[] = useSelector(getBookingAllData)
    const bookingAllLoading: ApiStatus = useSelector(getBookingAllStatus)
    const roomAll: RoomInterface[] = useSelector(getRoomAllData)
    const roomAllLoading: ApiStatus = useSelector(getRoomAllStatus)
    const clientAll: ClientInterface[] = useSelector(getClientAllData)
    const clientAllLoading: ApiStatus = useSelector(getClientAllStatus)
    const [inputText, setInputText] = useState<string>('')
    const [tableOptionsDisplayed, setTableOptionsDisplayed] = useState<number>(-1)
    const [bookingStatusButton, setBookingStatusButton] = useState<BookingButtonType>(BookingButtonType.all)
    const [archivedFilterButton, setArchivedFilterButton] = useState<ArchivedButtonType>(ArchivedButtonType.all)
    const [filteredBookings, setFilteredBookings] = useState<BookingInterface[]>([])
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
    } = usePagination<BookingInterface>(filteredBookings, 10)

    useEffect(() => {
        if (bookingAllLoading === ApiStatus.idle) { dispatch(BookingFetchAllThunk()) }
        else if (bookingAllLoading === ApiStatus.fulfilled) { displayBookings() }
        else if (bookingAllLoading === ApiStatus.rejected) { alert("Error en la api de bookingMain > bookings") }
    }, [bookingAllLoading, bookingAll, inputText, archivedFilterButton, bookingStatusButton, arrowStates])
    useEffect(() => {
        if (roomAllLoading === ApiStatus.idle) { dispatch(RoomFetchAllThunk()) }
        else if (roomAllLoading === ApiStatus.fulfilled) { }
        else if (roomAllLoading === ApiStatus.rejected) { alert("Error en la api de bookingMain > rooms") }
    }, [roomAllLoading, roomAll])
    useEffect(() => {
        if (clientAllLoading === ApiStatus.idle) { dispatch(ClientFetchAllThunk()) }
        else if (clientAllLoading === ApiStatus.fulfilled) { }
        else if (clientAllLoading === ApiStatus.rejected) { alert("Error en la api de bookingMain > clients") }
    }, [clientAllLoading, clientAll])

    const filterByClientName = (bookings: BookingInterface[], clients: ClientInterface[], searchText: string): BookingInterface[] => {
        const normalizedText = searchText.trim().toLowerCase()
        if (!normalizedText) return bookings

        const clientNameMap = new Map<string, string>(
            clients.map(client => [client._id, client.full_name.toLowerCase()])
        )
        return bookings.filter(booking => {
            const clientName = clientNameMap.get(booking.client_id)
            return clientName?.includes(normalizedText)
        })
    }
    const filterByBookingStatus = (bookings: BookingInterface[], bookingStatusButton: BookingButtonType): BookingInterface[] => {
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
    const filterByArchivedStatus = (bookings: BookingInterface[], archivedFilterButton: ArchivedButtonType): BookingInterface[] => {
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

        filteredDataBookings = filterByClientName(filteredDataBookings, filteredDataClients, inputText)
        filteredDataBookings = filterByBookingStatus(filteredDataBookings, bookingStatusButton)
        filteredDataBookings = filterByArchivedStatus(filteredDataBookings, archivedFilterButton)

        setFilteredBookings(sortData(filteredDataBookings))
        resetPage()
    }
    const sortData = (filteredData: BookingInterface[]): BookingInterface[] => {
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
    const toggleArchivedClient = (id: string, booking: BookingInterface, index: number): void => {
        const updatedBooking = {
            ...booking,
            isArchived: booking.isArchived === OptionYesNo.no
                ? OptionYesNo.yes
                : OptionYesNo.no
        }
        dispatch(BookingUpdateThunk({ idBooking: id, updatedBookingData: updatedBooking }))
        displayMenuOptions(index)
        resetPage()
    }
    const deleteBookingById = (id: string, index: number): void => {
        dispatch(BookingDeleteByIdThunk(id))
        displayMenuOptions(index)
        resetPage()
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
                        placeholder="Search booking by client name"
                    />
                </CtnSearch>

                <CtnButton>
                    <ButtonCreate onClick={getRole() === Role.admin ? () => navigate('booking-create') : () => handleNonAdminClick(setInfoPopup, setShowPopup)} >
                        + New Booking
                    </ButtonCreate>
                </CtnButton>
            </CtnFuncionality>

            {showPopup && <PopupText isSlider={false} title={infoPopup.title} text={infoPopup.text} onClose={() => setShowPopup(false)} />}

            <Table rowlistlength={filteredBookings.length + 1} columnlistlength={Object.values(BookingNameColumn).length + 1} >
                {Object.values(BookingNameColumn).map(entry => {
                    if (sortableColumns.includes(entry)) {
                        return (
                            <THTable
                                key={entry}
                                onClick={() => handleColumnClick(entry, sortableColumns, setArrowStates, () => displayBookings())}
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
                {currentPageItems.map((bookingData, index) => {
                    return [
                        <PTable key={index + '-1'}>
                            #<b>{bookingData._id}</b>
                        </PTable>,

                        <PTable key={index + '-2'}>
                            <ButtonView onClick={() => () => navigate(`booking-details/${bookingData._id}`)}>View Details</ButtonView>
                        </PTable>,

                        <PTable key={index + '-3'} flexdirection='column' alignitems='left' justifycontent='center' >
                            {formatDateForPrint(bookingData.order_date)}
                        </PTable>,

                        <PTable key={index + '-4'} flexdirection='column' alignitems='left' justifycontent='center'>
                            {formatDateForPrint(bookingData.check_in_date)}
                        </PTable>,

                        <PTable key={index + '-5'} flexdirection='column' alignitems='left' justifycontent='center'>
                            {formatDateForPrint(bookingData.check_out_date)}
                        </PTable>,

                        <PTable key={index + '-6'}>
                            <ButtonView onClick={() => {
                                // !!! ACTUALIZAR:
                                setInfoPopup({
                                    title: `Special request #${bookingData._id} by ${bookingData.special_request}`,
                                    text: bookingData.special_request
                                })
                                setShowPopup(true)
                            }
                            }>View Notes</ButtonView>
                        </PTable>,

                        <PTable key={index + '-7'} flexdirection="column" alignitems="left" justifycontent="center"   >
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
                        </PTable>,

                        <PTable key={index + '-8'} flexdirection="column" alignitems="left" justifycontent="center"  >
                            {
                                (() => {
                                    const client = clientAll.find(client => client._id === bookingData.client_id)
                                    if (client) {
                                        return (<>
                                            <div>#<b>{client._id}</b></div>
                                            <div><DivNameTable><b>{client.full_name}</b></DivNameTable></div>
                                            <div>{client.email}</div>
                                            <div><IconPhone width="1.25rem" />{client.phone_number}</div>
                                        </>)
                                    }
                                    else {
                                        return <div>No client data</div>
                                    }
                                })()
                            }
                        </PTable>,

                        <PTable key={index + '-9'} justifycontent="flex-end">
                            <CtnMenuOptions>
                                <IconOptions onClick={() => { displayMenuOptions(index) }} />
                                <CtnOptionsDisplayed display={`${tableOptionsDisplayed === index ? 'flex' : 'none'}`} isInTable={true} >
                                    <ButtonOption onClick={() => { navigate(`booking-update/${bookingData._id}`) }}>Update</ButtonOption>
                                    <ButtonOption onClick={() => toggleArchivedClient(bookingData._id, bookingData, index)}>
                                        {bookingData.isArchived === OptionYesNo.no ? 'Archive' : 'Unarchive'}
                                    </ButtonOption>
                                    <ButtonOption
                                        onClick={getRole() === Role.admin
                                            ? () => { deleteBookingById(bookingData._id, index) }
                                            : () => handleNonAdminClick(setInfoPopup, setShowPopup)}
                                        disabledClick={getRole() !== Role.admin}
                                    >Delete
                                    </ButtonOption>
                                </CtnOptionsDisplayed>
                            </CtnMenuOptions>
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

        </SectionPage>
    )
}