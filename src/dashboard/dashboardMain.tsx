
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Swiper, SwiperSlide } from 'swiper/react'

import * as styles from "./dashboardMainStyles"
import { AppDispatch } from '../common/redux/store'
import { ApiStatus } from "../common/enums/ApiStatus"
import { BookingStatus } from "../booking/enums/bookingStatus"
import { formatDateForPrint } from '../common/utils/dateUtils'
import { checkBookingStatus } from '../common/utils/checkBookingStatus'
import { customPopupMessage } from '../common/utils/customPopupMessage'
import { PopupText } from "../common/components/popupText/popupText"
import { PopupTextInterface } from '../common/interfaces/popupTextInterface'
import { ArticleReview } from "../common/components/articleReview/articleReview"
import { getBookingAllData, getBookingAllStatus, getBookingErrorMessage } from '../booking/features/bookingSlice'
import { BookingFetchAllThunk } from '../booking/features/thunks/bookingFetchAllThunk'
import { getClientAllData, getClientAllStatus, getClientErrorMessage } from "../client/features/clientSlice"
import { ClientFetchAllThunk } from "../client/features/thunks/clientFetchAllThunk"
import { BookingInterfaceId } from "../booking/interfaces/bookingInterface"
import { ClientInterfaceId } from "../client/interfaces/clientInterface"


export const DashboardMain = () => {

    const dispatch = useDispatch<AppDispatch>()
    const bookingAll: BookingInterfaceId[] = useSelector(getBookingAllData)
    const bookingAllLoading: ApiStatus = useSelector(getBookingAllStatus)
    const bookingErrorMessage = useSelector(getBookingErrorMessage)
    const clientAll: ClientInterfaceId[] = useSelector(getClientAllData)
    const clientAllLoading: ApiStatus = useSelector(getClientAllStatus)
    const clientErrorMessage = useSelector(getClientErrorMessage)
    const [showPopup, setShowPopup] = useState<boolean>(false)
    const [infoPopup, setInfoPopup] = useState<PopupTextInterface>({ title: '', text: '' })

    useEffect(() => {
        if (bookingAllLoading === ApiStatus.idle) { dispatch(BookingFetchAllThunk()) }
        else if (bookingAllLoading === ApiStatus.fulfilled) { }
        else if (bookingAllLoading === ApiStatus.rejected && bookingErrorMessage) { customPopupMessage(setInfoPopup, setShowPopup, 'API Error', bookingErrorMessage) }
    }, [bookingAllLoading, bookingAll])
    useEffect(() => {
        if (clientAllLoading === ApiStatus.idle) { dispatch(ClientFetchAllThunk()) }
        else if (clientAllLoading === ApiStatus.fulfilled) { }
        else if (clientAllLoading === ApiStatus.rejected && clientErrorMessage) { customPopupMessage(setInfoPopup, setShowPopup, 'API Error', clientErrorMessage) }
    }, [clientAllLoading, clientAll])


    return (
        < styles.SectionPageDashboard >

            <styles.SectionKPIs>
                <styles.ArticleKPI>
                    <styles.IconBooking />
                    <styles.CtnInfo>
                        <styles.NumberH4>{bookingAll.length}</styles.NumberH4>
                        <styles.TextH5>Total Bookings</styles.TextH5>
                    </styles.CtnInfo>
                </styles.ArticleKPI>
                <styles.ArticleKPI>
                    <styles.IconLogIn />
                    <styles.CtnInfo>
                        <styles.NumberH4>
                            {bookingAll.filter(booking =>
                                checkBookingStatus(booking.check_in_date, booking.check_out_date) === BookingStatus.checkIn
                            ).length}
                        </styles.NumberH4>
                        <styles.TextH5>Check in</styles.TextH5>
                    </styles.CtnInfo>
                </styles.ArticleKPI>
                <styles.ArticleKPI>
                    <styles.IconCalendar />
                    <styles.CtnInfo>
                        <styles.NumberH4>
                            {bookingAll.filter(booking =>
                                checkBookingStatus(booking.check_in_date, booking.check_out_date) === BookingStatus.inProgress
                            ).length}
                        </styles.NumberH4>
                        <styles.TextH5>In Progress</styles.TextH5>
                    </styles.CtnInfo>
                </styles.ArticleKPI>
                <styles.ArticleKPI>
                    <styles.IconLogOut />
                    <styles.CtnInfo>
                        <styles.NumberH4>
                            {bookingAll.filter(booking =>
                                checkBookingStatus(booking.check_in_date, booking.check_out_date) === BookingStatus.checkOut
                            ).length}
                        </styles.NumberH4>
                        <styles.TextH5>Check Out</styles.TextH5>
                    </styles.CtnInfo>
                </styles.ArticleKPI>
            </styles.SectionKPIs>

            {showPopup && <PopupText isSlider={false} title={infoPopup.title} text={infoPopup.text} onClose={() => setShowPopup(false)} />}

            <styles.SectionSpecialRequest>
                <styles.TitleSectionReviewsH5>Latest reviews by client</styles.TitleSectionReviewsH5>
                {/* <dashboardJS.SwiperCustom
                        spaceBetween={0}
                        slidesPerView={3}
                        navigation={{
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev'
                        }}
                        pagination={{ clickable: true }}
                        loop={true}
                        grabCursor={true}
                    > */}
                <Swiper
                    spaceBetween={0}
                    slidesPerView={clientAll.length === 1 ? 1 : clientAll.length === 2 ? 2 : 3}
                    navigation={false}
                    pagination={{ clickable: true }}
                    loop={true}
                >
                    {bookingAll.map((booking, index) => {
                        return <SwiperSlide key={index}>
                            <ArticleReview
                                title={clientAll.find(client => client._id === booking.client_id)?.full_name || 'No client name found'}
                                subTittle={`${formatDateForPrint(booking.order_date)}`}
                                content={booking.special_request}
                            />
                        </SwiperSlide>
                    })}
                </Swiper>
                {/* </dashboardJS.SwiperCustom> */}
            </styles.SectionSpecialRequest>

        </styles.SectionPageDashboard >
    )

}