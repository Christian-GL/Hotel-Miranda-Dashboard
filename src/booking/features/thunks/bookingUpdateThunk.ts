
import { createAsyncThunk } from "@reduxjs/toolkit"
import { BookingInterface } from "../../interfaces/bookingInterface"


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

export const BookingUpdateThunk = createAsyncThunk
    ("booking/update", async (bookingData: BookingInterface) => {

        try {
            const request: RequestResponse = await new Promise((resolve) => {
                if (bookingData) {
                    setTimeout(() => resolve({
                        ok: true,
                        json: () => bookingData
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
                const bookingDataUpdated = await request.json()
                return bookingDataUpdated
            }
            else return bookingDefaultIfError
        }
        catch (error) {
            console.log(error)
            return bookingDefaultIfError
        }

    })