
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams } from "react-router-dom"

import * as gb from '../../../common/styles/globalVars.js'
import * as bookingDetailsJS from "./bookingDetails.js"
import { amenities } from '../../../room/data/roomAmenitiesData.json'
import { applyDiscount } from '../../../common/utils/tableUtils.js'
import { getBookingIdData, getBookingIdStatus, getBookingError } from "../../../bookings/features/bookingSlice.js"
import { BookingFetchByIDThunk } from "../../../bookings/features/thunks/bookingFetchByIDThunk.js"
import { getRoomIdData, getRoomIdStatus, getRoomError } from '../../../room/features/roomSlice.js'
import { RoomFetchByIDThunk } from '../../../room/features/thunks/roomFetchByIDThunk.js'


export const BookingDetails = () => {

    const { id } = useParams()
    const bookingById = useSelector(getBookingIdData)
    const bookingByIdLoading = useSelector(getBookingIdStatus)
    const roomById = useSelector(getRoomIdData)
    const roomByIdLoading = useSelector(getRoomIdStatus)
    const amenitiesWithIcon = ["Free Wifi", "3 Bed Space", "24 Hours Guard"]

    const dispatch = useDispatch()
    useEffect(() => {
        if (bookingByIdLoading === "idle") { dispatch(BookingFetchByIDThunk(parseInt(id))) }
        else if (bookingByIdLoading === "fulfilled") {
            if (roomByIdLoading === "idle") { dispatch(RoomFetchByIDThunk(parseInt(bookingById.room_id))) }
            else if (roomByIdLoading === "fulfilled") { }
            else if (roomByIdLoading === "rejected") { alert("Error en la api de rooms") }
        }
        else if (bookingByIdLoading === "rejected") { alert("Error en la api de bookings") }
    }, [bookingByIdLoading, bookingById, roomByIdLoading, roomById])


    return (

        <bookingDetailsJS.SectionPageBookingDetails>
            <bookingDetailsJS.DivSection padding='2em'>
                <bookingDetailsJS.DivCtnImgAndMainData>
                    <bookingDetailsJS.ImgProfile src={bookingById.photo} />
                    <bookingDetailsJS.DivCtnMainData>
                        <bookingDetailsJS.DivCtnNameId>
                            <bookingDetailsJS.NameProfileH2>{bookingById.full_name_guest}</bookingDetailsJS.NameProfileH2>
                            <bookingDetailsJS.SubTittleH4 color={`${gb.colorGreen}`}>ID Booking: #{bookingById.id}</bookingDetailsJS.SubTittleH4>
                        </bookingDetailsJS.DivCtnNameId>
                        <bookingDetailsJS.DivCtnContactMessage>
                            <bookingDetailsJS.IconPhone />
                            <bookingDetailsJS.ButtonSendMessage>
                                <bookingDetailsJS.IconChat />
                                Send Message
                            </bookingDetailsJS.ButtonSendMessage>
                        </bookingDetailsJS.DivCtnContactMessage>
                    </bookingDetailsJS.DivCtnMainData>
                    <bookingDetailsJS.IconOptions />
                </bookingDetailsJS.DivCtnImgAndMainData>

                <bookingDetailsJS.DivCheckInOut>
                    <bookingDetailsJS.Div50PercentageSection>
                        <bookingDetailsJS.SubTittleH4 color={`${gb.colorGraySubTitleBookingDetails}`}>
                            Check In
                        </bookingDetailsJS.SubTittleH4>
                        <bookingDetailsJS.SubTittleH4 paddingtop='1em' color={`${gb.colorBlack26}`}>
                            {bookingById.check_in_date} | {bookingById.check_in_time}
                        </bookingDetailsJS.SubTittleH4>
                    </bookingDetailsJS.Div50PercentageSection>
                    <bookingDetailsJS.Div50PercentageSection>
                        <bookingDetailsJS.SubTittleH4 color={`${gb.colorGraySubTitleBookingDetails}`}>
                            Check Out
                        </bookingDetailsJS.SubTittleH4>
                        <bookingDetailsJS.SubTittleH4 paddingtop='1em' color={`${gb.colorBlack26}`}>
                            {bookingById.check_out_date} | {bookingById.check_out_time}
                        </bookingDetailsJS.SubTittleH4>
                    </bookingDetailsJS.Div50PercentageSection>
                </bookingDetailsJS.DivCheckInOut>

                <bookingDetailsJS.DivCtnInfo>
                    <bookingDetailsJS.Div50PercentageSection>
                        <bookingDetailsJS.SubTittleH4 color={`${gb.colorGraySubTitleBookingDetails}`}>
                            Room Info
                        </bookingDetailsJS.SubTittleH4>
                        <bookingDetailsJS.SubTittleH4 paddingtop='0.5em' fontsize='1.25em' color={`${gb.colorBlack26}`}>
                            Room Nº {bookingById.room_id}
                            <br />
                            {bookingById.room_type}
                        </bookingDetailsJS.SubTittleH4>
                    </bookingDetailsJS.Div50PercentageSection>
                    <bookingDetailsJS.Div50PercentageSection>
                        <bookingDetailsJS.SubTittleH4 color={`${gb.colorGraySubTitleBookingDetails}`}>
                            Price
                        </bookingDetailsJS.SubTittleH4>
                        <bookingDetailsJS.SubTittleH4 paddingtop='0.5em' fontsize='1.25em' color={`${gb.colorBlack26}`}>
                            <del>${roomById.price} /night</del>
                            <br />
                            ${applyDiscount(roomById.price, roomById.discount)} /night (-{roomById.discount}%)
                        </bookingDetailsJS.SubTittleH4>
                    </bookingDetailsJS.Div50PercentageSection>
                </bookingDetailsJS.DivCtnInfo>

                <bookingDetailsJS.PTextInfo>
                    {bookingById.special_request}
                </bookingDetailsJS.PTextInfo>

                <bookingDetailsJS.DivCtnFacilities>
                    <bookingDetailsJS.SubTittleH4 color={`${gb.colorGraySubTitleBookingDetails}`} fontsize='1em'>Facilities</bookingDetailsJS.SubTittleH4>
                    {console.log(roomById.amenities)}
                    {Array.isArray(roomById.amenities) ? (
                        roomById.amenities.map((amenity, index) => {
                            switch (amenity) {
                                case "3 Bed Space":
                                    return (
                                        <bookingDetailsJS.ButtonFacility key={index} withicon='true'>
                                            3 Bed Space
                                            <bookingDetailsJS.IconBed />
                                        </bookingDetailsJS.ButtonFacility>
                                    )
                                case "24 Hours Guard":
                                    return (
                                        <bookingDetailsJS.ButtonFacility key={index} withicon='true'>
                                            24 Hours Guard
                                            <bookingDetailsJS.IconShieldCheck />
                                        </bookingDetailsJS.ButtonFacility>
                                    )
                                case "WiFi":
                                    return (
                                        <bookingDetailsJS.ButtonFacility key={index} withicon='true'>
                                            Wifi
                                            <bookingDetailsJS.IconWiFi />
                                        </bookingDetailsJS.ButtonFacility>
                                    )
                                default:
                                    return (
                                        <bookingDetailsJS.ButtonFacility key={index}>
                                            {amenity}
                                        </bookingDetailsJS.ButtonFacility>
                                    )
                            }
                        })
                    ) :
                        (<bookingDetailsJS.SubTittleH4 fontsize='1em' color={`${gb.colorBlack26}`}>
                            No amenities available
                        </bookingDetailsJS.SubTittleH4>)
                    }
                </bookingDetailsJS.DivCtnFacilities>
            </bookingDetailsJS.DivSection>

            <bookingDetailsJS.DivSection>
                <bookingDetailsJS.ImgRoom src="http://dummyimage.com/816x989.png/cc0000/ffffff" />
            </bookingDetailsJS.DivSection>
        </bookingDetailsJS.SectionPageBookingDetails>

    )
}