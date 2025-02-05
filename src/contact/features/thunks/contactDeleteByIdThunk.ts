
import { createAsyncThunk } from "@reduxjs/toolkit"


type RequestResponse = {
    ok: boolean
    json: () => number
}

export const ContactDeleteByIdThunk = createAsyncThunk
    ("contact/deleteById", async (contactIdToDelete: number) => {

        try {
            const request: RequestResponse = await new Promise((resolve) => {
                if (contactIdToDelete) {
                    setTimeout(() => resolve({
                        ok: true,
                        json: () => contactIdToDelete
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
                const contactDataDeleted = await request.json()
                return contactDataDeleted
            }
            else return 0
        }
        catch (error) {
            console.log(error)
            return 0
        }

    })