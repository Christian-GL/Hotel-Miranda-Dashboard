
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

export const BookingFetchAllThunk = createAsyncThunk
    ("booking/fetchAll", async () => {

        const apiToken = localStorage.getItem('token')
        if (!apiToken) return [bookingDefaultIfError]

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
                        photo: json[i].photo,
                        full_name_guest: json[i].full_name_guest,
                        order_date: json[i].order_date,
                        check_in_date: json[i].check_in_date,
                        check_out_date: json[i].check_out_date,
                        status: json[i].status,
                        special_request: json[i].special_request,
                        room_list: json[i].room_list
                    })
                }
                return allBookings
            }
            else {
                console.error('Error: ', request.statusText)
                return [bookingDefaultIfError]
            }
        }
        catch (error) {
            console.error(error)
            return [bookingDefaultIfError]
        }

    })