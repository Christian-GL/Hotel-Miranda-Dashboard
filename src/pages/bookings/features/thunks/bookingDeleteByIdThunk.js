
import { createAsyncThunk } from "@reduxjs/toolkit"


export const BookingDeleteByIdThunk = createAsyncThunk("booking/deleteById", async (bookingIdToDelete) => {

    try {
        const request = await new Promise((resolve) => {
            if (bookingIdToDelete) {
                setTimeout(() => resolve({
                    ok: true,
                    json: () => bookingIdToDelete
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
            const bookingDataDeleted = await request.json()
            return bookingDataDeleted
        }
        else return {}
    }
    catch (error) {
        console.log(error)
        throw error
    }

})