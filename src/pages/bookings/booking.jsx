
import { useState } from "react"

import * as bookingsJS from "./bookings.js"
import { TableDisplayIndicator } from "../../common/components/tableDisplayIndicador/tableDisplayIndicator.jsx"
import { Table } from "../../common/components/table/table.jsx"
import bookingData from "../../common/data/bookingData.json"


export const Bookings = () => {

    const nameColumnList = ['', 'Guest', 'Order Date', 'Check In', 'Check Out', 'Special Request', 'Room Type', 'Status']
    const [bookingList, setBookingList] = useState(bookingData)

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
                    <bookingsJS.IconMagnifyingGlass />
                    <bookingsJS.InputSearchEmployee placeholder="Search Booking" />
                </bookingsJS.DivCtnSearch>
            </bookingsJS.DivCtnFuncionality>

            <Table tableType='booking' rowList={bookingList} columnList={nameColumnList}></Table>
        </bookingsJS.SectionPageBookings>

    )
}