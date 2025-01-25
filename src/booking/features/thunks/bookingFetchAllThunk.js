
import { createAsyncThunk } from "@reduxjs/toolkit"

import bookingJSON from '../../data/bookingData.json'


export const BookingFetchAllThunk = createAsyncThunk("booking/fetchAll", async () => {

    try {
        const request = await new Promise((resolve) => {
            setTimeout(() => resolve({
                ok: true,
                json: () => bookingJSON
            }), 200)
        })

        if (request.ok) {
            const allBookings = await request.json()
            return allBookings
        }
        else return []
    }
    catch (error) {
        console.log(error)
        throw error
    }

})