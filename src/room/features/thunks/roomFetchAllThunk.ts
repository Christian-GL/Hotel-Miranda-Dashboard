
import { createAsyncThunk } from "@reduxjs/toolkit"

import roomJSON from '../../data/roomData.json'
import { RoomInterface } from "../../interfaces/roomInterface.ts"


type RequestResponse = {
    ok: boolean
    json: () => RoomInterface[]
}

const userDefaultIfError: RoomInterface = {
    id: 0,
    photos: [],
    type: '',
    amenities: [],
    price: 0,
    discount: 0,
    booking_list: []
}

export const RoomFetchAllThunk = createAsyncThunk
    ("room/fetchAll", async () => {

        try {
            const request: RequestResponse = await new Promise((resolve) => {
                setTimeout(() => resolve({
                    ok: true,
                    json: () => roomJSON
                }), 200)
            })

            if (request.ok) {
                const allRooms = await request.json()
                return allRooms
            }
            else return [userDefaultIfError]
        }
        catch (error) {
            console.log(error)
            return [userDefaultIfError]
        }

    })