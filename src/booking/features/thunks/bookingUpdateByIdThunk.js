
import { createAsyncThunk } from "@reduxjs/toolkit"


export const BookingUpdateByIdThunk = createAsyncThunk("booking/updateById", async (bookingIdToUpdate) => {

    try {
        const request = await new Promise((resolve) => {
            if (bookingIdToUpdate) {
                setTimeout(() => resolve({
                    ok: true,
                    json: () => bookingIdToUpdate
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