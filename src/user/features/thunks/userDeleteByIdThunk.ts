
import { createAsyncThunk } from "@reduxjs/toolkit"


type RequestResponse = {
    ok: boolean
    json: () => number
}

export const UserDeleteByIdThunk = createAsyncThunk
    ("user/deleteById", async (userIdToDelete: number) => {

        try {
            const request: RequestResponse = await new Promise((resolve) => {
                if (userIdToDelete) {
                    setTimeout(() => resolve({
                        ok: true,
                        json: () => userIdToDelete
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
                const userDataDeleted = await request.json()
                return userDataDeleted
            }
            else return 0
        }
        catch (error) {
            console.log(error)
            return 0
        }

    })