
import { createAsyncThunk } from "@reduxjs/toolkit"

import userJSON from '../../data/userData.json'


export const UserFetchAllThunk = createAsyncThunk("user/fetchAll", async () => {

    try {
        const request = await new Promise((resolve) => {
            setTimeout(() => resolve({
                ok: true,
                json: () => userJSON
            }), 200)
        })

        if (request.ok) {
            const allUsers = await request.json()
            return allUsers
        }
        else return []
    }
    catch (error) {
        console.log(error)
        throw error
    }

})