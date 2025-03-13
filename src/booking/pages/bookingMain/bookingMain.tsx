
import React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"

import * as bookingMainStyles from './bookingMainStyles.ts'
import { BookingButtonType } from "../../enums/bookingButtonType.ts"
import { BookingColumnSort } from "../../enums/bookingColumnSort.ts"
import { BookingStatus } from './../../enums/bookingStatus.ts'
import { AppDispatch } from '../../../common/redux/store.ts'
import { ApiStatus } from "../../../common/enums/ApiStatus.ts"
import { BookingInterfaceRoom } from "./../../interfaces/bookingInterface.ts"
import { BookingColumnsArrowStatesInterface } from './../../interfaces/bookingrColumnsArrowStatesInterface.ts'
import { RoomInterfaceBookings } from "../../../room/interfaces/roomInterface.ts"
import { ArrowType } from "../../../common/enums/ArrowType.ts"
import { PopupText } from "../../../common/components/popupText/popupText.tsx"
import { PopupTextInterface } from '../../../common/components/popupText/popupTextInterface.ts'
import { formatDateForPrint } from '../../../common/utils/dateUtils.ts'
import { checkBookingStatus } from '../../../common/utils/checkBookingStatus.ts'
import { TableDisplaySelector } from "../../../common/components/tableDisplaySelector/tableDisplaySelector.tsx"
import { TableSearchTerm } from "../../../common/components/tableSearchTerm/tableSearchTerm.tsx"
import { ButtonCreate } from "../../../common/components/buttonCreate/buttonCreate.tsx"
import {
    Table, THTable, TriangleUp, TriangleRight, TriangleDown, DivNameTable, DivImgTable, ImgTableUser, PTable,
    IconOptions, ButtonView, PStatusBooking, DivCtnOptions, ButtonOption
} from "../../../common/styles/tableStyles.ts"
import { usePagination } from "../../../common/hooks/usePagination.ts"
import * as paginationJS from '../../../common/styles/pagination.ts'
import { getBookingAllData, getBookingAllStatus } from "./../../features/bookingSlice.ts"
import { BookingFetchAllThunk } from "./../../features/thunks/bookingFetchAllThunk.ts"
import { BookingDeleteByIdThunk } from "./../../features/thunks/bookingDeleteByIdThunk.ts"
import { getRoomAllData, getRoomAllStatus } from "../../../room/features/roomSlice.ts"
import { RoomFetchAllThunk } from "../../../room/features/thunks/roomFetchAllThunk.ts"


