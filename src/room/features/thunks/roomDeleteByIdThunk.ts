
import { createAsyncThunk } from "@reduxjs/toolkit"
import { BookingInterface } from "booking/interfaces/bookingInterface"


export const RoomDeleteByIdThunk = createAsyncThunk("room/deleteById", async (roomId: string, { rejectWithValue }) => {

    const apiToken = localStorage.getItem('token')
    if (!apiToken) return rejectWithValue("Missing token")

    try {
        const request = await fetch(
            `${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_ENDPOINT_ROOMS}/${roomId}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiToken}`
                }
            }
        )

        if (!request.ok) {
            throw new Error(request.statusText)
        }
        const responseData = await request.json()
        return responseData as {
            deleted: boolean
            roomId: string
            updatedBookings: BookingInterface[]
        }
    }
    catch (error: any) {
        console.error(error)
        return rejectWithValue(error.message)
    }
}
)
