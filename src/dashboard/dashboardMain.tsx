
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
import { getContactAllData, getContactAllStatus } from "../contact/features/contactSlice"
import { ContactFetchAllThunk } from "../contact/features/thunks/contactFetchAllThunk"
import { BookingInterfaceRoom } from "../booking/interfaces/bookingInterface"
import { ContactInterface } from "../contact/interfaces/contactInterface"


export const DashboardMain = () => {

    const dispatch = useDispatch<AppDispatch>()
    const bookingAll: BookingInterfaceRoom[] = useSelector(getBookingAllData)
    const bookingAllLoading: ApiStatus = useSelector(getBookingAllStatus)
    const contactAll: ContactInterface[] = useSelector(getContactAllData)
    const contactAllLoading: ApiStatus = useSelector(getContactAllStatus)

    useEffect(() => {
        if (bookingAllLoading === ApiStatus.idle) { dispatch(BookingFetchAllThunk()) }
        else if (bookingAllLoading === ApiStatus.fulfilled) { }
        else if (bookingAllLoading === ApiStatus.rejected) { alert("Error en la api de dashboard > bookings") }
    }, [bookingAllLoading, bookingAll])
    useEffect(() => {
        if (contactAllLoading === ApiStatus.idle) { dispatch(ContactFetchAllThunk()) }
        else if (contactAllLoading === ApiStatus.fulfilled) { }
        else if (contactAllLoading === ApiStatus.rejected) { alert("Error en la api de dashboard > contacts") }
    }, [contactAllLoading, contactAll])


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
                    slidesPerView={contactAll.length === 1 ? 1 : contactAll.length === 2 ? 2 : 3}
                    navigation={false}
                    pagination={{ clickable: true }}
                    loop={true}
                >
                    {contactAll.map((contact, index) => {
                        return <SwiperSlide key={index}>
                            <ArticleReview
                                nameProfile={contact.full_name}
                                timeSince={`${formatDateForPrint(contact.publish_date)}`}
                                textReview={contact.comment}
                            />
                        </SwiperSlide>
                    })}
                </Swiper>
                {/* </dashboardJS.SwiperCustom> */}
            </dashboardMainStyles.SectionReviews>

        </dashboardMainStyles.SectionPageDashboard >
    )

}