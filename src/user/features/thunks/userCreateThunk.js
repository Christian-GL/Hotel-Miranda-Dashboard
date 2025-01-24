
import { createAsyncThunk } from "@reduxjs/toolkit"


export const UserCreateThunk = createAsyncThunk("user/create", async (newUserData) => {

    try {
        const request = await new Promise((resolve) => {
            if (newUserData) {
                setTimeout(() => resolve({
                    ok: true,
                    json: () => newUserData
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
            const userDataCreated = await request.json()
            return userDataCreated
        }
        else return {}
    }
    catch (error) {
        console.log(error)
        throw error
    }

})