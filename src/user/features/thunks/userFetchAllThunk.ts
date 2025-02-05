
import { createAsyncThunk } from "@reduxjs/toolkit"

import userJSON from '../../data/userData.json'
import { UserInterface } from '../../interfaces/userInterface'


type RequestResponse = {
    ok: boolean
    json: () => UserInterface[]
}

const userDefaultIfError: UserInterface = {
    id: 0,
    photo: '',
    full_name: '',
    email: '',
    start_date: '',
    description: '',
    phone_number: '',
    status_active: false
}

export const UserFetchAllThunk = createAsyncThunk
    ("user/fetchAll", async () => {

        try {
            const request: RequestResponse = await new Promise((resolve) => {
                setTimeout(() => resolve({
                    ok: true,
                    json: () => userJSON
                }), 200)
            })

            if (request.ok) {
                const allUsers = await request.json()
                return allUsers
            }
            else return [userDefaultIfError]
        }
        catch (error) {
            console.log(error)
            return [userDefaultIfError]
        }

    })