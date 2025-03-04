
import { createAsyncThunk } from "@reduxjs/toolkit"
import { RoomInterfaceNoId } from '../../interfaces/roomInterface.ts'
import { RoomType } from '../../data/roomType.ts'


const roomDefaultIfError: RoomInterfaceNoId = {
    photos: [],
    number: '0',
    type: RoomType.singleBed,
    amenities: [],
    price: 0,
    discount: 0,
    booking_id_list: []
}

export const RoomCreateThunk = createAsyncThunk
    ("room/create", async (newRoomData: RoomInterfaceNoId) => {

        const apiToken = localStorage.getItem('token')
        if (!apiToken) return roomDefaultIfError

        try {
            const request = await fetch(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_ENDPOINT_ROOMS}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiToken}`
                },
                body: JSON.stringify(newRoomData)
            })
            if (request.ok) {
                const roomCreated = await request.json()
                return roomCreated
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