
import { createAsyncThunk } from "@reduxjs/toolkit"
import { BookingInterface } from '../../interfaces/bookingInterface.ts'
import { BookingStatus } from "../../data/bookingStatus.ts"


const bookingDefaultIfError: BookingInterface = {
    _id: '0',
    photo: '',
    full_name_guest: '',
    order_date: '',
    check_in_date: '',
    check_out_date: '',
    status: BookingStatus.checkOut,
    special_request: '',
    room_list: []
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
                    photo: json.photo,
                    full_name_guest: json.full_name_guest,
                    order_date: json.order_date,
                    check_in_date: json.check_in_date,
                    check_out_date: json.check_out_date,
                    status: json.status,
                    special_request: json.special_request,
                    room_list: json.room_list
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