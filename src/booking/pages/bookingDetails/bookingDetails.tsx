
import React from "react"
import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams } from "react-router-dom"

import * as gb from '../../../common/styles/globalVars.ts'
import * as bookingDetailsStyles from "./bookingDetailsStyles.ts"
import { AppDispatch } from "../../../common/redux/store.ts"
import { ApiStatus } from "../../../common/enums/ApiStatus.ts"
import { RoomAmenities } from "../../../room/data/roomAmenities.ts"
import { applyDiscount } from '../../../common/utils/tableUtils.ts'
import { getBookingIdData, getBookingIdStatus } from "../../../booking/features/bookingSlice.ts"
import { BookingFetchByIDThunk } from "../../../booking/features/thunks/bookingFetchByIDThunk.ts"
import { getRoomIdData, getRoomIdStatus } from '../../../room/features/roomSlice.ts'
import { RoomFetchByIDThunk } from '../../../room/features/thunks/roomFetchByIDThunk.ts'


export const BookingDetails = () => {

    const dispatch = useDispatch<AppDispatch>()
    const { id } = useParams()
    const idParams = parseInt(id!)
    const bookingById = useSelector(getBookingIdData)
    const bookingByIdLoading = useSelector(getBookingIdStatus)
    const roomById = useSelector(getRoomIdData)
    const roomByIdLoading = useSelector(getRoomIdStatus)

    useEffect(() => {
        if (bookingByIdLoading === ApiStatus.idle) { dispatch(BookingFetchByIDThunk(idParams)) }
        else if (bookingByIdLoading === ApiStatus.fulfilled) {
            if (roomByIdLoading === ApiStatus.idle) { dispatch(RoomFetchByIDThunk(bookingById.room_id)) }
            else if (roomByIdLoading === ApiStatus.fulfilled) { }
            else if (roomByIdLoading === ApiStatus.rejected) { alert("Error en la api de rooms") }
        }
        else if (bookingByIdLoading === ApiStatus.rejected) { alert("Error en la api de bookings") }
    }, [bookingByIdLoading, bookingById, roomByIdLoading, roomById])
    useEffect(() => {
        dispatch(BookingFetchByIDThunk(idParams))
    }, [id])
    useEffect(() => {
        dispatch(RoomFetchByIDThunk(bookingById.room_id))
    }, [bookingById])


    return (

        <bookingDetailsStyles.SectionPageBookingDetails>
            <bookingDetailsStyles.DivSection padding='2em'>
                <bookingDetailsStyles.DivCtnImgAndMainData>
                    <bookingDetailsStyles.ImgProfile src={bookingById.photo} />
                    <bookingDetailsStyles.DivCtnMainData>
                        <bookingDetailsStyles.DivCtnNameId>
                            <bookingDetailsStyles.NameProfileH2>{bookingById.full_name_guest}</bookingDetailsStyles.NameProfileH2>
                            <bookingDetailsStyles.SubTittleH4 color={`${gb.colorGreen}`}>ID Booking: #{bookingById.id}</bookingDetailsStyles.SubTittleH4>
                        </bookingDetailsStyles.DivCtnNameId>
                        <bookingDetailsStyles.DivCtnContactMessage>
                            <bookingDetailsStyles.IconPhone />
                            <bookingDetailsStyles.ButtonSendMessage>
                                <bookingDetailsStyles.IconChat />
                                Send Message
                            </bookingDetailsStyles.ButtonSendMessage>
                        </bookingDetailsStyles.DivCtnContactMessage>
                    </bookingDetailsStyles.DivCtnMainData>
                    <bookingDetailsStyles.IconOptions />
                </bookingDetailsStyles.DivCtnImgAndMainData>

                <bookingDetailsStyles.DivCheckInOut>
                    <bookingDetailsStyles.Div50PercentageSection>
                        <bookingDetailsStyles.SubTittleH4 color={`${gb.colorGraySubTitleBookingDetails}`}>
                            Check In
                        </bookingDetailsStyles.SubTittleH4>
                        <bookingDetailsStyles.SubTittleH4 paddingtop='1em' color={`${gb.colorBlack26}`}>
                            {bookingById.check_in_date} | {bookingById.check_in_time}
                        </bookingDetailsStyles.SubTittleH4>
                    </bookingDetailsStyles.Div50PercentageSection>
                    <bookingDetailsStyles.Div50PercentageSection>
                        <bookingDetailsStyles.SubTittleH4 color={`${gb.colorGraySubTitleBookingDetails}`}>
                            Check Out
                        </bookingDetailsStyles.SubTittleH4>
                        <bookingDetailsStyles.SubTittleH4 paddingtop='1em' color={`${gb.colorBlack26}`}>
                            {bookingById.check_out_date} | {bookingById.check_out_time}
                        </bookingDetailsStyles.SubTittleH4>
                    </bookingDetailsStyles.Div50PercentageSection>
                </bookingDetailsStyles.DivCheckInOut>

                <bookingDetailsStyles.DivCtnInfo>
                    <bookingDetailsStyles.Div50PercentageSection>
                        <bookingDetailsStyles.SubTittleH4 color={`${gb.colorGraySubTitleBookingDetails}`}>
                            Room Info
                        </bookingDetailsStyles.SubTittleH4>
                        <bookingDetailsStyles.SubTittleH4 paddingtop='0.5em' fontsize='1.25em' color={`${gb.colorBlack26}`}>
                            Room Nº {bookingById.room_id}
                            <br />
                            {bookingById.room_type}
                        </bookingDetailsStyles.SubTittleH4>
                    </bookingDetailsStyles.Div50PercentageSection>
                    <bookingDetailsStyles.Div50PercentageSection>
                        <bookingDetailsStyles.SubTittleH4 color={`${gb.colorGraySubTitleBookingDetails}`}>
                            Price
                        </bookingDetailsStyles.SubTittleH4>
                        <bookingDetailsStyles.SubTittleH4 paddingtop='0.5em' fontsize='1.25em' color={`${gb.colorBlack26}`}>
                            <del>${roomById.price} /night</del>
                            <br />
                            ${applyDiscount(roomById.price, roomById.discount)} /night (-{roomById.discount}%)
                        </bookingDetailsStyles.SubTittleH4>
                    </bookingDetailsStyles.Div50PercentageSection>
                </bookingDetailsStyles.DivCtnInfo>

                <bookingDetailsStyles.PTextInfo>
                    {bookingById.special_request}
                </bookingDetailsStyles.PTextInfo>

                <bookingDetailsStyles.DivCtnFacilities>
                    <bookingDetailsStyles.SubTittleH4 color={`${gb.colorGraySubTitleBookingDetails}`} fontsize='1em'>Facilities</bookingDetailsStyles.SubTittleH4>
                    {Array.isArray(roomById.amenities) ? (
                        roomById.amenities.map((amenity, index) => {
                            switch (amenity) {
                                case RoomAmenities.bedSpace3:
                                    return (
                                        <bookingDetailsStyles.ButtonFacility key={index} withicon='true'>
                                            3 Bed Space
                                            <bookingDetailsStyles.IconBed />
                                        </bookingDetailsStyles.ButtonFacility>
                                    )
                                case RoomAmenities.guard24Hours:
                                    return (
                                        <bookingDetailsStyles.ButtonFacility key={index} withicon='true'>
                                            24 Hours Guard
                                            <bookingDetailsStyles.IconShieldCheck />
                                        </bookingDetailsStyles.ButtonFacility>
                                    )
                                case RoomAmenities.wiFi:
                                    return (
                                        <bookingDetailsStyles.ButtonFacility key={index} withicon='true'>
                                            Wifi
                                            <bookingDetailsStyles.IconWiFi />
                                        </bookingDetailsStyles.ButtonFacility>
                                    )
                                default:
                                    return (
                                        <bookingDetailsStyles.ButtonFacility key={index}>
                                            {amenity}
                                        </bookingDetailsStyles.ButtonFacility>
                                    )
                            }
                        })
                    ) :
                        (<bookingDetailsStyles.SubTittleH4 fontsize='1em' color={`${gb.colorBlack26}`}>
                            No amenities available
                        </bookingDetailsStyles.SubTittleH4>)
                    }
                </bookingDetailsStyles.DivCtnFacilities>
            </bookingDetailsStyles.DivSection>

            <bookingDetailsStyles.DivSection>
                <bookingDetailsStyles.ImgRoom src="http://dummyimage.com/816x989.png/cc0000/ffffff" />
            </bookingDetailsStyles.DivSection>
        </bookingDetailsStyles.SectionPageBookingDetails>

    )
}