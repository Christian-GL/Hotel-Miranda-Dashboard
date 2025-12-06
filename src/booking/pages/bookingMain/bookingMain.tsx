
import React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"

import * as bookingMainStyles from './bookingMainStyles'
import { BookingButtonType } from "../../enums/bookingButtonType"
import { BookingColumnSort } from "../../enums/bookingColumnSort"
import { BookingStatus } from './../../enums/bookingStatus'
import { AppDispatch } from '../../../common/redux/store'
import { ApiStatus } from "../../../common/enums/ApiStatus"
import { BookingInterface } from "./../../interfaces/bookingInterface"
import { BookingColumnsArrowStatesInterface } from './../../interfaces/bookingrColumnsArrowStatesInterface'
import { RoomInterfaceBookings } from "../../../room/interfaces/roomInterface"
import { ArrowType } from "../../../common/enums/ArrowType"
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
    const nameColumnList: string[] = ['', 'Guest', 'Details', 'Order date', 'Check in', 'Check out', 'Special request', 'Room info', 'Booking status', '']
    const bookingAll: BookingInterface[] = useSelector(getBookingAllData)
    const bookingAllLoading: ApiStatus = useSelector(getBookingAllStatus)
    const roomAll: RoomInterfaceBookings[] = useSelector(getRoomAllData)
    const roomAllLoading: ApiStatus = useSelector(getRoomAllStatus)
    const [inputText, setInputText] = useState<string>('')
    const [tableOptionsDisplayed, setTableOptionsDisplayed] = useState<number>(-1)
    const [filteredBookings, setFilteredBookings] = useState<BookingInterface[]>([])
    const [selectedButton, setSelectedButton] = useState<BookingButtonType>(BookingButtonType.all)
    const [showPopup, setShowPopup] = useState<boolean>(false)
    const [infoViewNotes, setInfoViewNotes] = useState<PopupTextInterface>({ title: '', text: '' })
    const [arrowStates, setArrowStates] = useState<BookingColumnsArrowStatesInterface>({
        orderDate: ArrowType.right,
        checkIn: ArrowType.right,
        checkOut: ArrowType.right
    })
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
        else if (bookingAllLoading === ApiStatus.rejected) { alert("Error en la api de bookings") }
    }, [bookingAllLoading, bookingAll, inputText, selectedButton, arrowStates])
    useEffect(() => {
        if (roomAllLoading === ApiStatus.idle) { dispatch(RoomFetchAllThunk()) }
        else if (roomAllLoading === ApiStatus.fulfilled) { }
        else if (roomAllLoading === ApiStatus.rejected) { alert("Error en la api de bookings > rooms") }
    }, [roomAllLoading, roomAll])

    const navigateToBookingCreate = () => navigate('booking-create')
    const navigateToBookingUpdate = (id: string) => navigate(`booking-update/${id}`)
    const navigateToBookingDetail = (id: string) => navigate(`booking-details/${id}`)

    const handleInputTerm = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setInputText(e.target.value)
        resetPage()
    }
    const handleTableFilter = (type: BookingButtonType): void => {
        setSelectedButton(type)
        displayBookings()
    }
    const displayBookings = (): void => {
        let filteredData: BookingInterface[]
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
        const sortedData = sortData(filteredData)
        setFilteredBookings(sortedData)
        resetPage()
    }
    const sortData = (filteredData: BookingInterface[]): BookingInterface[] => {
        const activeColumn = (Object.keys(arrowStates) as (keyof BookingColumnsArrowStatesInterface)[]).find(key => arrowStates[key] !== ArrowType.right)
        let sortedData: BookingInterface[] = [...filteredData]
        if (activeColumn) {
            if (activeColumn === BookingColumnSort.orderDate || activeColumn === BookingColumnSort.checkIn || activeColumn === BookingColumnSort.checkOut) {
                sortedData.sort((a, b) => {
                    // !!!!!
                    let valueA: Date = new Date(a.order_date)
                    let valueB: Date = new Date(b.order_date)
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
    const handleColumnClick = (nameColumn: BookingColumnSort): void => {
        setArrowStates(prevState => {
            const newState = { ...prevState }

            if (newState[nameColumn] === ArrowType.right) { newState[nameColumn] = ArrowType.down }
            else if (newState[nameColumn] === ArrowType.down) { newState[nameColumn] = ArrowType.up }
            else if (newState[nameColumn] === ArrowType.up) { newState[nameColumn] = ArrowType.down }

            Object.keys(newState as BookingColumnsArrowStatesInterface).forEach((key) => {
                const typedKey = key as keyof BookingColumnsArrowStatesInterface

                if (typedKey !== nameColumn) {
                    newState[typedKey] = ArrowType.right
                }
            })

            return newState
        })

        handleTableFilter(selectedButton)
    }
    const getArrowIcon = (nameColumn: BookingColumnSort): JSX.Element => {
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
                    <ButtonCreate onClick={navigateToBookingCreate} children='+ New Booking' />
                </bookingMainStyles.DivCtnButton>
            </bookingMainStyles.DivCtnFuncionality>

            {showPopup && <PopupText isSlider={false} title={infoViewNotes.title} text={infoViewNotes.text} onClose={() => setShowPopup(false)} />}

            <Table rowlistlength={filteredBookings.length + 1} columnlistlength={nameColumnList.length} >
                {nameColumnList.map((nameColumn, index) => {
                    let content
                    switch (index) {
                        case 1:
                            content =
                                <THTable key={index} onClick={() => handleColumnClick(BookingColumnSort.orderDate)} cursorPointer="yes">
                                    {nameColumn}
                                    {getArrowIcon(BookingColumnSort.orderDate)}
                                </THTable>
                            break
                        case 2:
                            content =
                                <THTable key={index} onClick={() => handleColumnClick(BookingColumnSort.checkIn)} cursorPointer="yes">
                                    {nameColumn}
                                    {getArrowIcon(BookingColumnSort.checkIn)}
                                </THTable>
                            break
                        case 3:
                            content =
                                <THTable key={index} onClick={() => handleColumnClick(BookingColumnSort.checkOut)} cursorPointer="yes">
                                    {nameColumn}
                                    {getArrowIcon(BookingColumnSort.checkOut)}
                                </THTable>
                            break
                        default:
                            content =
                                <THTable key={index}>
                                    {nameColumn}
                                </THTable>
                    }

                    return content
                })}
                {currentPageItems.map((bookingData, index) => {
                    return [
                        <DivImgTable key={index + '-1'}>
                            #<b>{bookingData._id}</b>
                        </DivImgTable>,

                        <PTable key={index + '-2'}>
                            <ButtonView onClick={() => navigateToBookingDetail(bookingData._id)}>View Details</ButtonView>
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
                                <ButtonOption onClick={() => { navigateToBookingUpdate(bookingData._id) }}>Update</ButtonOption>
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