
import React from "react"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Swiper, SwiperSlide } from 'swiper/react'

import * as dashboardMainStyles from "./dashboardMainStyles"
import { AppDispatch } from '../common/redux/store'
import { ApiStatus } from "../common/enums/ApiStatus"
import { formatDateForPrint } from '../common/utils/dateUtils'
import { checkBookingStatus } from '../common/utils/checkBookingStatus'
import { ArticleReview } from "../common/components/articleReview/articleReview"
import { getBookingAllData, getBookingAllStatus } from '../booking/features/bookingSlice'
import { BookingFetchAllThunk } from '../booking/features/thunks/bookingFetchAllThunk'
import { getClientAllData, getClientAllStatus } from "../client/features/clientSlice"
import { ClientFetchAllThunk } from "../client/features/thunks/clientFetchAllThunk"
import { BookingInterfaceRoom } from "../booking/interfaces/bookingInterface"
import { ClientInterface } from "../client/interfaces/clientInterface"


export const DashboardMain = () => {

    const dispatch = useDispatch<AppDispatch>()
    const bookingAll: BookingInterfaceRoom[] = useSelector(getBookingAllData)
    const bookingAllLoading: ApiStatus = useSelector(getBookingAllStatus)
    const clientAll: ClientInterface[] = useSelector(getClientAllData)
    const clientAllLoading: ApiStatus = useSelector(getClientAllStatus)

    useEffect(() => {
        if (bookingAllLoading === ApiStatus.idle) { dispatch(BookingFetchAllThunk()) }
        else if (bookingAllLoading === ApiStatus.fulfilled) { }
        else if (bookingAllLoading === ApiStatus.rejected) { alert("Error en la api de dashboard > bookings") }
    }, [bookingAllLoading, bookingAll])
    useEffect(() => {
        if (clientAllLoading === ApiStatus.idle) { dispatch(ClientFetchAllThunk()) }
        else if (clientAllLoading === ApiStatus.fulfilled) { }
        else if (clientAllLoading === ApiStatus.rejected) { alert("Error en la api de dashboard > clients") }
    }, [clientAllLoading, clientAll])


    return (
        < dashboardMainStyles.SectionPageDashboard >

            <dashboardMainStyles.SectionKPIs>
                <dashboardMainStyles.ArticleKPI>
                    <dashboardMainStyles.IconBooking />
                    <dashboardMainStyles.DivCtnInfo>
                        <dashboardMainStyles.NumberH4>{bookingAll.length}</dashboardMainStyles.NumberH4>
                        <dashboardMainStyles.TextH5>New Bookings</dashboardMainStyles.TextH5>
                    </dashboardMainStyles.DivCtnInfo>
                </dashboardMainStyles.ArticleKPI>
                <dashboardMainStyles.ArticleKPI>
                    <dashboardMainStyles.IconLogIn />
                    <dashboardMainStyles.DivCtnInfo>
                        <dashboardMainStyles.NumberH4>
                            {bookingAll.filter(booking =>
                                checkBookingStatus(booking.check_in_date, booking.check_out_date) === 'Check In'
                            ).length}
                        </dashboardMainStyles.NumberH4>
                        <dashboardMainStyles.TextH5>Check in</dashboardMainStyles.TextH5>
                    </dashboardMainStyles.DivCtnInfo>
                </dashboardMainStyles.ArticleKPI>
                <dashboardMainStyles.ArticleKPI>
                    <dashboardMainStyles.IconCalendar />
                    <dashboardMainStyles.DivCtnInfo>
                        <dashboardMainStyles.NumberH4>
                            {bookingAll.filter(booking =>
                                checkBookingStatus(booking.check_in_date, booking.check_out_date) === 'In Progress'
                            ).length}
                        </dashboardMainStyles.NumberH4>
                        <dashboardMainStyles.TextH5>In Progress</dashboardMainStyles.TextH5>
                    </dashboardMainStyles.DivCtnInfo>
                </dashboardMainStyles.ArticleKPI>
                <dashboardMainStyles.ArticleKPI>
                    <dashboardMainStyles.IconLogOut />
                    <dashboardMainStyles.DivCtnInfo>
                        <dashboardMainStyles.NumberH4>
                            {bookingAll.filter(booking =>
                                checkBookingStatus(booking.check_in_date, booking.check_out_date) === 'Check Out'
                            ).length}
                        </dashboardMainStyles.NumberH4>
                        <dashboardMainStyles.TextH5>Check Out</dashboardMainStyles.TextH5>
                    </dashboardMainStyles.DivCtnInfo>
                </dashboardMainStyles.ArticleKPI>
            </dashboardMainStyles.SectionKPIs>

            <dashboardMainStyles.SectionReviews>
                <dashboardMainStyles.TitleSectionReviewsH5>Latest Review by Customers</dashboardMainStyles.TitleSectionReviewsH5>
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
                    {clientAll.map((client, index) => {
                        return <SwiperSlide key={index}>
                            <ArticleReview
                                title={client.full_name}
                                timeSince={`${formatDateForPrint(client.publish_date)}`}
                                textReview={client.comment}
                            />
                        </SwiperSlide>
                    })}
                </Swiper>
                {/* </dashboardJS.SwiperCustom> */}
            </dashboardMainStyles.SectionReviews>

        </dashboardMainStyles.SectionPageDashboard >
    )

}