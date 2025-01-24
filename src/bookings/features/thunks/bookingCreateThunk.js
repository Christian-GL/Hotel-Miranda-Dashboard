
import { createAsyncThunk } from "@reduxjs/toolkit"


export const BookingCreateThunk = createAsyncThunk("booking/create", async (newBookingData) => {

    try {
        const request = await new Promise((resolve) => {
            if (newBookingData) {
                setTimeout(() => resolve({
                    ok: true,
                    json: () => newBookingData
                }), 200)
            }
            else {
                setTimeout(() => resolve({
                    ok: false,
                    json: () => { }
                }), 200)
            }

        })

        if (request.ok) {
            const bookingDataCreated = await request.json()
            return bookingDataCreated
        }
        else return {}
    }
    catch (error) {
        console.log(error)
        throw error
    }

})