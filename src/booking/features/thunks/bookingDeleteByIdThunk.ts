
import { createAsyncThunk } from "@reduxjs/toolkit"
import { BookingDeleteResponseInterface } from '../../../common/interfaces/apiResponses/bookingDeleteResponseInterface'


export const BookingDeleteByIdThunk = createAsyncThunk<
    BookingDeleteResponseInterface,
    string,
    { rejectValue: string }
>(
    "booking/deleteById",
    async (bookingId, { rejectWithValue }) => {

        const apiToken = localStorage.getItem('token')
        if (!apiToken) {
            return rejectWithValue('No authentication token found')
        }

        try {
            const request = await fetch(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_ENDPOINT_BOOKINGS}/${bookingId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiToken}`
                },
            })
            if (request.ok) {
                return await request.json() as BookingDeleteResponseInterface
            }
            else {
                const errorData = await request.json().catch(() => null)
                return rejectWithValue(
                    errorData?.message ?? request.statusText ?? 'Error deleting booking'
                )
            }
        }
        catch (error) {
            return rejectWithValue('Network or server error')
        }

    })