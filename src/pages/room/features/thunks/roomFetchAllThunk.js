
import { createAsyncThunk } from "@reduxjs/toolkit"

import roomJSON from '../../data/roomData.json'


export const RoomFetchAllThunk = createAsyncThunk("room/fetchAll", async () => {

    try {
        const request = await new Promise((resolve) => {
            setTimeout(() => resolve({
                ok: true,
                json: () => roomJSON
            }), 200)
        })

        if (request.ok) {
            const allRooms = await request.json()
            return allRooms
        }
        else return []
    }
    catch (error) {
        console.log(error)
        throw error
    }

})