
import { createAsyncThunk } from "@reduxjs/toolkit"
import { RoomInterfaceBookings } from "../../interfaces/roomInterface.ts"
import { RoomType } from "../../enums/roomType.ts"


const roomDefaultIfError: RoomInterfaceBookings = {
    _id: "0",
    photos: [],
    number: '0',
    type: RoomType.singleBed,
    amenities: [],
    price: 0,
    discount: 0,
    booking_data_list: []
}

export const RoomFetchByIDThunk = createAsyncThunk
    ("room/fetchById", async (roomId: string) => {

        const apiToken = localStorage.getItem('token')
        if (!apiToken) return roomDefaultIfError

        try {
            const request = await fetch(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_ENDPOINT_ROOMS}/${roomId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiToken}`
                }
            })
            if (request.ok) {
                const json = await request.json()
                let room: RoomInterfaceBookings = {
                    _id: json._id,
                    photos: json.photo,
                    number: json.number,
                    type: json.type,
                    amenities: json.amenities,
                    price: json.price,
                    discount: json.discount,
                    booking_data_list: json.booking_data_list
                }
                return room
            }
            else {
                console.error('Error: ', request.statusText)
                return roomDefaultIfError
            }
        }
        catch (error) {
            console.error(error)
            return roomDefaultIfError
        }

    })