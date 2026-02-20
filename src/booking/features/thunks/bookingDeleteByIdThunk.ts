
import { createAsyncThunk } from "@reduxjs/toolkit"
import { BookingDeleteResponseInterface } from '../../interfaces/api/responses/bookingDeleteResponseInterface'
import { ApiErrorResponseInterface } from "common/interfaces/apiResponses/apiErrorResponseInterface"


export const BookingDeleteByIdThunk = createAsyncThunk<
    BookingDeleteResponseInterface,
    string,
    { rejectValue: ApiErrorResponseInterface }
>(
    "booking/deleteById",
    async (bookingId, { rejectWithValue }) => {

        const apiToken = localStorage.getItem('token')
        if (!apiToken) {
            return rejectWithValue({
                status: 401,
                message: 'No authentication token found',
            })
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