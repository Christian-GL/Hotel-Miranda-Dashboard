
import { createAsyncThunk } from "@reduxjs/toolkit"

import bookingJSON from '../../data/bookingData.json'
import { BookingInterface } from '../../interfaces/bookingInterface.ts'


type RequestResponse = {
    ok: boolean
    json: () => BookingInterface[]
}

const bookingDefaultIfError: BookingInterface = {
    id: 0,
    photo: '',
    full_name_guest: '',
    order_date: '',
    order_time: '',
    check_in_date: '',
    check_in_time: '',
    check_out_date: '',
    check_out_time: '',
    special_request: '',
    room_id: 0,
    room_type: '',
    room_booking_status: '',
}

export const BookingFetchAllThunk = createAsyncThunk
    ("booking/fetchAll", async () => {

        try {
            const request: RequestResponse = await new Promise((resolve) => {
                setTimeout(() => resolve({
                    ok: true,
                    json: () => bookingJSON
                }), 1500)
            })

            if (request.ok) {
                const allBookings = await request.json()
                return allBookings
            }
            else return [bookingDefaultIfError]
        }
        catch (error) {
            console.log(error)
            return [bookingDefaultIfError]
        }

    })