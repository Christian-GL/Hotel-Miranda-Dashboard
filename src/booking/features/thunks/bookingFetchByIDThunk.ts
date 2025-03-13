
import { createAsyncThunk } from "@reduxjs/toolkit"
import { BookingInterfaceRoom } from '../../interfaces/bookingInterface.ts'
import { RoomType } from "../../../room/enums/roomType.ts"


const bookingDefaultIfError: BookingInterfaceRoom = {
    _id: 0,
    photo: '',
    full_name_guest: '',
    order_date: '',
    check_in_date: '',
    check_out_date: '',
    special_request: '',
    room_data: {
        _id: 0,
        photos: [],
        number: '0',
        type: RoomType.singleBed,
        amenities: [],
        price: 0,
        discount: 0,
        booking_id_list: []
    }
}

export const BookingFetchByIDThunk = createAsyncThunk
    ("booking/fetchById", async (bookingId: number) => {

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
                let booking: BookingInterfaceRoom = {
                    _id: json._id,
                    photo: json.photo,
                    full_name_guest: json.full_name_guest,
                    order_date: json.order_date,
                    check_in_date: json.check_in_date,
                    check_out_date: json.check_out_date,
                    special_request: json.special_request,
                    room_data: json.room_data
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