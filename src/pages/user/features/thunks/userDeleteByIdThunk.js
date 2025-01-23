
import { createAsyncThunk } from "@reduxjs/toolkit"


export const UserDeleteByIdThunk = createAsyncThunk("user/deleteById", async (userIdToDelete) => {

    try {
        const request = await new Promise((resolve) => {
            if (userIdToDelete) {
                setTimeout(() => resolve({
                    ok: true,
                    json: () => userIdToDelete
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
            const userDataDeleted = await request.json()
            return userDataDeleted
        }
        else return {}
    }
    catch (error) {
        console.log(error)
        throw error
    }

})