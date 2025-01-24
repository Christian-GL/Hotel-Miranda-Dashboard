
import { createAsyncThunk } from "@reduxjs/toolkit"


export const UserUpdateByIdThunk = createAsyncThunk("user/updateById", async (userIdToUpdate) => {

    try {
        const request = await new Promise((resolve) => {
            if (userIdToUpdate) {
                setTimeout(() => resolve({
                    ok: true,
                    json: () => userIdToUpdate
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