
import { createAsyncThunk } from "@reduxjs/toolkit"

import roomJSON from '../../data/roomData.json'
import { RoomInterface } from "../../interfaces/roomInterface.ts"


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

export const RoomFetchByIDThunk = createAsyncThunk
    ("room/fetchById", async (roomId: number) => {

        try {
            const request: RequestResponse = await new Promise((resolve) => {
                const room = roomJSON.find((room) => room.id === roomId);
                if (room) {
                    setTimeout(() => resolve({
                        ok: true,
                        json: () => room
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
                const roomFinded = await request.json()
                return roomFinded
            }
            else return roomDefaultIfError
        }
        catch (error) {
            console.log(error)
            return roomDefaultIfError
        }

    })