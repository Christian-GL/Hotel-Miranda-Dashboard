
import { createAsyncThunk } from "@reduxjs/toolkit"
import { BookingInterfaceId } from "../../interfaces/bookingInterface"
import { BookingUpdateRequestInterface } from "../../interfaces/api/requests/bookingUpdateRequestInterface"
import { ApiErrorResponseInterface } from "common/interfaces/apiResponses/apiErrorResponseInterface"


export const BookingUpdateThunk = createAsyncThunk<
    BookingInterfaceId,
    BookingUpdateRequestInterface,
    { rejectValue: ApiErrorResponseInterface }
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
                return await request.json()
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
            return rejectWithValue({
                status: 500,
                message: 'Network or server error'
            })
        }

    })