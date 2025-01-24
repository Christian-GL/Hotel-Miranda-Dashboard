
import { createAsyncThunk } from "@reduxjs/toolkit"

import bookingJSON from '../../data/bookingData.json'


export const BookingFetchByIDThunk = createAsyncThunk("booking/fetchById", async (bookingId) => {

    try {
        const request = await new Promise((resolve) => {
            const booking = bookingJSON.find((booking) => booking.id === bookingId);
            if (booking) {
                setTimeout(() => resolve({
                    ok: true,
                    json: () => booking
                }), 200)
            }
            else {
                setTimeout(() => resolve({
                    ok: false,
                    json: () => {}
                }), 200)
            }

        })

        if (request.ok) {
            const bookingFinded = await request.json()
            return bookingFinded
        }
        else return {}
    }
    catch (error) {
        console.log(error)
        throw error
    }

})