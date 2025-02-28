
import React from "react"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Swiper, SwiperSlide } from 'swiper/react'

import * as dashboardStyles from "./dashboardStyles.ts"
import { AppDispatch } from '../common/redux/store.ts'
import { ApiStatus } from "../common/enums/ApiStatus.ts"
import { ArticleReview } from "../common/components/articleReview/articleReview.tsx"
import { getBookingAllData, getBookingAllStatus } from '../booking/features/bookingSlice.ts'
import { BookingFetchAllThunk } from '../booking/features/thunks/bookingFetchAllThunk.ts'
import { getContactAllData, getContactAllStatus } from "../contact/features/contactSlice.ts"
import { ContactFetchAllThunk } from "../contact/features/thunks/contactFetchAllThunk.ts"
import { BookingInterface } from "../booking/interfaces/bookingInterface.ts"
import { ContactInterface } from "../contact/interfaces/contactInterface.ts"


export const Dashboard = () => {

    const dispatch = useDispatch<AppDispatch>()
    const bookingAll: BookingInterface[] = useSelector(getBookingAllData)
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
        < dashboardStyles.SectionPageDashboard >

            <dashboardStyles.SectionKPIs>
                <dashboardStyles.ArticleKPI>
                    <dashboardStyles.IconBooking />
                    <dashboardStyles.DivCtnInfo>
                        <dashboardStyles.NumberH4>{bookingAll.length}</dashboardStyles.NumberH4>
                        <dashboardStyles.TextH5>New Bookings</dashboardStyles.TextH5>
                    </dashboardStyles.DivCtnInfo>
                </dashboardStyles.ArticleKPI>
                <dashboardStyles.ArticleKPI>
                    <dashboardStyles.IconLogIn />
                    <dashboardStyles.DivCtnInfo>
                        <dashboardStyles.NumberH4>
                            {bookingAll.filter(booking =>
                                booking.status === 'Check In'
                            ).length}
                        </dashboardStyles.NumberH4>
                        <dashboardStyles.TextH5>Check in</dashboardStyles.TextH5>
                    </dashboardStyles.DivCtnInfo>
                </dashboardStyles.ArticleKPI>
                <dashboardStyles.ArticleKPI>
                    <dashboardStyles.IconCalendar />
                    <dashboardStyles.DivCtnInfo>
                        <dashboardStyles.NumberH4>
                            {bookingAll.filter(booking =>
                                booking.status === 'In Progress'
                            ).length}
                        </dashboardStyles.NumberH4>
                        <dashboardStyles.TextH5>In Progress</dashboardStyles.TextH5>
                    </dashboardStyles.DivCtnInfo>
                </dashboardStyles.ArticleKPI>
                <dashboardStyles.ArticleKPI>
                    <dashboardStyles.IconLogOut />
                    <dashboardStyles.DivCtnInfo>
                        <dashboardStyles.NumberH4>
                            {bookingAll.filter(booking =>
                                booking.status === 'Check Out'
                            ).length}
                        </dashboardStyles.NumberH4>
                        <dashboardStyles.TextH5>Check Out</dashboardStyles.TextH5>
                    </dashboardStyles.DivCtnInfo>
                </dashboardStyles.ArticleKPI>
            </dashboardStyles.SectionKPIs>

            <dashboardStyles.SectionReviews>
                <dashboardStyles.TitleSectionReviewsH5>Latest Review by Customers</dashboardStyles.TitleSectionReviewsH5>
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
                                timeSince={`${contact.publish_date}`}
                                textReview={contact.comment}
                            />
                        </SwiperSlide>
                    })}
                </Swiper>
                {/* </dashboardJS.SwiperCustom> */}
            </dashboardStyles.SectionReviews>

        </dashboardStyles.SectionPageDashboard >
    )

}