export const BookingMain = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const nameColumnList: string[] = ['', 'Guest', 'Details', 'Order date', 'Check in', 'Check out', 'Special request', 'Room info', 'Booking status', '']
    const bookingAll: BookingInterfaceRoom[] = useSelector(getBookingAllData)
    const bookingAllLoading: ApiStatus = useSelector(getBookingAllStatus)
    const roomAll: RoomInterfaceBookings[] = useSelector(getRoomAllData)
    const roomAllLoading: ApiStatus = useSelector(getRoomAllStatus)
    const [inputText, setInputText] = useState<string>('')
    const [tableOptionsDisplayed, setTableOptionsDisplayed] = useState<number>(-1)
    const [filteredBookings, setFilteredBookings] = useState<BookingInterfaceRoom[]>([])
    const [selectedButton, setSelectedButton] = useState<BookingButtonType>(BookingButtonType.all)
    const [showPopup, setShowPopup] = useState<boolean>(false)
    const [infoViewNotes, setInfoViewNotes] = useState<PopupTextInterface>({ title: '', text: '' })
    const [arrowStates, setArrowStates] = useState<BookingColumnsArrowStatesInterface>({
        guest: ArrowType.right,
        orderDate: ArrowType.right,
        checkIn: ArrowType.right,
        checkOut: ArrowType.right,
        roomNumber: ArrowType.down
    })
    const {
        currentPageItems,
        currentPage,
        totalPages,
        goToNextPage,
        goToPrevPage,
        resetPage,
        lastPage
    } = usePagination<BookingInterfaceRoom>(filteredBookings, 10)

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
    const navigateToBookingUpdate = (id: number) => navigate(`booking-update/${id}`)
    const navigateToBookingDetail = (id: number) => navigate(`booking-details/${id}`)

    const handleInputTerm = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setInputText(e.target.value)
        resetPage()
    }
    const handleTableFilter = (type: BookingButtonType): void => {
        setSelectedButton(type)
        displayBookings()
    }
    const displayBookings = (): void => {
        let filteredData: BookingInterfaceRoom[]
        switch (selectedButton) {
            case BookingButtonType.all:
                filteredData = bookingAll.filter(booking =>
                    booking.full_name_guest.toLowerCase().includes(inputText.toLowerCase())
                )
                break
            case BookingButtonType.checkin:
                filteredData = bookingAll.filter(booking =>
                    booking.full_name_guest.toLowerCase().includes(inputText.toLowerCase()) &&
                    checkBookingStatus(booking.check_in_date, booking.check_out_date) === BookingStatus.checkIn
                )
                break
            case BookingButtonType.inprogress:
                filteredData = bookingAll.filter(booking =>
                    booking.full_name_guest.toLowerCase().includes(inputText.toLowerCase()) &&
                    checkBookingStatus(booking.check_in_date, booking.check_out_date) === BookingStatus.inProgress
                )
                break
            case BookingButtonType.checkout:
                filteredData = bookingAll.filter(booking =>
                    booking.full_name_guest.toLowerCase().includes(inputText.toLowerCase()) &&
                    checkBookingStatus(booking.check_in_date, booking.check_out_date) === BookingStatus.checkOut
                )
                break
        }
        const sortedData = sortData(filteredData)
        setFilteredBookings(sortedData)
        resetPage()
    }
    const sortData = (filteredData: BookingInterfaceRoom[]): BookingInterfaceRoom[] => {
        const activeColumn = Object.keys(arrowStates).find(key => arrowStates[key] !== ArrowType.right)
        let sortedData: BookingInterfaceRoom[] = [...filteredData]
        if (activeColumn) {
            if (activeColumn === BookingColumnSort.guest) {
                sortedData.sort((a, b) => {
                    let valueA: string = a.full_name_guest.toLowerCase()
                    let valueB: string = b.full_name_guest.toLowerCase()
                    if (arrowStates[activeColumn] === ArrowType.up) {
                        return valueB > valueA ? 1 : (valueB < valueA ? -1 : 0)
                    } else {
                        return valueA > valueB ? 1 : (valueA < valueB ? -1 : 0)
                    }
                })
            }
            else if (activeColumn === BookingColumnSort.orderDate) {
                sortedData.sort((a, b) => {
                    let valueA: Date = new Date(a.order_date)
                    let valueB: Date = new Date(b.order_date)
                    if (arrowStates[activeColumn] === ArrowType.up) {
                        return valueB > valueA ? 1 : (valueB < valueA ? -1 : 0)
                    } else {
                        return valueA > valueB ? 1 : (valueA < valueB ? -1 : 0)
                    }
                })
            }
            else if (activeColumn === BookingColumnSort.checkIn) {
                sortedData.sort((a, b) => {
                    let valueA: Date = new Date(a.check_in_date)
                    let valueB: Date = new Date(b.check_in_date)
                    if (arrowStates[activeColumn] === ArrowType.up) {
                        return valueB > valueA ? 1 : (valueB < valueA ? -1 : 0)
                    } else {
                        return valueA > valueB ? 1 : (valueA < valueB ? -1 : 0)
                    }
                })
            }
            else if (activeColumn === BookingColumnSort.checkOut) {
                sortedData.sort((a, b) => {
                    let valueA: Date = new Date(a.check_out_date)
                    let valueB: Date = new Date(b.check_out_date)
                    if (arrowStates[activeColumn] === ArrowType.up) {
                        return valueB > valueA ? 1 : (valueB < valueA ? -1 : 0)
                    } else {
                        return valueA > valueB ? 1 : (valueA < valueB ? -1 : 0)
                    }
                })
            }
            else if (activeColumn === BookingColumnSort.roomNumber) {
                sortedData.sort((a, b) => {
                    let valueA: number = parseInt(a.room_data.number)
                    let valueB: number = parseInt(b.room_data.number)
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

            Object.keys(newState).map(key => {
                if (key !== nameColumn) {
                    newState[key] = ArrowType.right
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
    const deleteBookingById = (id: number, index: number): void => {
        // const booking: BookingInterfaceRoom | undefined = bookingAll.find(booking => booking.id === id)
        // if (!booking) { return }

        // const room: RoomInterfaceBookings | undefined = roomAll.find(room => room === booking.room_id)
        // if (!room) { return }

        // const roomUpdated: RoomInterfaceBookings = {
        //     ...room,
        //     booking_id_list: room.booking_id_list.filter(bookingId => bookingId !== booking.room_id)
        // }

        // dispatch(RoomUpdateThunk(roomUpdated))
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
                {nameColumnList.map((nameColumn, index) =>
                    index === 1 || index === 3 || index === 4 || index === 5 || index === 7 ?
                        <THTable key={index} cursorPointer='yes' onClick={() => {
                            switch (index) {
                                case 1: handleColumnClick(BookingColumnSort.guest); break
                                case 3: handleColumnClick(BookingColumnSort.orderDate); break
                                case 4: handleColumnClick(BookingColumnSort.checkIn); break
                                case 5: handleColumnClick(BookingColumnSort.checkOut); break
                                case 7: handleColumnClick(BookingColumnSort.roomNumber); break
                                default: ; break
                            }
                        }}
                        >
                            {nameColumn}
                            {(() => {
                                switch (index) {
                                    case 1: return getArrowIcon(BookingColumnSort.guest)
                                    case 3: return getArrowIcon(BookingColumnSort.orderDate)
                                    case 4: return getArrowIcon(BookingColumnSort.checkIn)
                                    case 5: return getArrowIcon(BookingColumnSort.checkOut)
                                    case 7: return getArrowIcon(BookingColumnSort.roomNumber)
                                    default: return null
                                }
                            })()}
                        </THTable> :
                        <THTable key={index}>{nameColumn}</THTable>
                )}
                {currentPageItems.map((bookingData, index) => {
                    return [
                        <DivImgTable key={index + '-1'}>
                            <ImgTableUser src={`${bookingData.photo}`} />
                        </DivImgTable>,

                        <PTable key={index + '-2'} flexdirection='column' alignitems='left' justifycontent='center'>
                            <DivNameTable>
                                <b>{bookingData.full_name_guest}</b>
                            </DivNameTable>
                            <div>#<b>{bookingData._id}</b></div>
                        </PTable>,

                        <PTable key={index + '-3'}>
                            <ButtonView onClick={() => navigateToBookingDetail(bookingData._id)}>View Details</ButtonView>
                        </PTable>,

                        <PTable key={index + '-4'} flexdirection='column' alignitems='left' justifycontent='center' >
                            {formatDateForPrint(bookingData.order_date)}
                        </PTable>,

                        <PTable key={index + '-5'} flexdirection='column' alignitems='left' justifycontent='center'>
                            {formatDateForPrint(bookingData.check_in_date)}
                        </PTable>,

                        <PTable key={index + '-6'} flexdirection='column' alignitems='left' justifycontent='center'>
                            {formatDateForPrint(bookingData.check_out_date)}
                        </PTable>,

                        <PTable key={index + '-7'}>
                            <ButtonView onClick={() => {
                                setInfoViewNotes({
                                    title: `Special request #${bookingData._id} by ${bookingData.full_name_guest}`,
                                    text: bookingData.special_request
                                })
                                setShowPopup(true)
                            }
                            }>View Notes</ButtonView>
                        </PTable>,

                        <PTable key={index + '-8'} flexdirection='column' alignitems='left' justifycontent='center'>
                            <div>Nº {bookingData.room_data.number}</div>
                            <div>{bookingData.room_data.type}</div>
                        </PTable>,

                        <PTable key={index + '-9'}>
                            {
                                (() => {
                                    const status = checkBookingStatus(bookingData.check_in_date, bookingData.check_out_date)
                                    if (status === BookingStatus.checkIn) {
                                        return <PStatusBooking status={BookingStatus.checkIn}>Check In</PStatusBooking>
                                    }
                                    else if (status === BookingStatus.inProgress) {
                                        return <PStatusBooking status={BookingStatus.inProgress}>In Progress</PStatusBooking>
                                    }
                                    else {
                                        return <PStatusBooking status={BookingStatus.checkOut}>Check Out</PStatusBooking>
                                    }
                                })()
                            }
                        </PTable>,

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