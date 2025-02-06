
import { createAsyncThunk } from "@reduxjs/toolkit"


type RequestResponse = {
    ok: boolean
    json: () => number
}

export const RoomDeleteByIdThunk = createAsyncThunk
    ("room/deleteById", async (roomIdToDelete: number) => {

        try {
            const request: RequestResponse = await new Promise((resolve) => {
                if (roomIdToDelete) {
                    setTimeout(() => resolve({
                        ok: true,
                        json: () => roomIdToDelete
                    }), 200)
                }
                else {
                    setTimeout(() => resolve({
                        ok: false,
                        json: () => 0
                    }), 200)
                }

            })

            if (request.ok) {
                const roomDataDeleted = await request.json()
                return roomDataDeleted
            }
            else return 0
        }
        catch (error) {
            console.log(error)
            return 0
        }

    })