
import React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"

import * as bookingMainStyles from './bookingMainStyles'
import { BookingButtonType } from "../../enums/bookingButtonType"
import { BookingStatus } from './../../enums/bookingStatus'
import { AppDispatch } from '../../../common/redux/store'
import { ApiStatus } from "../../../common/enums/ApiStatus"
import { BookingInterface, BookingInterfaceData } from "./../../interfaces/bookingInterface"
import { getArrowIcon } from "common/utils/getArrowIcon"
import { sortValues } from "common/utils/sortValues"
import { handleColumnClick } from "common/utils/handleColumnClick"
import { RoomInterfaceBookings } from "../../../room/interfaces/roomInterface"
import { ArrowType } from "../../../common/enums/ArrowType"
import { BookingNameColumn } from "../../enums/bookingNameColumn"
import { PopupText } from "../../../common/components/popupText/popupText"
import { PopupTextInterface } from '../../../common/components/popupText/popupTextInterface'
import { formatDateForPrint } from '../../../common/utils/dateUtils'
import { checkBookingStatus } from '../../../common/utils/checkBookingStatus'
import { TableDisplaySelector } from "../../../common/components/tableDisplaySelector/tableDisplaySelector"
import { TableSearchTerm } from "../../../common/components/tableSearchTerm/tableSearchTerm"
import { ButtonCreate } from "../../../common/components/buttonCreate/buttonCreate"
import {
    Table, THTable, TriangleUp, TriangleRight, TriangleDown, DivNameTable, DivImgTable, ImgTableUser, PTable,
    IconOptions, ButtonView, PStatusBooking, DivCtnOptions, ButtonOption
} from "../../../common/styles/tableStyles"
import { usePagination } from "../../../common/hooks/usePagination"
import * as paginationJS from '../../../common/styles/pagination'
import { getBookingAllData, getBookingAllStatus } from "./../../features/bookingSlice"
import { BookingFetchAllThunk } from "./../../features/thunks/bookingFetchAllThunk"
import { BookingDeleteByIdThunk } from "./../../features/thunks/bookingDeleteByIdThunk"
import { getRoomAllData, getRoomAllStatus } from "../../../room/features/roomSlice"
import { RoomFetchAllThunk } from "../../../room/features/thunks/roomFetchAllThunk"


