
import { createAsyncThunk } from "@reduxjs/toolkit"
import { BookingInterface } from '../../interfaces/bookingInterface'
import { BookingCreateResponseInterface } from '../../../common/interfaces/apiResponses/bookingCreateResponseInterface'


export const BookingCreateThunk = createAsyncThunk<
    BookingCreateResponseInterface,
    BookingInterface,
    { rejectValue: string }
>(
    "booking/create",
    async (newBookingData, { rejectWithValue }) => {

        const apiToken = localStorage.getItem('token')
        if (!apiToken) {
            return rejectWithValue('No authentication token found')
        }

        try {
            const request = await fetch(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_ENDPOINT_BOOKINGS}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiToken}`
                },
                body: JSON.stringify(newBookingData)
            })
            if (request.ok) {
                const bookingCreated = await request.json()
                return bookingCreated
            }
            else {
                const errorData = await request.json().catch(() => null)
                return rejectWithValue(
                    errorData?.message ?? request.statusText ?? 'Error creating booking'
                )
            }
        }
        catch (error) {
            return rejectWithValue('Network or server error')
        }

    })