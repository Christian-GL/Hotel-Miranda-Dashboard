
import { useState } from "react"

import * as bookingsJS from "./bookings.js"
import { Table } from "../../common/components/table/table.jsx"
import bookingData from "../../common/data/bookingData.json"


export const Bookings = () => {

    const nameColumnList = ['', 'Guest', 'Order Date', 'Check In', 'Check Out', 'Special Request', 'Room Type', 'Status']
    const [bookingList, setBookingList] = useState(bookingData)

    return (

        <bookingsJS.SectionPageBookings>
            <Table tableType='booking' rowList={bookingList} columnList={nameColumnList}></Table>
        </bookingsJS.SectionPageBookings>

    )
}