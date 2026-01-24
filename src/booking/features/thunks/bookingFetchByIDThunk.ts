
import { createAsyncThunk } from "@reduxjs/toolkit"
import { BookingInterfaceId } from '../../interfaces/bookingInterface'


export const BookingFetchByIDThunk = createAsyncThunk<
    BookingInterfaceId,
    string,
    { rejectValue: string }
>(
    "booking/fetchById",
    async (bookingId, { rejectWithValue }) => {

        const apiToken = localStorage.getItem('token')
        if (!apiToken) {
            return rejectWithValue('No authentication token found')
        }

        try {
            const request = await fetch(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_ENDPOINT_BOOKINGS}/${bookingId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiToken}`
                }
            })
            if (request.ok) {
                const json = await request.json()
                let booking: BookingInterfaceId = {
                    _id: json._id,
                    order_date: json.order_date,
                    check_in_date: json.check_in_date,
                    check_out_date: json.check_out_date,
                    price: json.price,
                    special_request: json.special_request,
                    isArchived: json.isArchived,
                    room_id_list: json.room_id_list,
                    client_id: json.client_id
                }
                return booking
            }
            else {
                const errorData = await request.json().catch(() => null)
                return rejectWithValue(
                    errorData?.message ?? request.statusText ?? 'Error fetching booking'
                )
            }
        }
        catch (error) {
            return rejectWithValue('Network or server error')
        }

    })