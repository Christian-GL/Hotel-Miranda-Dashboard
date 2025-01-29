
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"

import * as bookingsJS from "./booking.js"
import * as gb from '../common/styles/globalVars.js'
import { PopupText } from "../common/components/popupText/popupText.jsx";
import { TableDisplayIndicator } from "../common/components/tableDisplaySelector/tableDisplaySelector.jsx"
import { TableSearchTerm } from "../common/components/tableSearchTerm/tableSearchTerm.jsx";
import { ButtonCreate } from "../common/components/buttonCreate/buttonCreate.jsx"
import { Table, THTable, DivImgTable, ImgTableUser, PTable, IconOptions, ButtonView, PStatusBooking, DivCtnOptions, ButtonOption } from "../common/styles/table.js"
import { usePagination } from "../common/hooks/usePagination.js"
import * as paginationJS from '../common/styles/pagination.js'
import { getBookingAllData, getBookingAllStatus, getBookingError } from "./features/bookingSlice.js";
import { BookingFetchAllThunk } from "./features/thunks/bookingFetchAllThunk.js";
import { BookingDeleteByIdThunk } from "./features/thunks/bookingDeleteByIdThunk.js";


export const Bookings = () => {

    const navigate = useNavigate()
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

    const nameColumnList = ['', 'Guest', 'Details', 'Order date', 'Check in', 'Check out', 'Special request', 'Room info', 'Booking status', '']
    const bookingAll = useSelector(getBookingAllData)
    const bookingAllLoading = useSelector(getBookingAllStatus)
    const [inputText, setInputText] = useState('')
    const [tableOptionsDisplayed, setTableOptionsDisplayed] = useState()
    const filteredBookings = bookingAll.filter(bookings =>
        bookings.full_name_guest.toLowerCase().includes(inputText.toLowerCase())
    )
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

    const dispatch = useDispatch()
    useEffect(() => {
        if (bookingAllLoading === "idle") { dispatch(BookingFetchAllThunk()) }
        else if (bookingAllLoading === "fulfilled") { }
        else if (bookingAllLoading === "rejected") { alert("Error en la api") }
    }, [bookingAllLoading, bookingAll])

    const handleInputTerm = (e) => {
        setInputText(e.target.value)
        resetPage()
    }
    const deleteBookingById = (id, index) => {
        dispatch(BookingDeleteByIdThunk(parseInt(id)))
        displayMenuOptions(index)
    }
    const displayMenuOptions = (index) => {
        tableOptionsDisplayed === index ?
            setTableOptionsDisplayed() :
            setTableOptionsDisplayed(index)
    }


    return (

        <bookingsJS.SectionPageBookings>
            <bookingsJS.DivCtnFuncionality>
                <bookingsJS.DivCtnTableDisplayFilter>
                    <TableDisplayIndicator text='All Bookings' />
                    <TableDisplayIndicator text='Check In' />
                    <TableDisplayIndicator text='Check Out' />
                    <TableDisplayIndicator text='In Progress' />
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
                                            </PStatusBooking>;
                                        case 'Check Out':
                                            return <PStatusBooking color={`${gb.colorRed}`} backgroundcolor={`${gb.colorLightRedButtonTable}`}>
                                                Check Out
                                            </PStatusBooking>;
                                        case 'In Progress':
                                            return <PStatusBooking color={`${gb.colorLightRedButtonTable2}`} backgroundcolor={`${gb.colorLightGreenButtonTable2}`}>
                                                In Progress
                                            </PStatusBooking>;
                                        default:
                                            return <></>;
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