
import { useState } from "react"
import { useNavigate } from "react-router-dom";

import * as bookingsJS from "./bookings.js"
import { TableDisplayIndicator } from "../../common/components/table/tableDisplaySelector/tableDisplaySelector.jsx"
import { TableSearchTerm } from "../../common/components/table/tableSearchTerm/tableSearchTerm.jsx";
import { ButtonCreate } from "../../common/components/buttonCreate/buttonCreate.jsx"
import { Table } from "../../common/components/table/createTable/createTable.jsx"
import bookingData from "../../common/data/bookingData.json"


export const Bookings = () => {

    const nameColumnList = ['', 'Guest', 'Order Date', 'Check In', 'Check Out', 'Special Request', 'Room Type', 'Status', '']
    const [bookingList, setBookingList] = useState(bookingData)

    const navigate = useNavigate()
    const navigateToBookingCreate = () => {
        navigate('./booking-create')
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
                    <TableSearchTerm placeholder='Search Booking' />
                </bookingsJS.DivCtnSearch>

                <bookingsJS.DivCtnButton>
                    <ButtonCreate onclick={navigateToBookingCreate} text='+ New Booking' />
                </bookingsJS.DivCtnButton>
            </bookingsJS.DivCtnFuncionality>

            <Table tableType='booking' rowList={bookingList} columnList={nameColumnList}></Table>
        </bookingsJS.SectionPageBookings>

    )
}