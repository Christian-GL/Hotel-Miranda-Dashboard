
import { createAsyncThunk } from "@reduxjs/toolkit"
import { BookingInterfaceNoId } from "../../interfaces/bookingInterface"
import { BookingUpdateResponseInterface } from '../../../common/interfaces/apiResponses/bookingUpdateResponseInterface'


export const BookingUpdateThunk = createAsyncThunk<
    BookingUpdateResponseInterface,
    { idBooking: string; updatedBookingData: BookingInterfaceNoId },
    { rejectValue: string }
>(
    "booking/update",
    async ({ idBooking, updatedBookingData }, { rejectWithValue }) => {

        const apiToken = localStorage.getItem('token')
        if (!apiToken) {
            return rejectWithValue('No authentication token found')
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
                return rejectWithValue(
                    errorData?.message ?? request.statusText ?? 'Error updating booking'
                )
            }
        }
        catch (error) {
            return rejectWithValue('Network or server error')
        }

    })