
import { createAsyncThunk } from "@reduxjs/toolkit"
import { RoomInterface } from "../../interfaces/roomInterface"

type RequestResponse = {
    ok: boolean
    json: () => RoomInterface
}

const roomDefaultIfError: RoomInterface = {
    id: 0,
    photos: [],
    type: '',
    amenities: [],
    price: 0,
    discount: 0,
    booking_list: []
}

export const RoomUpdateThunk = createAsyncThunk
    ("room/update", async (roomData: RoomInterface) => {

        try {
            const request: RequestResponse = await new Promise((resolve) => {
                if (roomData) {
                    setTimeout(() => resolve({
                        ok: true,
                        json: () => roomData
                    }), 200)
                }
                else {
                    setTimeout(() => resolve({
                        ok: false,
                        json: () => roomDefaultIfError
                    }), 200)
                }

            })

            if (request.ok) {
                const roomDataUpdated = await request.json()
                return roomDataUpdated
            }
            else return roomDefaultIfError
        }
        catch (error) {
            console.log(error)
            return roomDefaultIfError
        }

    })