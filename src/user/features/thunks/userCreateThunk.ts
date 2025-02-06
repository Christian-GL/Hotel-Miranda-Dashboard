
import { createAsyncThunk } from "@reduxjs/toolkit"
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

export const UserCreateThunk = createAsyncThunk
    ("user/create", async (newUserData: UserInterface) => {

        try {
            const request: RequestResponse = await new Promise((resolve) => {
                if (newUserData) {
                    setTimeout(() => resolve({
                        ok: true,
                        json: () => newUserData
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
                const userDataCreated = await request.json()
                return userDataCreated
            }
            else return userDefaultIfError
        }
        catch (error) {
            console.log(error)
            return userDefaultIfError
        }

    })