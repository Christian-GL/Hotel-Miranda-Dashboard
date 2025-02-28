
import { RoomType } from "../data/roomType.ts"
import { RoomAmenities } from '../data/roomAmenities.ts'


export interface RoomInterfaceWithOutID {
    photos: string[]
    number: string
    type: RoomType
    amenities: RoomAmenities[]
    price: number
    discount: number
    booking_list: string[]
}

export interface RoomInterface extends RoomInterfaceWithOutID {
    _id: string
}