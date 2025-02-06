
import { createAsyncThunk } from "@reduxjs/toolkit"
import { BookingInterface } from '../../interfaces/bookingInterface.ts'


type RequestResponse = {
    ok: boolean
    json: () => BookingInterface
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

export const BookingCreateThunk = createAsyncThunk
    ("booking/create", async (newBookingData: BookingInterface) => {

        try {
            const request: RequestResponse = await new Promise((resolve) => {
                if (newBookingData) {
                    setTimeout(() => resolve({
                        ok: true,
                        json: () => newBookingData
                    }), 200)
                }
                else {
                    setTimeout(() => resolve({
                        ok: false,
                        json: () => bookingDefaultIfError
                    }), 200)
                }

            })

            if (request.ok) {
                const bookingDataCreated = await request.json()
                return bookingDataCreated
            }
            else return bookingDefaultIfError
        }
        catch (error) {
            console.log(error)
            return bookingDefaultIfError
        }

    })