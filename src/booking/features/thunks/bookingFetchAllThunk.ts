
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
                let allBookings: BookingInterfaceRoom[] = []
                for (let i = 0; i < json.length; i++) {
                    allBookings.push({
                        _id: json[i]._id,
                        photo: json[i].photo,
                        full_name_guest: json[i].full_name_guest,
                        order_date: json[i].order_date,
                        check_in_date: json[i].check_in_date,
                        check_out_date: json[i].check_out_date,
                        special_request: json[i].special_request,
                        room_data: json[i].room_data
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