
import { createAsyncThunk } from "@reduxjs/toolkit"
import { BookingInterface } from "../../interfaces/bookingInterface"
import { OptionYesNo } from "common/enums/optionYesNo"


const bookingDefaultIfError: BookingInterface = {
    _id: '0',
    order_date: new Date(),
    check_in_date: new Date(),
    check_out_date: new Date(),
    price: 0,
    special_request: '',
    isArchived: OptionYesNo.yes,
    room_id_list: [],
    client_id: ''
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