export const BookingMain = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const bookingAll: BookingInterfaceData[] = useSelector(getBookingAllData)
    const bookingAllLoading: ApiStatus = useSelector(getBookingAllStatus)
    const roomAll: RoomInterfaceBookings[] = useSelector(getRoomAllData)
    const roomAllLoading: ApiStatus = useSelector(getRoomAllStatus)
    const [inputText, setInputText] = useState<string>('')
    const [tableOptionsDisplayed, setTableOptionsDisplayed] = useState<number>(-1)
    const [selectedButton, setSelectedButton] = useState<BookingButtonType>(BookingButtonType.all)
    const [filteredBookings, setFilteredBookings] = useState<BookingInterfaceData[]>([])
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
    const [infoViewNotes, setInfoViewNotes] = useState<PopupTextInterface>({ title: '', text: '' })
    const {
        currentPageItems,
        currentPage,
        totalPages,
        goToNextPage,
        goToPrevPage,
        resetPage,
        lastPage
    } = usePagination<BookingInterfaceData>(filteredBookings, 10)

    useEffect(() => {
        if (bookingAllLoading === ApiStatus.idle) { dispatch(BookingFetchAllThunk()) }
        else if (bookingAllLoading === ApiStatus.fulfilled) { displayBookings() }
        else if (bookingAllLoading === ApiStatus.rejected) { alert("Error en la api de bookings") }
    }, [bookingAllLoading, bookingAll, inputText, selectedButton, arrowStates])
    useEffect(() => {
        if (roomAllLoading === ApiStatus.idle) { dispatch(RoomFetchAllThunk()) }
        else if (roomAllLoading === ApiStatus.fulfilled) { }
        else if (roomAllLoading === ApiStatus.rejected) { alert("Error en la api de bookings > rooms") }
    }, [roomAllLoading, roomAll])

    const handleInputTerm = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setInputText(e.target.value)
        resetPage()
    }
    const handleTableFilter = (type: BookingButtonType): void => {
        setSelectedButton(type)
        displayBookings()
    }
    const displayBookings = (): void => {
        let filteredData: BookingInterfaceData[]
        // !!! ACTUALIZAR POR NUMERO DE HABITACIONES AL TENER LOS DATOS:
        // switch (selectedButton) {
        //     case BookingButtonType.all:
        //         filteredData = bookingAll.filter(booking =>
        //             booking.full_name_guest.toLowerCase().includes(inputText.toLowerCase())
        //         )
        //         break
        //     case BookingButtonType.checkin:
        //         filteredData = bookingAll.filter(booking =>
        //             booking.full_name_guest.toLowerCase().includes(inputText.toLowerCase()) &&
        //             checkBookingStatus(booking.check_in_date, booking.check_out_date) === BookingStatus.checkIn
        //         )
        //         break
        //     case BookingButtonType.inprogress:
        //         filteredData = bookingAll.filter(booking =>
        //             booking.full_name_guest.toLowerCase().includes(inputText.toLowerCase()) &&
        //             checkBookingStatus(booking.check_in_date, booking.check_out_date) === BookingStatus.inProgress
        //         )
        //         break
        //     case BookingButtonType.checkout:
        //         filteredData = bookingAll.filter(booking =>
        //             booking.full_name_guest.toLowerCase().includes(inputText.toLowerCase()) &&
        //             checkBookingStatus(booking.check_in_date, booking.check_out_date) === BookingStatus.checkOut
        //         )
        //         break
        // }
        filteredData = bookingAll   // !!! LINEA PROVISIONAL
        setFilteredBookings(sortData(filteredData))
        resetPage()
    }
    const sortData = (filteredData: BookingInterfaceData[]): BookingInterfaceData[] => {
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
    const deleteBookingById = (id: string, index: number): void => {
        dispatch(BookingDeleteByIdThunk(id))
        displayMenuOptions(index)
    }


    return (
        <bookingMainStyles.SectionPageBookings>
            <bookingMainStyles.DivCtnFuncionality>
                <bookingMainStyles.DivCtnTableDisplayFilter>
                    <TableDisplaySelector text='All Bookings' onClick={() => handleTableFilter(BookingButtonType.all)} isSelected={selectedButton === BookingButtonType.all} />
                    <TableDisplaySelector text='Check In' onClick={() => handleTableFilter(BookingButtonType.checkin)} isSelected={selectedButton === BookingButtonType.checkin} />
                    <TableDisplaySelector text='In Progress' onClick={() => handleTableFilter(BookingButtonType.inprogress)} isSelected={selectedButton === BookingButtonType.inprogress} />
                    <TableDisplaySelector text='Check Out' onClick={() => handleTableFilter(BookingButtonType.checkout)} isSelected={selectedButton === BookingButtonType.checkout} />
                </bookingMainStyles.DivCtnTableDisplayFilter>

                <bookingMainStyles.DivCtnSearch>
                    <TableSearchTerm onchange={handleInputTerm} placeholder='Search booking by client name' />
                </bookingMainStyles.DivCtnSearch>

                <bookingMainStyles.DivCtnButton>
                    <ButtonCreate onClick={() => navigate('booking-create')} children='+ New Booking' />
                </bookingMainStyles.DivCtnButton>
            </bookingMainStyles.DivCtnFuncionality>

            {showPopup && <PopupText isSlider={false} title={infoViewNotes.title} text={infoViewNotes.text} onClose={() => setShowPopup(false)} />}

            <Table rowlistlength={filteredBookings.length + 1} columnlistlength={Object.values(BookingNameColumn).length + 2} >
                <THTable>{''}</THTable>
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
                        <DivImgTable key={index + '-1'}>
                            #<b>{bookingData._id}</b>
                        </DivImgTable>,

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
                                setInfoViewNotes({
                                    title: `Special request #${bookingData._id} by ${bookingData.special_request}`,
                                    text: bookingData.special_request
                                })
                                setShowPopup(true)
                            }
                            }>View Notes</ButtonView>
                        </PTable>,

                        // <PTable key={index + '-8'} flexdirection='column' alignitems='left' justifycontent='center'>
                        //     <div>Nº {bookingData.room_data.number}</div>
                        //     <div>{bookingData.room_data.type}</div>
                        // </PTable>,

                        // <PTable key={index + '-9'}>
                        //     {
                        //         (() => {
                        //             const status = checkBookingStatus(bookingData.check_in_date, bookingData.check_out_date)
                        //             if (status === BookingStatus.checkIn) {
                        //                 return <PStatusBooking status={BookingStatus.checkIn}>Check In</PStatusBooking>
                        //             }
                        //             else if (status === BookingStatus.inProgress) {
                        //                 return <PStatusBooking status={BookingStatus.inProgress}>In Progress</PStatusBooking>
                        //             }
                        //             else {
                        //                 return <PStatusBooking status={BookingStatus.checkOut}>Check Out</PStatusBooking>
                        //             }
                        //         })()
                        //     }
                        // </PTable>,

                        <PTable key={index + '-9'}>
                            <IconOptions onClick={() => { displayMenuOptions(index) }} />
                            <DivCtnOptions display={`${tableOptionsDisplayed === index ? 'flex' : 'none'}`} isInTable={true} >
                                <ButtonOption onClick={() => { () => navigate(`booking-update/${bookingData._id}`) }}>Update</ButtonOption>
                                <ButtonOption onClick={() => { deleteBookingById(bookingData._id, index) }}>Delete</ButtonOption>
                            </DivCtnOptions>
                        </PTable>
                    ]
                }
                )}
            </Table>

            <paginationJS.DivCtnPagination>
                <paginationJS.ButtonSwitchPage onClick={resetPage} disabled={currentPage === 1} margin='0 1rem 0 0'>
                    &lt;&lt;
                </paginationJS.ButtonSwitchPage>
                <paginationJS.ButtonSwitchPage onClick={goToPrevPage} disabled={currentPage === 1}>
                    &lt;
                </paginationJS.ButtonSwitchPage>
                <paginationJS.SpanPageCount>
                    {currentPage} of {totalPages}
                </paginationJS.SpanPageCount>
                <paginationJS.ButtonSwitchPage onClick={goToNextPage} disabled={currentPage === totalPages}>
                    &gt;
                </paginationJS.ButtonSwitchPage>
                <paginationJS.ButtonSwitchPage onClick={lastPage} disabled={currentPage === totalPages} margin='0 0 0 1rem'>
                    &gt;&gt;
                </paginationJS.ButtonSwitchPage>
            </paginationJS.DivCtnPagination>

        </bookingMainStyles.SectionPageBookings>

    )
}