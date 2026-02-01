
import { BookingStatus } from "../../booking/enums/bookingStatus"


export const checkBookingStatus = (checkInDate: Date, checkOutDate: Date): BookingStatus => {
    const now = Date.now()
    const checkIn = new Date(checkInDate).getTime()
    const checkOut = new Date(checkOutDate).getTime()

    if (now < checkIn) {
        return BookingStatus.checkIn
    }
    if (now >= checkIn && now < checkOut) {
        return BookingStatus.inProgress
    }
    return BookingStatus.checkOut
}
