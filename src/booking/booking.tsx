
import React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"

import * as bookingsStyles from './bookingStyles.ts'
import * as gb from '../common/styles/globalVars.ts'
import { BookingStatus } from './data/bookingStatus.ts'
import { AppDispatch } from '../common/redux/store.ts'
import { ApiStatus } from "../common/enums/ApiStatus.ts"
import { BookingInterface } from "./interfaces/bookingInterface.ts"
import { BookingColumnsArrowStatesInterface } from './interfaces/bookingrColumnsArrowStatesInterface.ts'
import { RoomInterface } from "../room/interfaces/roomInterface.ts"
import { ArrowType } from "../common/enums/ArrowType.ts"
import { dateFormatToYYYYMMDD, hourFormatTo24H } from "../common/utils/formUtils.ts"
import { PopupText } from "../common/components/popupText/popupText.tsx"
import { PopupTextInterface } from '../common/components/popupText/popupTextInterface.ts'
import { TableDisplayIndicator } from "../common/components/tableDisplaySelector/tableDisplaySelector.tsx"
import { TableSearchTerm } from "../common/components/tableSearchTerm/tableSearchTerm.tsx"
import { ButtonCreate } from "../common/components/buttonCreate/buttonCreate.tsx"
import {
    Table, THTable, TriangleUp, TriangleRight, TriangleDown, DivImgTable, ImgTableUser, PTable,
    IconOptions, ButtonView, PStatusBooking, DivCtnOptions, ButtonOption
} from "../common/styles/tableStyles.ts"
import { usePagination } from "../common/hooks/usePagination.ts"
import * as paginationJS from '../common/styles/pagination.ts'
import { getBookingAllData, getBookingAllStatus } from "./features/bookingSlice.ts"
import { BookingFetchAllThunk } from "./features/thunks/bookingFetchAllThunk.ts"
import { BookingDeleteByIdThunk } from "./features/thunks/bookingDeleteByIdThunk.ts"
import { getRoomAllData, getRoomAllStatus } from "../room/features/roomSlice.ts"
import { RoomFetchAllThunk } from "../room/features/thunks/roomFetchAllThunk.ts"
import { RoomUpdateThunk } from "../room/features/thunks/roomUpdateThunk.ts"


