
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"

import * as bookingsJS from "./booking.js"
import * as gb from '../common/styles/globalVars.js'
import { dateFormatToYYYYMMDD, hourFormatTo24H } from "../common/utils/formUtils.js"
import { PopupText } from "../common/components/popupText/popupText.jsx"
import { TableDisplayIndicator } from "../common/components/tableDisplaySelector/tableDisplaySelector.jsx"
import { TableSearchTerm } from "../common/components/tableSearchTerm/tableSearchTerm.jsx"
import { ButtonCreate } from "../common/components/buttonCreate/buttonCreate.jsx"
import { Table, THTable, TriangleUp, TriangleRight, TriangleDown, DivImgTable, ImgTableUser, PTable, IconOptions, ButtonView, PStatusBooking, DivCtnOptions, ButtonOption } from "../common/styles/table.js"
import { usePagination } from "../common/hooks/usePagination.js"
import * as paginationJS from '../common/styles/pagination.js'
import { getBookingAllData, getBookingAllStatus } from "./features/bookingSlice.js"
import { BookingFetchAllThunk } from "./features/thunks/bookingFetchAllThunk.js"
import { BookingDeleteByIdThunk } from "./features/thunks/bookingDeleteByIdThunk.js"
import { getRoomAllData, getRoomAllStatus } from "../room/features/roomSlice.js"
import { RoomFetchAllThunk } from "../room/features/thunks/roomFetchAllThunk.js"
import { RoomUpdateThunk } from "../room/features/thunks/roomUpdateThunk.js"


