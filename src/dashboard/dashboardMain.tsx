
import { useEffect, useMemo } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'

import * as styles from "./dashboardMainStyles"
import { CtnSwiperCustom, ButtonPrev, ButtonNext } from "../common/styles/customSwiperStyles"
import { AppDispatch } from '../common/redux/store'
import { ApiStatus } from "../common/enums/ApiStatus"
import { OptionYesNo } from "common/enums/optionYesNo"
import { BookingStatus } from "../booking/enums/bookingStatus"
import { formatDateForPrint } from '../common/utils/dateUtils'
import { checkBookingStatus } from '../common/utils/checkBookingStatus'
import { getBookingStatusTotals } from "../common/utils/getBookingStatusTotals"
import { BookingArticle } from "../common/components/bookingArticle/bookingArticle"
import { getBookingAllData, getBookingAllStatus } from '../booking/features/bookingSlice'
import { BookingFetchAllThunk } from '../booking/features/thunks/bookingFetchAllThunk'
import { getClientAllData, getClientAllStatus } from "../client/features/clientSlice"
import { ClientFetchAllThunk } from "../client/features/thunks/clientFetchAllThunk"
import { BookingStatusTotals } from "booking/interfaces/bookingStatusTotals"
import { BookingInterfaceId } from "../booking/interfaces/bookingInterface"
import { ClientInterfaceId } from "../client/interfaces/clientInterface"
import { RoomInterfaceId } from "../room/interfaces/roomInterface"
import { getRoomAllData, getRoomAllStatus } from "../room/features/roomSlice"
import { RoomFetchAllThunk } from "../room/features/thunks/roomFetchAllThunk"


export const DashboardMain = () => {

    const dispatch = useDispatch<AppDispatch>()
    const bookingAll: BookingInterfaceId[] = useSelector(getBookingAllData)
    const bookingAllLoading: ApiStatus = useSelector(getBookingAllStatus)
    const clientAll: ClientInterfaceId[] = useSelector(getClientAllData)
    const clientAllLoading: ApiStatus = useSelector(getClientAllStatus)
    const roomAll: RoomInterfaceId[] = useSelector(getRoomAllData)
    const roomAllLoading: ApiStatus = useSelector(getRoomAllStatus)

    useEffect(() => {
        if (bookingAllLoading === ApiStatus.idle) { dispatch(BookingFetchAllThunk()) }
    }, [bookingAllLoading, bookingAll])
    useEffect(() => {
        if (clientAllLoading === ApiStatus.idle) { dispatch(ClientFetchAllThunk()) }
    }, [clientAllLoading, clientAll])
    useEffect(() => {
        if (roomAllLoading === ApiStatus.idle) { dispatch(RoomFetchAllThunk()) }
    }, [roomAllLoading, roomAll])

    const latestBookings = useMemo(() => {
        return bookingAll
            .filter(b => b.isArchived === OptionYesNo.no)
            .sort((a, b) => new Date(b.order_date).getTime() - new Date(a.order_date).getTime())
    }, [bookingAll])
    const bookingIdsAllClients: string[] = clientAll.flatMap(client => client.booking_id_list ?? [])
    const bookingStatusTotals: BookingStatusTotals = getBookingStatusTotals(bookingIdsAllClients, bookingAll)


    return (<>
        < styles.SectionPageDashboard >

            <styles.SectionKPIs>
                <styles.ArticleKPI>
                    <styles.IconBooking />
                    <styles.CtnInfo>
                        <styles.NumberH4>{bookingStatusTotals.totalCheckIn + bookingStatusTotals.totalInProgress + bookingStatusTotals.totalCheckOut}</styles.NumberH4>
                        <styles.TextH5>Total Bookings</styles.TextH5>
                    </styles.CtnInfo>
                </styles.ArticleKPI>
                <styles.ArticleKPI>
                    <styles.IconLogIn />
                    <styles.CtnInfo>
                        <styles.NumberH4>{bookingStatusTotals.totalCheckIn}</styles.NumberH4>
                        <styles.TextH5>Checked in</styles.TextH5>
                    </styles.CtnInfo>
                </styles.ArticleKPI>
                <styles.ArticleKPI>
                    <styles.IconCalendar />
                    <styles.CtnInfo>
                        <styles.NumberH4>{bookingStatusTotals.totalInProgress}</styles.NumberH4>
                        <styles.TextH5>In Progress</styles.TextH5>
                    </styles.CtnInfo>
                </styles.ArticleKPI>
                <styles.ArticleKPI>
                    <styles.IconLogOut />
                    <styles.CtnInfo>
                        <styles.NumberH4>{bookingStatusTotals.totalCheckOut}</styles.NumberH4>
                        <styles.TextH5>Checked Out</styles.TextH5>
                    </styles.CtnInfo>
                </styles.ArticleKPI>
            </styles.SectionKPIs>

            <styles.SectionSpecialRequest>
                <styles.TitleSectionReviewsH5>Latest bookings:</styles.TitleSectionReviewsH5>
                {clientAll.length > 0
                    ? (<>
                        <CtnSwiperCustom>
                            <Swiper
                                modules={[Navigation, Pagination]}
                                spaceBetween={0}
                                slidesPerView={3}
                                navigation={{
                                    prevEl: '.swiper-button-prev-custom',
                                    nextEl: '.swiper-button-next-custom',
                                }}
                                loop={false}
                            >
                                {latestBookings.map((booking, index) => {
                                    return (
                                        <SwiperSlide key={index}>
                                            <BookingArticle
                                                bookingStatus={checkBookingStatus(booking.check_in_date, booking.check_out_date)}
                                                nameClient={clientAll.find(client => client._id === booking.client_id)?.full_name || 'No client name found'}
                                                roomNumbersText={`Room numbers: ${booking.room_id_list.map(roomId => roomAll.find(room => room._id === roomId)?.number || 'No room number found').join(', ')}`}
                                                orderDateText={`Order date: ${formatDateForPrint(booking.order_date)}`}
                                                specialRequest={booking.special_request}
                                                navigationRoute={`../bookings/booking-details/${booking._id}`}
                                            />
                                        </SwiperSlide>
                                    )
                                })}
                            </Swiper>
                            <ButtonPrev>◀</ButtonPrev>
                            <ButtonNext>▶</ButtonNext>
                        </CtnSwiperCustom>
                    </>)
                    : <styles.TextH4>No bookings founded</styles.TextH4>
                }
            </styles.SectionSpecialRequest>

        </styles.SectionPageDashboard >
    </>)

}