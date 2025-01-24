
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"

import * as bookingsJS from "./booking.js"
import * as gb from '../common/styles/globalVars.js'
import { TableDisplayIndicator } from "../common/components/tableDisplaySelector/tableDisplaySelector.jsx"
import { TableSearchTerm } from "../common/components/tableSearchTerm/tableSearchTerm.jsx";
import { ButtonCreate } from "../common/components/buttonCreate/buttonCreate.jsx"
import { formatToTerm } from "../common/utils/tableUtils.jsx";
import { Table, THTable, DivImgTable, ImgTableUser, PTable, IconOptions, ButtonViewNotes, PStatusBooking, DivCtnOptions, ButtonOption } from "../common/styles/table.js"
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
    const navigateToBookingDetail = () => {
        navigate('booking-detail')
    }

    const nameColumnList = ['', 'Guest', 'Order date', 'Check in', 'Check out', 'Special request', 'Room type', 'Status', '']
    const [bookingDisplayed, setBookingDisplayed] = useState([])
    const bookingAll = useSelector(getBookingAllData)
    const bookingAllLoading = useSelector(getBookingAllStatus)
    const [inputText, setInputText] = useState('')
    const [tableOptionsDisplayed, setTableOptionsDisplayed] = useState();

    const dispatch = useDispatch()
    useEffect(() => {
        if (bookingAllLoading === "idle") { dispatch(BookingFetchAllThunk()) }
        else if (bookingAllLoading === "fulfilled") {
            if (inputText === '') {
                setBookingDisplayed(bookingAll)
            }
            else {
                const filteredClients = bookingAll.filter(client =>
                    client.full_name_guest.toLowerCase().includes(inputText.toLowerCase())
                )
                setBookingDisplayed(filteredClients)
            }
        }
        else if (bookingAllLoading === "rejected") { alert("Error en la api") }
    }, [bookingAllLoading, bookingAll, inputText])

    const handleInputTerm = (e) => {
        setInputText(e.target.value)
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
                    <ButtonCreate onclick={navigateToBookingCreate} text='+ New Booking' />
                </bookingsJS.DivCtnButton>
            </bookingsJS.DivCtnFuncionality>

            <Table rowlistlength={`${bookingDisplayed.length + 1}`} columnlistlength={`${nameColumnList.length}`} >
                {nameColumnList.map((nameColumn, index) =>
                    <THTable key={index}>{nameColumn}</THTable>
                )}
                {bookingDisplayed.map((bookingData, index) => {
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

                        <PTable key={index + '-3'} flexdirection='column' alignitems='left' justifycontent='center' >
                            <div>{bookingData.order_date}</div>
                            <div>{bookingData.order_time}</div>
                        </PTable>,

                        <PTable key={index + '-4'} flexdirection='column' alignitems='left' justifycontent='center'>
                            <div>{bookingData.check_in_date}</div>
                            <div>{bookingData.check_in_time}</div>
                        </PTable>,

                        <PTable key={index + '-5'} flexdirection='column' alignitems='left' justifycontent='center'>
                            <div>{bookingData.check_out_date}</div>
                            <div>{bookingData.check_out_time}</div>
                        </PTable>,

                        <PTable key={index + '-6'}>
                            <ButtonViewNotes onClick={() => navigateToBookingDetail()}>View Notes</ButtonViewNotes>
                        </PTable>,

                        <PTable key={index + '-7'}>
                            {formatToTerm(bookingData.room_type)} - {bookingData.room_number}
                        </PTable>,

                        <PTable key={index + '-8'}>
                            {
                                (() => {
                                    switch (bookingData.status) {
                                        case 'check_in':
                                            return <PStatusBooking color={`${gb.colorGreen}`} backgroundcolor={`${gb.colorLightGreenButtonTable}`}>
                                                Check In
                                            </PStatusBooking>;
                                        case 'check_out':
                                            return <PStatusBooking color={`${gb.colorRed}`} backgroundcolor={`${gb.colorLightRedButtonTable}`}>
                                                Check Out
                                            </PStatusBooking>;
                                        case 'in_progress':
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
        </bookingsJS.SectionPageBookings>

    )
}