export const Bookings = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const nameColumnList = ['', 'Guest', 'Details', 'Order date', 'Check in', 'Check out', 'Special request', 'Room info', 'Booking status', '']
    const bookingAll = useSelector(getBookingAllData)
    const bookingAllLoading = useSelector(getBookingAllStatus)
    const roomAll = useSelector(getRoomAllData)
    const roomAllLoading = useSelector(getRoomAllStatus)
    const [inputText, setInputText] = useState('')
    const [tableOptionsDisplayed, setTableOptionsDisplayed] = useState()
    const [filteredBookings, setFilteredBookings] = useState([])
    const [selectedButton, setSelectedButton] = useState('all')
    const [arrowStates, setArrowStates] = useState({
        guest: 'right',
        orderDate: 'right',
        checkIn: 'right',
        checkOut: 'right',
        roomNumber: 'down'
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
    const [showPopup, setShowPopup] = useState(false)
    const [infoViewNotes, setInfoViewNotes] = useState({})

    useEffect(() => {
        if (bookingAllLoading === "idle") { dispatch(BookingFetchAllThunk()) }
        else if (bookingAllLoading === "fulfilled") { displayBookings() }
        else if (bookingAllLoading === "rejected") { alert("Error en la api") }
    }, [bookingAllLoading, bookingAll, inputText, selectedButton, arrowStates])
    useEffect(() => {
        if (roomAllLoading === "idle") { dispatch(RoomFetchAllThunk()) }
        else if (roomAllLoading === "fulfilled") { }
        else if (roomAllLoading === "rejected") { alert("Error en la api") }
    }, [roomAllLoading, roomAll])

    const navigateToBookingCreate = () => {
        navigate('booking-create')
    }
    const navigateToBookingUpdate = (id) => {
        navigate(`booking-update/${id}`)
    }
    const navigateToBookingDetail = (id) => {
        navigate(`booking-details/${id}`)
    }
    const openPopup = () => {
        setShowPopup(true)
    }

    const handleInputTerm = (e) => {
        setInputText(e.target.value)
        resetPage()
    }
    const handleTableFilter = (type) => {
        setSelectedButton(type)
        displayBookings()
    }
    const displayBookings = () => {
        let filteredData
        switch (selectedButton) {
            case 'all':
                filteredData = bookingAll.filter(booking =>
                    booking.full_name_guest.toLowerCase().includes(inputText.toLowerCase())
                )
                break
            case 'checkin':
                filteredData = bookingAll.filter(booking =>
                    booking.full_name_guest.toLowerCase().includes(inputText.toLowerCase()) &&
                    booking.room_booking_status === 'Check In'
                )
                break
            case 'inprogress':
                filteredData = bookingAll.filter(booking =>
                    booking.full_name_guest.toLowerCase().includes(inputText.toLowerCase()) &&
                    booking.room_booking_status === 'In Progress'
                )
                break
            case 'checkout':
                filteredData = bookingAll.filter(booking =>
                    booking.full_name_guest.toLowerCase().includes(inputText.toLowerCase()) &&
                    booking.room_booking_status === 'Check Out'
                )
                break
        }
        const sortedData = sortData(filteredData)
        setFilteredBookings(sortedData)
    }
    const sortData = (filteredData) => {
        const activeColumn = Object.keys(arrowStates).find(key => arrowStates[key] !== 'right')
        let sortedData
        if (activeColumn) {
            sortedData = filteredData.sort((a, b) => {
                let valueA
                let valueB

                if (activeColumn === 'guest') {
                    valueA = a.full_name_guest.toLowerCase()
                    valueB = b.full_name_guest.toLowerCase()
                }
                else if (activeColumn === 'orderDate') {
                    valueA = new Date(dateFormatToYYYYMMDD(a.order_date) + ' ' + hourFormatTo24H(a.order_time))
                    valueB = new Date(dateFormatToYYYYMMDD(b.order_date) + ' ' + hourFormatTo24H(b.order_time))
                }
                else if (activeColumn === 'checkIn') {
                    valueA = new Date(dateFormatToYYYYMMDD(a.check_in_date) + ' ' + hourFormatTo24H(a.check_in_time))
                    valueB = new Date(dateFormatToYYYYMMDD(b.check_in_date) + ' ' + hourFormatTo24H(b.check_in_time))
                }
                else if (activeColumn === 'checkOut') {
                    valueA = new Date(dateFormatToYYYYMMDD(a.check_out_date) + ' ' + hourFormatTo24H(a.check_out_time))
                    valueB = new Date(dateFormatToYYYYMMDD(b.check_out_date) + ' ' + hourFormatTo24H(b.check_out_time))
                }
                else if (activeColumn === 'roomNumber') {
                    valueA = valueA = a.room_id
                    valueB = b.room_id
                }

                if (arrowStates[activeColumn] === 'down') {
                    return valueB > valueA ? -1 : 1
                } else {
                    return valueA > valueB ? -1 : 1
                }
            })
        }
        return sortedData
    }
    const handleColumnClick = (column) => {
        setArrowStates(prevState => {
            const newState = { ...prevState }

            if (newState[column] === 'right') { newState[column] = 'down' }
            else if (newState[column] === 'down') { newState[column] = 'up' }
            else if (newState[column] === 'up') { newState[column] = 'down' }

            Object.keys(newState).forEach(key => {
                if (key !== column) {
                    newState[key] = 'right'
                }
            })

            return newState
        })

        handleTableFilter(selectedButton)
    }
    const getArrowIcon = (column) => {
        const state = arrowStates[column]
        if (state === 'up') { return <TriangleUp /> }
        else if (state === 'down') { return <TriangleDown /> }
        else { return <TriangleRight /> }
    }
    const displayMenuOptions = (index) => {
        tableOptionsDisplayed === index ?
            setTableOptionsDisplayed() :
            setTableOptionsDisplayed(index)
    }
    const deleteBookingById = (id, index) => {
        const booking = bookingAll.find(booking => booking.id === parseInt(id))
        const room = roomAll.find(room => room.id === booking.room_id)

        console.log(room)
        const roomUpdated = {
            ...room,
            booking_list: room.booking_list.filter(bookingId => bookingId !== booking.room_id)
        }
        console.log(roomUpdated)
        dispatch(RoomUpdateThunk(roomUpdated))

        dispatch(BookingDeleteByIdThunk(parseInt(id)))
        displayMenuOptions(index)
    }


    return (

        <bookingsJS.SectionPageBookings>
            <bookingsJS.DivCtnFuncionality>
                <bookingsJS.DivCtnTableDisplayFilter>
                    <TableDisplayIndicator text='All Bookings' onClick={() => handleTableFilter('all')} isSelected={selectedButton === 'all'} />
                    <TableDisplayIndicator text='Check In' onClick={() => handleTableFilter('checkin')} isSelected={selectedButton === 'checkin'} />
                    <TableDisplayIndicator text='In Progress' onClick={() => handleTableFilter('inprogress')} isSelected={selectedButton === 'inprogress'} />
                    <TableDisplayIndicator text='Check Out' onClick={() => handleTableFilter('checkout')} isSelected={selectedButton === 'checkout'} />
                </bookingsJS.DivCtnTableDisplayFilter>

                <bookingsJS.DivCtnSearch>
                    <TableSearchTerm onchange={handleInputTerm} placeholder='Search booking by client name' />
                </bookingsJS.DivCtnSearch>

                <bookingsJS.DivCtnButton>
                    <ButtonCreate onClick={navigateToBookingCreate} children='+ New Booking' />
                </bookingsJS.DivCtnButton>
            </bookingsJS.DivCtnFuncionality>

            {showPopup && <PopupText title={infoViewNotes.title} text={infoViewNotes.text} onClose={() => setShowPopup(false)} />}

            <Table rowlistlength={`${filteredBookings.length + 1}`} columnlistlength={`${nameColumnList.length}`} >
                {nameColumnList.map((nameColumn, index) =>
                    index === 1 || index === 3 || index === 4 || index === 5 || index === 7 ?
                        <THTable key={index} cursorPointer='yes' onClick={() => {
                            switch (index) {
                                case 1: handleColumnClick('guest'); break
                                case 3: handleColumnClick('orderDate'); break
                                case 4: handleColumnClick('checkIn'); break
                                case 5: handleColumnClick('checkOut'); break
                                case 7: handleColumnClick('roomNumber'); break
                                default: ; break
                            }
                        }}
                        >
                            {nameColumn}
                            {(() => {
                                switch (index) {
                                    case 1: return getArrowIcon('guest')
                                    case 3: return getArrowIcon('orderDate')
                                    case 4: return getArrowIcon('checkIn')
                                    case 5: return getArrowIcon('checkOut')
                                    case 7: return getArrowIcon('roomNumber')
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

        </bookingsJS.SectionPageBookings>

    )
}