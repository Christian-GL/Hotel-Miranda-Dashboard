
import { createAsyncThunk } from "@reduxjs/toolkit"
import { RoomInterface } from "../../interfaces/roomInterface"
import { RoomType } from "../../enums/roomType"


const roomDefaultIfError: RoomInterface = {
    _id: "0",
    photos: [],
    number: '0',
    type: RoomType.singleBed,
    amenities: [],
    price: 0,
    discount: 0,
    booking_id_list: []
}

export const RoomUpdateThunk = createAsyncThunk
    ("room/update", async ({ idRoom, updatedRoomData }
        : { idRoom: string, updatedRoomData: RoomInterface }) => {

        const apiToken = localStorage.getItem('token')
        if (!apiToken) return roomDefaultIfError

        try {
            const request = await fetch(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_ENDPOINT_ROOMS}/${idRoom}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiToken}`
                },
                body: JSON.stringify(updatedRoomData)
            })

            if (request.ok) {
                const roomUpdated = await request.json()
                return roomUpdated
            } else {
                console.error("Error: ", request.statusText)
                return roomDefaultIfError
            }
        }
        catch (error) {
            console.error(error)
            return roomDefaultIfError
        }

    })