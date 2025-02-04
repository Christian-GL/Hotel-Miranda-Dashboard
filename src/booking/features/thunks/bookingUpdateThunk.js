
import { createAsyncThunk } from "@reduxjs/toolkit"


export const BookingUpdateThunk = createAsyncThunk("booking/update", async (bookingData) => {

    try {
        const request = await new Promise((resolve) => {
            if (bookingData) {
                setTimeout(() => resolve({
                    ok: true,
                    json: () => bookingData
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
            const bookingDataUpdated = await request.json()
            return bookingDataUpdated
        }
        else return {}
    }
    catch (error) {
        console.log(error)
        throw error
    }

})