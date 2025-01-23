
import { createAsyncThunk } from "@reduxjs/toolkit"


export const RoomCreateThunk = createAsyncThunk("room/create", async (newRoomData) => {

    try {
        const request = await new Promise((resolve) => {
            if (newRoomData) {
                setTimeout(() => resolve({
                    ok: true,
                    json: () => newRoomData
                }), 200)
            }
            else {
                setTimeout(() => resolve({
                    ok: false,
                    json: () => { }
                }), 200)
            }

        })

        if (request.ok) {
            const roomDataCreated = await request.json()
            return roomDataCreated
        }
        else return {}
    }
    catch (error) {
        console.log(error)
        throw error
    }

})