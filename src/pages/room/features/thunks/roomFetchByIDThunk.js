
import { createAsyncThunk } from "@reduxjs/toolkit"

import roomJSON from '../../data/roomData.json'


export const RoomFetchByIDThunk = createAsyncThunk("room/fetchById", async (roomId) => {

    try {
        const request = await new Promise((resolve) => {
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
                    json: () => {}
                }), 200)
            }

        })

        if (request.ok) {
            const roomFinded = await request.json()
            return roomFinded
        }
        else return {}
    }
    catch (error) {
        console.log(error)
        throw error
    }

})