
import { createAsyncThunk } from "@reduxjs/toolkit"


export const RoomUpdateByIdThunk = createAsyncThunk("room/updateById", async (roomIdToUpdate) => {

    try {
        const request = await new Promise((resolve) => {
            if (roomIdToUpdate) {
                setTimeout(() => resolve({
                    ok: true,
                    json: () => roomIdToUpdate
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