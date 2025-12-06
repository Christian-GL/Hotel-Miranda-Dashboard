
import { createAsyncThunk } from "@reduxjs/toolkit"
import { BookingInterface } from '../../interfaces/bookingInterface'
import { OptionYesNo } from "common/enums/optionYesNo"


const bookingDefaultIfError: BookingInterface = {
    _id: '',
    order_date: new Date(),
    check_in_date: new Date(),
    check_out_date: new Date(),
    price: 0,
    special_request: '',
    isArchived: OptionYesNo.yes,
    room_id_list: [],
    client_id: ''
}

export const BookingFetchByIDThunk = createAsyncThunk
    ("booking/fetchById", async (bookingId: string) => {

        const apiToken = localStorage.getItem('token')
        if (!apiToken) return bookingDefaultIfError

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
                let booking: BookingInterface = {
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
                console.error('Error: ', request.statusText)
                return bookingDefaultIfError
            }
        }
        catch (error) {
            console.error(error)
            return bookingDefaultIfError
        }

    })