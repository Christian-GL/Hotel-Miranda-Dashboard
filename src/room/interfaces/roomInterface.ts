
import { OptionYesNo } from "common/enums/optionYesNo"
import { RoomAmenities } from 'room/enums/roomAmenities'
import { RoomType } from "room/enums/roomType"


export interface RoomInterface {
    number: string
    photos: string[]
    type: RoomType
    amenities: RoomAmenities[]
    price: number
    discount: number
    isActive: OptionYesNo
    isArchived: OptionYesNo
    booking_id_list: string[]
}

export interface RoomInterfaceId extends RoomInterface {
    _id: string
}