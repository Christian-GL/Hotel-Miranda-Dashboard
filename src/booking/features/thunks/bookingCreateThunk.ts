
import { createAsyncThunk } from "@reduxjs/toolkit"
import { BookingInterfaceWithOutID } from '../../interfaces/bookingInterface.ts'
import { BookingStatus } from "../../data/bookingStatus.ts"


const bookingDefaultIfError: BookingInterfaceWithOutID = {
    photo: '',
    full_name_guest: '',
    order_date: '',
    check_in_date: '',
    check_out_date: '',
    status: BookingStatus.checkOut,
    special_request: '',
    room_list: []
}

export const BookingCreateThunk = createAsyncThunk
    ("booking/create", async (newBookingData: BookingInterfaceWithOutID) => {

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