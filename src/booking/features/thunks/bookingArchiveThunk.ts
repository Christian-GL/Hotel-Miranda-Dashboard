
import { createAsyncThunk } from "@reduxjs/toolkit"
import { BookingArchiveRequestInterface } from "../../interfaces/api/requests/bookingArchiveRequestInterface"
import { BookingArchiveResponseInterface } from "../..//interfaces/api/responses/bookingArchiveResponseInterface"
import { ApiErrorResponseInterface } from "common/interfaces/apiResponses/apiErrorResponseInterface"


export const BookingArchiveThunk = createAsyncThunk<
    BookingArchiveResponseInterface,
    BookingArchiveRequestInterface,
    { rejectValue: ApiErrorResponseInterface }
>(
    "booking/archive",
    async ({ idBooking, isArchived }, { rejectWithValue }) => {

        const apiToken = localStorage.getItem('token')
        if (!apiToken) {
            return rejectWithValue({
                status: 401,
                message: 'No authentication token found',
            })
        }

        try {
            const request = await fetch(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_ENDPOINT_BOOKINGS}/archive/${idBooking}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiToken}`
                },
                body: JSON.stringify({ isArchived })
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