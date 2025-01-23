
import { createAsyncThunk } from "@reduxjs/toolkit"


export const RoomDeleteByIdThunk = createAsyncThunk("room/deleteById", async (roomIdToDelete) => {

    try {
        const request = await new Promise((resolve) => {
            if (roomIdToDelete) {
                setTimeout(() => resolve({
                    ok: true,
                    json: () => roomIdToDelete
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
            const roomDataDeleted = await request.json()
            return roomDataDeleted
        }
        else return {}
    }
    catch (error) {
        console.log(error)
        throw error
    }

})