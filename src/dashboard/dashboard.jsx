
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { Swiper, SwiperSlide } from 'swiper/react'

import * as dashboardJS from "./dashboard.js"
import { ArticleReview } from "../common/components/articleReview/articleReview.jsx"
import { getBookingAllData, getBookingAllStatus, getBookingError } from '../booking/features/bookingSlice.js'
import { BookingFetchAllThunk } from '../booking/features/thunks/bookingFetchAllThunk.js'

export const Dashboard = () => {

    const bookingAll = useSelector(getBookingAllData)
    const bookingAllLoading = useSelector(getBookingAllStatus)

    const dispatch = useDispatch()
    useEffect(() => {
        if (bookingAllLoading === "idle") { dispatch(BookingFetchAllThunk()) }
        else if (bookingAllLoading === "fulfilled") { }
        else if (bookingAllLoading === "rejected") { alert("Error en la api de bookings") }
    }, [bookingAllLoading, bookingAll])

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
                    <SwiperSlide>
                        <ArticleReview
                            nameprofile="Pedro Sánchez"
                            timesince="4m"
                            textreview="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam"
                        />
                    </SwiperSlide>
                    <SwiperSlide>
                        <ArticleReview
                            nameprofile="Perro Sánchez"
                            timesince="5m"
                            textreview="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam"
                        />
                    </SwiperSlide>
                    <SwiperSlide>
                        <ArticleReview
                            nameprofile="Pablo Sales"
                            timesince="7m"
                            textreview="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam"
                        />
                    </SwiperSlide>
                    <SwiperSlide>
                        <ArticleReview
                            nameprofile="Pedro Sánchez"
                            timesince="4m"
                            textreview="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam"
                        />
                    </SwiperSlide>
                    <SwiperSlide>
                        <ArticleReview
                            nameprofile="Perro Sánchez"
                            timesince="5m"
                            textreview="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam"
                        />
                    </SwiperSlide>
                    <SwiperSlide>
                        <ArticleReview
                            nameprofile="Pablo Sales"
                            timesince="7m"
                            textreview="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam"
                        />
                    </SwiperSlide>
                </Swiper>
                {/* </dashboardJS.SwiperCustom> */}
            </dashboardJS.SectionReviews>

        </dashboardJS.SectionPageDashboard>

    )
}