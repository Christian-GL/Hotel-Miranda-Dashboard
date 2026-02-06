
import { BookingStatus } from "../../booking/enums/bookingStatus"
import { BookingStatusTotals } from "../../booking/interfaces/bookingStatusTotals"
import { checkBookingStatus } from "./checkBookingStatus"
import { BookingInterfaceId } from "../../booking/interfaces/bookingInterface"


export const getBookingStatusTotals = (clientBookingIdList: string[], bookingAll: BookingInterfaceId[]): BookingStatusTotals => {
    const allBookingData = bookingAll.filter(booking =>
        clientBookingIdList.includes(booking._id)
    )
    let totalCheckIn = 0
    let totalInProgress = 0
    let totalCheckOut = 0
    allBookingData.forEach(booking => {
        const bookingStatus = checkBookingStatus(
            booking.check_in_date,
            booking.check_out_date
        )
        switch (bookingStatus) {
            case BookingStatus.checkIn:
                totalCheckIn++
                break
            case BookingStatus.inProgress:
                totalInProgress++
                break
            case BookingStatus.checkOut:
                totalCheckOut++
                break
        }
    })
    return {
        totalCheckIn,
        totalInProgress,
        totalCheckOut
    }
}