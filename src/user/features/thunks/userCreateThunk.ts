
import { createAsyncThunk } from "@reduxjs/toolkit"
import { UserInterface } from '../../interfaces/userInterface.ts'
import { UserStatus } from "../../data/userStatus.ts"
import { apiUrl, apiEndPointUsers, apiToken } from '../../../common/globalParameters/routes.ts'


const userDefaultIfError: UserInterface = {
    _id: '',
    photo: '',
    full_name: '',
    email: '',
    password: '',
    start_date: '',
    description: '',
    phone_number: '',
    status: UserStatus.inactive
}

export const UserCreateThunk = createAsyncThunk
    ("user/create", async (newUserData: Partial<UserInterface>) => {

        if (newUserData.photo === undefined) { console.error('user.photo is undefined'); return userDefaultIfError }
        if (newUserData.full_name === undefined) { console.error('user.full_name is undefined'); return userDefaultIfError }
        if (newUserData.email === undefined) { console.error('user.email is undefined'); return userDefaultIfError }
        if (newUserData.password === undefined) { console.error('user.password is undefined'); return userDefaultIfError }
        if (newUserData.start_date === undefined) { console.error('user.start_date is undefined'); return userDefaultIfError }
        if (newUserData.description === undefined) { console.error('user.description is undefined'); return userDefaultIfError }
        if (newUserData.phone_number === undefined) { console.error('user.phone_number is undefined'); return userDefaultIfError }
        if (newUserData.status === undefined) { console.error('user.status is undefined'); return userDefaultIfError }

        try {
            const request = await fetch(`${apiUrl}/${apiEndPointUsers}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiToken}`
                },
                body: JSON.stringify(newUserData)
            })
            if (request.ok) {
                const userCreated = await request.json()
                return userCreated
            } else {
                console.log("Error: ", request.statusText)
                return userDefaultIfError
            }
        }
        catch (error) {
            console.log(error)
            return userDefaultIfError
        }

    })