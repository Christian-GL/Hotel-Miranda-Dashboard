
import { createAsyncThunk } from "@reduxjs/toolkit"
import { BookingInterface } from "../../interfaces/bookingInterface"
import { BookingUpdateResponseInterface } from '../../../common/interfaces/apiResponses/bookingUpdateResponseInterface'


export const BookingUpdateThunk = createAsyncThunk<
    BookingUpdateResponseInterface,
    { idBooking: string; updatedBookingData: BookingInterface },
    { rejectValue: { status: number; message: string } }
>(
    "booking/update",
    async ({ idBooking, updatedBookingData }, { rejectWithValue }) => {

        const apiToken = localStorage.getItem('token')
        if (!apiToken) {
            return rejectWithValue({
                status: 401,
                message: 'No authentication token found',
            })
        }

        try {
            const request = await fetch(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_ENDPOINT_BOOKINGS}/${idBooking}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiToken}`
                },
                body: JSON.stringify(updatedBookingData)
            })

            if (request.ok) {
                return await request.json() as BookingUpdateResponseInterface
            }
            else {
                const errorData = await request.json().catch(() => null)
                return rejectWithValue({
                    status: request.status,
                    message: errorData?.message ?? 'Error fetching booking',
                })
            }
        }
        catch (error) {
            return rejectWithValue({ status: 500, message: 'Network or server error' })
        }

    })