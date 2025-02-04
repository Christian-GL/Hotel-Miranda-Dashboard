
import { createAsyncThunk } from "@reduxjs/toolkit"


export const RoomUpdateThunk = createAsyncThunk("room/update", async (roomData) => {

    try {
        const request = await new Promise((resolve) => {
            if (roomData) {
                setTimeout(() => resolve({
                    ok: true,
                    json: () => roomData
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
            const roomDataUpdated = await request.json()
            return roomDataUpdated
        }
        else return {}
    }
    catch (error) {
        console.log(error)
        throw error
    }

})