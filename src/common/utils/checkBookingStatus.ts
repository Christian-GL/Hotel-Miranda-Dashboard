
import { BookingStatus } from "../../booking/enums/bookingStatus"


export const checkBookingStatus = (checkInDate: string, checkOutDate: string): BookingStatus => {
    const actualDate = new Date().toISOString()
    if (actualDate < checkInDate) {
        return BookingStatus.checkIn
    }
    else if (actualDate > checkInDate && actualDate < checkOutDate) {
        return BookingStatus.inProgress
    }
    else return BookingStatus.checkOut
}