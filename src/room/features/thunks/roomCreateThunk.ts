
import { createAsyncThunk } from "@reduxjs/toolkit"
import { RoomInterface } from '../../interfaces/roomInterface.ts'


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

export const RoomCreateThunk = createAsyncThunk
    ("room/create", async (newRoomData: RoomInterface) => {

        try {
            const request: RequestResponse = await new Promise((resolve) => {
                if (newRoomData) {
                    setTimeout(() => resolve({
                        ok: true,
                        json: () => newRoomData
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
                const roomDataCreated = await request.json()
                return roomDataCreated
            }
            else return roomDefaultIfError
        }
        catch (error) {
            console.log(error)
            return roomDefaultIfError
        }

    })