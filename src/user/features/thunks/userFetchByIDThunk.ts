
import { createAsyncThunk } from "@reduxjs/toolkit"

import userJSON from '../../data/userData.json'
import { UserInterface } from '../../interfaces/userInterface.ts'


type RequestResponse = {
    ok: boolean
    json: () => UserInterface
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

export const UserFetchByIDThunk = createAsyncThunk
    ("user/fetchById", async (userId: number) => {

        try {
            const request: RequestResponse = await new Promise((resolve) => {
                const user = userJSON.find((user) => user.id === userId)
                if (user) {
                    setTimeout(() => resolve({
                        ok: true,
                        json: () => user
                    }), 200)
                }
                else {
                    setTimeout(() => resolve({
                        ok: false,
                        json: () => userDefaultIfError
                    }), 200)
                }

            })

            if (request.ok) {
                const userFinded = await request.json()
                return userFinded
            }
            else return userDefaultIfError
        }
        catch (error) {
            console.log(error)
            return userDefaultIfError
        }

    })