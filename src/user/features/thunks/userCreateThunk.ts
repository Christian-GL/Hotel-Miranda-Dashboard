
import { createAsyncThunk } from "@reduxjs/toolkit"
import { UserInterfaceNoId } from '../../interfaces/userInterface.ts'
import { JobPosition } from "../../enums/jobPosition.ts"
import { Role } from "../../enums/role.ts"
import { OptionYesNo } from "../../../common/enums/optionYesNo.ts"


const userDefaultIfError: UserInterfaceNoId = {
    photo: '',
    full_name: '',
    email: '',
    phone_number: '',
    start_date: new Date(),
    end_date: new Date(),
    job_position: JobPosition.receptionist,
    role: Role.user,
    password: '1234',
    isArchived: OptionYesNo.yes
}


export const UserCreateThunk = createAsyncThunk
    ("user/create", async (newUserData: UserInterfaceNoId) => {

        const apiToken = localStorage.getItem('token')
        if (!apiToken) return userDefaultIfError

        try {
            const request = await fetch(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_ENDPOINT_USERS}`, {
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
