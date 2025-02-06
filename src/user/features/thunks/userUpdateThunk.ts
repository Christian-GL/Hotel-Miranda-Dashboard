
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

export const UserUpdateThunk = createAsyncThunk
    ("user/update", async (userData: UserInterface) => {

        try {
            const request: RequestResponse = await new Promise((resolve) => {
                if (userData) {
                    setTimeout(() => resolve({
                        ok: true,
                        json: () => userData
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
                const userDataUpdated = await request.json()
                return userDataUpdated
            }
            else return userDefaultIfError
        }
        catch (error) {
            console.log(error)
            return userDefaultIfError
        }

    })