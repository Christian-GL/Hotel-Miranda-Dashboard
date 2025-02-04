
import { createAsyncThunk } from "@reduxjs/toolkit"


export const UserUpdateThunk = createAsyncThunk("user/update", async (userData) => {

    try {
        const request = await new Promise((resolve) => {
            if (userData) {
                setTimeout(() => resolve({
                    ok: true,
                    json: () => userData
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
            const userDataUpdated = await request.json()
            return userDataUpdated
        }
        else return {}
    }
    catch (error) {
        console.log(error)
        throw error
    }

})