export const Bookings = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    enum ButtonType {
        all = "all",
        checkin = "active",
        inprogress = "inprogress",
        checkout = "checkout"
    }
    enum columnsSortAvailable {
        guest = 'guest',
        orderDate = 'orderDate',
        checkIn = 'checkIn',
        checkOut = 'checkOut',
        roomNumber = 'roomNumber'
    }
    const nameColumnList = ['', 'Guest', 'Details', 'Order date', 'Check in', 'Check out', 'Special request', 'Room info', 'Booking status', '']
    const bookingAll = useSelector(getBookingAllData)
    const bookingAllLoading = useSelector(getBookingAllStatus)
    const roomAll = useSelector(getRoomAllData)
    const roomAllLoading = useSelector(getRoomAllStatus)
    const [inputText, setInputText] = useState<string>('')
    const [tableOptionsDisplayed, setTableOptionsDisplayed] = useState<number>(-1)
    const [filteredBookings, setFilteredBookings] = useState<BookingInterface[]>([])
    const [selectedButton, setSelectedButton] = useState<ButtonType>(ButtonType.all)
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
    } = usePagination(filteredBookings, 10)
    const [showPopup, setShowPopup] = useState<boolean>(false)
    const [infoViewNotes, setInfoViewNotes] = useState<PopupTextInterface>({ title: '', text: '' })

    useEffect(() => {
        if (bookingAllLoading === ApiStatus.idle) { dispatch(BookingFetchAllThunk()) }
        else if (bookingAllLoading === ApiStatus.fulfilled) { displayBookings() }
        else if (bookingAllLoading === ApiStatus.rejected) { alert("Error en la api de bookings") }
    }, [bookingAllLoading, bookingAll, inputText, selectedButton, arrowStates])
    useEffect(() => {
        if (roomAllLoading === ApiStatus.idle) { dispatch(RoomFetchAllThunk()) }
        else if (roomAllLoading === ApiStatus.fulfilled) { }
        else if (roomAllLoading === ApiStatus.rejected) { alert("Error en la api de rooms") }
    }, [roomAllLoading, roomAll])

    const navigateToBookingCreate = (): void => {
        navigate('booking-create')
    }
    const navigateToBookingUpdate = (id: number): void => {
        navigate(`booking-update/${id}`)
    }
    const navigateToBookingDetail = (id: number): void => {
        navigate(`booking-details/${id}`)
    }
    const openPopup = (): void => {
        setShowPopup(true)
    }

    const handleInputTerm = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setInputText(e.target.value)
        resetPage()
    }
    const handleTableFilter = (type: ButtonType): void => {
        setSelectedButton(type)
        displayBookings()
    }
    const displayBookings = (): void => {
        let filteredData: BookingInterface[]
        switch (selectedButton) {
            case ButtonType.all:
                filteredData = bookingAll.filter(booking =>
                    booking.full_name_guest.toLowerCase().includes(inputText.toLowerCase())
                )
                break
            case ButtonType.checkin:
                filteredData = bookingAll.filter(booking =>
                    booking.full_name_guest.toLowerCase().includes(inputText.toLowerCase()) &&
                    booking.room_booking_status === BookingStatus.checkIn
                )
                break
            case ButtonType.inprogress:
                filteredData = bookingAll.filter(booking =>
                    booking.full_name_guest.toLowerCase().includes(inputText.toLowerCase()) &&
                    booking.room_booking_status === BookingStatus.inProgress
                )
                break
            case ButtonType.checkout:
                filteredData = bookingAll.filter(booking =>
                    booking.full_name_guest.toLowerCase().includes(inputText.toLowerCase()) &&
                    booking.room_booking_status === BookingStatus.checkOut
                )
                break
        }
        const sortedData = sortData(filteredData)
        setFilteredBookings(sortedData)
    }
    const sortData = (filteredData: BookingInterface[]): BookingInterface[] => {
        const activeColumn = Object.keys(arrowStates).find(key => arrowStates[key] !== ArrowType.right)
        let sortedData: BookingInterface[] = [...filteredData]
        if (activeColumn) {
            sortedData.sort((a, b) => {
                let valueA: string | number | Date
                let valueB: string | number | Date

                if (activeColumn === columnsSortAvailable.guest) {
                    valueA = a.full_name_guest.toLowerCase()
                    valueB = b.full_name_guest.toLowerCase()
                }
                else if (activeColumn === columnsSortAvailable.orderDate) {
                    valueA = new Date(dateFormatToYYYYMMDD(a.order_date) + ' ' + hourFormatTo24H(a.order_time))
                    valueB = new Date(dateFormatToYYYYMMDD(b.order_date) + ' ' + hourFormatTo24H(b.order_time))
                }
                else if (activeColumn === columnsSortAvailable.checkIn) {
                    valueA = new Date(dateFormatToYYYYMMDD(a.check_in_date) + ' ' + hourFormatTo24H(a.check_in_time))
                    valueB = new Date(dateFormatToYYYYMMDD(b.check_in_date) + ' ' + hourFormatTo24H(b.check_in_time))
                }
                else if (activeColumn === columnsSortAvailable.checkOut) {
                    valueA = new Date(dateFormatToYYYYMMDD(a.check_out_date) + ' ' + hourFormatTo24H(a.check_out_time))
                    valueB = new Date(dateFormatToYYYYMMDD(b.check_out_date) + ' ' + hourFormatTo24H(b.check_out_time))
                }
                else if (activeColumn === columnsSortAvailable.roomNumber) {
                    valueA = valueA = a.room_id
                    valueB = b.room_id
                }
                else {
                    valueA = 'activeColumn no encontrada'
                    valueB = 'activeColumn no encontrada'
                }

                if (arrowStates[activeColumn] === ArrowType.down) {
                    return valueB > valueA ? -1 : 1
                } else {
                    return valueA > valueB ? -1 : 1
                }
            })
        }
        return sortedData
    }
    const handleColumnClick = (nameColumn: columnsSortAvailable): void => {
        setArrowStates(prevState => {
            const newState = { ...prevState }

            if (newState[nameColumn] === ArrowType.right) { newState[nameColumn] = ArrowType.down }
            else if (newState[nameColumn] === ArrowType.down) { newState[nameColumn] = ArrowType.up }
            else if (newState[nameColumn] === ArrowType.up) { newState[nameColumn] = ArrowType.down }

            Object.keys(newState).forEach(key => {
                if (key !== nameColumn) {
                    newState[key] = ArrowType.right
                }
            })

            return newState
        })

        handleTableFilter(selectedButton)
    }
    const getArrowIcon = (nameColumn: columnsSortAvailable): JSX.Element => {
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
        const booking: BookingInterface | undefined = bookingAll.find(booking => booking.id === id)
        if (!booking) { return }

        const room: RoomInterface | undefined = roomAll.find(room => room.id === booking.room_id)
        if (!room) { return }

        const roomUpdated: RoomInterface = {
            ...room,
            booking_list: room.booking_list.filter(bookingId => bookingId !== booking.room_id)
        }

        dispatch(RoomUpdateThunk(roomUpdated))
        dispatch(BookingDeleteByIdThunk(id))
        displayMenuOptions(index)
    }


    return (

        <bookingsStyles.SectionPageBookings>
            <bookingsStyles.DivCtnFuncionality>
                <bookingsStyles.DivCtnTableDisplayFilter>
                    <TableDisplayIndicator text='All Bookings' onClick={() => handleTableFilter(ButtonType.all)} isSelected={selectedButton === ButtonType.all} />
                    <TableDisplayIndicator text='Check In' onClick={() => handleTableFilter(ButtonType.checkin)} isSelected={selectedButton === ButtonType.checkin} />
                    <TableDisplayIndicator text='In Progress' onClick={() => handleTableFilter(ButtonType.inprogress)} isSelected={selectedButton === ButtonType.inprogress} />
                    <TableDisplayIndicator text='Check Out' onClick={() => handleTableFilter(ButtonType.checkout)} isSelected={selectedButton === ButtonType.checkout} />
                </bookingsStyles.DivCtnTableDisplayFilter>

                <bookingsStyles.DivCtnSearch>
                    <TableSearchTerm onchange={handleInputTerm} placeholder='Search booking by client name' />
                </bookingsStyles.DivCtnSearch>

                <bookingsStyles.DivCtnButton>
                    <ButtonCreate onClick={navigateToBookingCreate} children='+ New Booking' />
                </bookingsStyles.DivCtnButton>
            </bookingsStyles.DivCtnFuncionality>

            {showPopup && <PopupText title={infoViewNotes.title} text={infoViewNotes.text} onClose={() => setShowPopup(false)} />}

            <Table rowlistlength={filteredBookings.length + 1} columnlistlength={nameColumnList.length} >
                {nameColumnList.map((nameColumn, index) =>
                    index === 1 || index === 3 || index === 4 || index === 5 || index === 7 ?
                        <THTable key={index} cursorPointer='yes' onClick={() => {
                            switch (index) {
                                case 1: handleColumnClick(columnsSortAvailable.guest); break
                                case 3: handleColumnClick(columnsSortAvailable.orderDate); break
                                case 4: handleColumnClick(columnsSortAvailable.checkIn); break
                                case 5: handleColumnClick(columnsSortAvailable.checkOut); break
                                case 7: handleColumnClick(columnsSortAvailable.roomNumber); break
                                default: ; break
                            }
                        }}
                        >
                            {nameColumn}
                            {(() => {
                                switch (index) {
                                    case 1: return getArrowIcon(columnsSortAvailable.guest)
                                    case 3: return getArrowIcon(columnsSortAvailable.orderDate)
                                    case 4: return getArrowIcon(columnsSortAvailable.checkIn)
                                    case 5: return getArrowIcon(columnsSortAvailable.checkOut)
                                    case 7: return getArrowIcon(columnsSortAvailable.roomNumber)
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
                            <div style={{ color: `${gb.colorGreen}` }}>
                                <b>{bookingData.full_name_guest}</b>
                            </div>
                            <div>#<b>{bookingData.id}</b></div>
                        </PTable>,

                        <PTable key={index + '-3'}>
                            <ButtonView onClick={() => navigateToBookingDetail(bookingData.id)}>View Details</ButtonView>
                        </PTable>,

                        <PTable key={index + '-4'} flexdirection='column' alignitems='left' justifycontent='center' >
                            <div>{bookingData.order_date}</div>
                            <div>{bookingData.order_time}</div>
                        </PTable>,

                        <PTable key={index + '-5'} flexdirection='column' alignitems='left' justifycontent='center'>
                            <div>{bookingData.check_in_date}</div>
                            <div>{bookingData.check_in_time}</div>
                        </PTable>,

                        <PTable key={index + '-6'} flexdirection='column' alignitems='left' justifycontent='center'>
                            <div>{bookingData.check_out_date}</div>
                            <div>{bookingData.check_out_time}</div>
                        </PTable>,

                        <PTable key={index + '-7'}>
                            <ButtonView onClick={() => {
                                setInfoViewNotes({
                                    title: `Special request #${bookingData.id} by ${bookingData.full_name_guest}`,
                                    text: bookingData.special_request
                                })
                                openPopup()
                            }
                            }>View Notes</ButtonView>
                        </PTable>,

                        <PTable key={index + '-8'} flexdirection='column' alignitems='left' justifycontent='center'>
                            <div>Nº {bookingData.room_id}</div>
                            <div>{bookingData.room_type}</div>
                        </PTable>,

                        <PTable key={index + '-9'}>
                            {
                                (() => {
                                    switch (bookingData.room_booking_status) {
                                        case 'Check In':
                                            return <PStatusBooking color={`${gb.colorGreen}`} backgroundcolor={`${gb.colorLightGreenButtonTable}`}>
                                                Check In
                                            </PStatusBooking>
                                        case 'Check Out':
                                            return <PStatusBooking color={`${gb.colorRed}`} backgroundcolor={`${gb.colorLightRedButtonTable}`}>
                                                Check Out
                                            </PStatusBooking>
                                        case 'In Progress':
                                            return <PStatusBooking color={`${gb.colorLightRedButtonTable2}`} backgroundcolor={`${gb.colorLightGreenButtonTable2}`}>
                                                In Progress
                                            </PStatusBooking>
                                        default:
                                            return <></>
                                    }
                                }
                                )()
                            }
                        </PTable>,

                        <PTable key={index + '-9'}>
                            <IconOptions onClick={() => { displayMenuOptions(index) }} />
                            <DivCtnOptions display={`${tableOptionsDisplayed === index ? 'flex' : 'none'}`} >
                                <ButtonOption onClick={() => { navigateToBookingUpdate(bookingData.id) }}>Update</ButtonOption>
                                <ButtonOption onClick={() => { deleteBookingById(bookingData.id, index) }}>Delete</ButtonOption>
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

        </bookingsStyles.SectionPageBookings>

    )
}