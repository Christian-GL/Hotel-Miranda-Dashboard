
import { createAsyncThunk } from "@reduxjs/toolkit"
import { RoomInterface } from "../../interfaces/roomInterface"
import { RoomType } from "../../enums/roomType"
import { OptionYesNo } from "common/enums/optionYesNo"


const roomDefaultIfError: RoomInterface = {
    _id: '0',
    photos: [],
    number: '0',
    type: RoomType.singleBed,
    amenities: [],
    price: 0,
    discount: 0,
    isActive: OptionYesNo.no,
    isArchived: OptionYesNo.yes,
    booking_id_list: []
}

export const RoomFetchAllThunk = createAsyncThunk
    ("room/fetchAll", async () => {

        const apiToken = localStorage.getItem('token')
        if (!apiToken) return [roomDefaultIfError]

        try {
            const request = await fetch(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_ENDPOINT_ROOMS}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiToken}`
                }
            })
            if (request.ok) {
                const json = await request.json()
                let allRooms: RoomInterface[] = []
                for (let i = 0; i < json.length; i++) {
                    allRooms.push({
                        _id: json[i]._id,
                        photos: json[i].photos,
                        number: json[i].number,
                        type: json[i].type,
                        amenities: json[i].amenities,
                        price: json[i].price,
                        discount: json[i].discount,
                        isActive: json[i].isActive,
                        isArchived: json[i].isArchived,
                        booking_id_list: json[i].booking_id_list
                    })
                }
                return allRooms
            }
            else {
                console.error('Error: ', request.statusText)
                return [roomDefaultIfError]
            }
        }
        catch (error) {
            console.error(error)
            return [roomDefaultIfError]
        }

    })