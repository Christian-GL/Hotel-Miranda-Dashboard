
import { createAsyncThunk } from "@reduxjs/toolkit"
import { UserInterface } from '../../interfaces/userInterface.ts'
import { JobPosition } from "../../enums/jobPosition.ts"
import { Role } from "../../enums/role.ts"
import { OptionYesNo } from "../../../common/enums/optionYesNo.ts"


const userDefaultIfError: UserInterface = {
    _id: "0",
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

export const UserFetchAllThunk = createAsyncThunk
    ("user/fetchAll", async () => {

        const apiToken = localStorage.getItem('token')
        if (!apiToken) return [userDefaultIfError]

        try {
            const request = await fetch(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_ENDPOINT_USERS}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiToken}`
                }
            })
            if (request.ok) {
                const json = await request.json()
                let allUsers: UserInterface[] = []
                for (let i = 0; i < json.length; i++) {
                    allUsers.push({
                        _id: json[i]._id,
                        photo: json[i].photo,
                        full_name: json[i].full_name,
                        email: json[i].email,
                        phone_number: json[i].phone_number,
                        start_date: json[i].start_date,
                        end_date: json[i].end_date,
                        job_position: json[i].job_position,
                        role: json[i].role,
                        password: json[i].password,
                        isArchived: json[i].isArchived
                    })
                }
                return allUsers
            }
            else {
                console.error('Error: ', request.statusText)
                return [userDefaultIfError]
            }
        }
        catch (error) {
            console.error(error)
            return [userDefaultIfError]
        }

    })