
import { createAsyncThunk } from "@reduxjs/toolkit"


type RequestResponse = {
    ok: boolean
    json: () => number
}

export const BookingDeleteByIdThunk = createAsyncThunk
    ("booking/deleteById", async (bookingIdToDelete: number) => {

        try {
            const request: RequestResponse = await new Promise((resolve) => {
                if (bookingIdToDelete) {
                    setTimeout(() => resolve({
                        ok: true,
                        json: () => bookingIdToDelete
                    }), 200)
                }
                else {
                    setTimeout(() => resolve({
                        ok: false,
                        json: () => 0
                    }), 200)
                }

            })

            if (request.ok) {
                const bookingDataDeleted = await request.json()
                return bookingDataDeleted
            }
            else return 0
        }
        catch (error) {
            console.log(error)
            return 0
        }

    })