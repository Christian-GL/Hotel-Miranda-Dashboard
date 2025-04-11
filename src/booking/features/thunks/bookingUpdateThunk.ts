
import { createAsyncThunk } from "@reduxjs/toolkit"
import { BookingInterface } from "../../interfaces/bookingInterface"


const bookingDefaultIfError: BookingInterface = {
    _id: "0",
    photo: '',
    full_name_guest: '',
    order_date: '',
    check_in_date: '',
    check_out_date: '',
    special_request: '',
    room_id: "0"
}

export const BookingUpdateThunk = createAsyncThunk
    ("booking/update", async ({ idBooking, updatedBookingData }
        : { idBooking: string, updatedBookingData: BookingInterface }) => {

        const apiToken = localStorage.getItem('token')
        if (!apiToken) return bookingDefaultIfError

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
                const bookingUpdated = await request.json()
                return bookingUpdated
            } else {
                console.error("Error: ", request.statusText)
                return bookingDefaultIfError
            }
        }
        catch (error) {
            console.error(error)
            return bookingDefaultIfError
        }

    })