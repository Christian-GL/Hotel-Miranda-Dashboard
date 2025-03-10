
import { createAsyncThunk } from "@reduxjs/toolkit"
import { BookingInterfaceNoId } from '../../interfaces/bookingInterface.ts'


const bookingDefaultIfError: BookingInterfaceNoId = {
    photo: '',
    full_name_guest: '',
    order_date: '',
    check_in_date: '',
    check_out_date: '',
    special_request: '',
    room_id: 0
}

export const BookingCreateThunk = createAsyncThunk
    ("booking/create", async (newBookingData: BookingInterfaceNoId) => {

        const apiToken = localStorage.getItem('token')
        if (!apiToken) return bookingDefaultIfError

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