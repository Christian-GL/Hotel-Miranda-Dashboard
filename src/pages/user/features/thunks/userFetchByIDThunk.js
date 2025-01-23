
import { createAsyncThunk } from "@reduxjs/toolkit"

import userJSON from '../../data/userData.json'


export const UserFetchByIDThunk = createAsyncThunk("user/fetchById", async (userId) => {

    try {
        const request = await new Promise((resolve) => {
            const user = userJSON.find((user) => user.id === userId);
            if (user) {
                setTimeout(() => resolve({
                    ok: true,
                    json: () => user
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
            const userFinded = await request.json()
            return userFinded
        }
        else return {}
    }
    catch (error) {
        console.log(error)
        throw error
    }

})