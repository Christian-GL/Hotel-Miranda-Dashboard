
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { Swiper, SwiperSlide } from 'swiper/react'

import * as dashboardJS from "./dashboard.js"
import { ArticleReview } from "../common/components/articleReview/articleReview.tsx"
import { getBookingAllData, getBookingAllStatus, getBookingError } from '../booking/features/bookingSlice.js'
import { BookingFetchAllThunk } from '../booking/features/thunks/bookingFetchAllThunk.js'
import { getContactAllData, getContactAllStatus } from "../contact/features/contactSlice.ts"
import { ContactFetchAllThunk } from "../contact/features/thunks/contactFetchAllThunk.ts"


export const Dashboard = () => {

    const bookingAll = useSelector(getBookingAllData)
    const bookingAllLoading = useSelector(getBookingAllStatus)
    const contactAll = useSelector(getContactAllData)
    const contactAllLoading = useSelector(getContactAllStatus)

    const dispatch = useDispatch()
    useEffect(() => {
        if (bookingAllLoading === "idle") { dispatch(BookingFetchAllThunk()) }
        else if (bookingAllLoading === "fulfilled") { }
        else if (bookingAllLoading === "rejected") { alert("Error en la api de bookings") }
    }, [bookingAllLoading, bookingAll])
    useEffect(() => {
        if (contactAllLoading === "idle") { dispatch(ContactFetchAllThunk()) }
        else if (contactAllLoading === "fulfilled") { }
        else if (contactAllLoading === "rejected") { alert("Error en la api") }
    }, [contactAllLoading, contactAll])

    return (

        <dashboardJS.SectionPageDashboard>

            <dashboardJS.SectionKPIs>
                <dashboardJS.ArticleKPI>
                    <dashboardJS.IconBooking />
                    <dashboardJS.DivCtnInfo>
                        <dashboardJS.NumberH4>{bookingAll.length}</dashboardJS.NumberH4>
                        <dashboardJS.TextH5>New Bookings</dashboardJS.TextH5>
                    </dashboardJS.DivCtnInfo>
                </dashboardJS.ArticleKPI>
                <dashboardJS.ArticleKPI>
                    <dashboardJS.IconLogIn />
                    <dashboardJS.DivCtnInfo>
                        <dashboardJS.NumberH4>
                            {bookingAll.filter(booking =>
                                booking.room_booking_status === 'Check In'
                            ).length}
                        </dashboardJS.NumberH4>
                        <dashboardJS.TextH5>Check in</dashboardJS.TextH5>
                    </dashboardJS.DivCtnInfo>
                </dashboardJS.ArticleKPI>
                <dashboardJS.ArticleKPI>
                    <dashboardJS.IconCalendar />
                    <dashboardJS.DivCtnInfo>
                        <dashboardJS.NumberH4>
                            {bookingAll.filter(booking =>
                                booking.room_booking_status === 'In Progress'
                            ).length}
                        </dashboardJS.NumberH4>
                        <dashboardJS.TextH5>In Progress</dashboardJS.TextH5>
                    </dashboardJS.DivCtnInfo>
                </dashboardJS.ArticleKPI>
                <dashboardJS.ArticleKPI>
                    <dashboardJS.IconLogOut />
                    <dashboardJS.DivCtnInfo>
                        <dashboardJS.NumberH4>
                            {bookingAll.filter(booking =>
                                booking.room_booking_status === 'Check Out'
                            ).length}
                        </dashboardJS.NumberH4>
                        <dashboardJS.TextH5>Check Out</dashboardJS.TextH5>
                    </dashboardJS.DivCtnInfo>
                </dashboardJS.ArticleKPI>
            </dashboardJS.SectionKPIs>

            <dashboardJS.SectionReviews>
                <dashboardJS.TitleSectionReviewsH5>Latest Review by Customers</dashboardJS.TitleSectionReviewsH5>
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
                    slidesPerView={3}
                    navigation={false}
                    pagination={{ clickable: true }}
                    loop={true}
                >
                    {contactAll.map((contact, index) => {
                        return <SwiperSlide key={index}>
                            <ArticleReview
                                nameProfile={contact.full_name}
                                timeSince={`${contact.publish_date} - ${contact.publish_time}`}
                                textReview={contact.comment}
                            />
                        </SwiperSlide>
                    })}
                </Swiper>
                {/* </dashboardJS.SwiperCustom> */}
            </dashboardJS.SectionReviews>

        </dashboardJS.SectionPageDashboard>

    )
}