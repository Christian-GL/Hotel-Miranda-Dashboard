
import { ClientInterfaceId } from "client/interfaces/clientInterface"
import { BookingInterfaceId } from "booking/interfaces/bookingInterface"
import { RoomInterfaceId } from "room/interfaces/roomInterface"
import { ClientBookingsByRoomInterface } from "../interfaces/clientBookingsByRoomInterface"


export const getClientBookingsByRoom = (
    client: ClientInterfaceId,
    bookings: BookingInterfaceId[],
    rooms: RoomInterfaceId[])
    : ClientBookingsByRoomInterface[] => {

    const bookingIds = client.booking_id_list
    const result = bookingIds.map(bookingId => {

        const bookingFound = bookings.find(
            booking => booking._id === bookingId
        )
        if (!bookingFound) return null

        const roomIds = bookingFound.room_id_list
        const roomNumbers = roomIds.map(roomId => {
            const roomFound = rooms.find(
                room => room._id === roomId
            )
            return roomFound?.number
        }).filter((number): number is string => Boolean(number))

        const mappedBooking: ClientBookingsByRoomInterface = {
            bookingId,
            roomNumbers
        }
        return mappedBooking
    })

    return result.filter(
        (item): item is ClientBookingsByRoomInterface =>
            item !== null
    )
}