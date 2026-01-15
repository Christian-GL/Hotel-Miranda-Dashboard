
import { createAsyncThunk } from "@reduxjs/toolkit"
import { BookingInterface } from '../../interfaces/bookingInterface'


export const BookingFetchAllThunk = createAsyncThunk<
    BookingInterface[],
    void,
    { rejectValue: string }
>(
    "booking/fetchAll",
    async (_, { rejectWithValue }) => {

        const apiToken = localStorage.getItem('token')
        if (!apiToken) {
            return rejectWithValue('No authentication token found')
        }

        try {
            const request = await fetch(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_ENDPOINT_BOOKINGS}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiToken}`
                }
            })
            if (request.ok) {
                const json = await request.json()
                let allBookings: BookingInterface[] = []
                for (let i = 0; i < json.length; i++) {
                    allBookings.push({
                        _id: json[i]._id,
                        order_date: json[i].order_date,
                        check_in_date: json[i].check_in_date,
                        check_out_date: json[i].check_out_date,
                        price: json[i].price,
                        special_request: json[i].special_request,
                        isArchived: json[i].isArchived,
                        room_id_list: json[i].room_id_list,
                        client_id: json[i].client_id
                    })
                }
                return allBookings
            }
            else {
                const errorData = await request.json().catch(() => null)
                return rejectWithValue(
                    errorData?.message ?? request.statusText ?? 'Error fetching bookings'
                )
            }
        }
        catch (error) {
            return rejectWithValue('Network or server error')
        }

    })