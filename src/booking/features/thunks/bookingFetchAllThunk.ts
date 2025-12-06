
import { createAsyncThunk } from "@reduxjs/toolkit"
import { BookingInterface } from '../../interfaces/bookingInterface'
import { OptionYesNo } from "common/enums/optionYesNo"


// !!! VERSIÓN ANTERIOR
// const bookingDefaultIfError: BookingInterfaceRoom = {
//     _id: "0",
//     photo: '',
//     full_name_guest: '',
//     order_date: '',
//     check_in_date: '',
//     check_out_date: '',
//     special_request: '',
//     room_data: {
//         _id: "0",
//         photos: [],
//         number: '0',
//         type: RoomType.singleBed,
//         amenities: [],
//         price: 0,
//         discount: 0,
//         booking_id_list: []
//     }
// }
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
                console.error('Error: ', request.statusText)
                return [bookingDefaultIfError]
            }
        }
        catch (error) {
            console.error(error)
            return [bookingDefaultIfError]
        }

    })