
import React, { useState } from "react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { useParams } from "react-router-dom"

import * as bookingDetailsStyles from "./bookingDetailsStyles.ts"
import { BookingInterfaceRoom } from "../../interfaces/bookingInterface.ts"
import { DivCtnOptions, ButtonOption } from "../../../common/styles/tableStyles.ts"
import { AppDispatch } from "../../../common/redux/store.ts"
import { formatDateForPrint } from "../../../common/utils/dateUtils.ts"
import { ApiStatus } from "../../../common/enums/ApiStatus.ts"
import { RoomAmenities } from "../../../room/data/roomAmenities.ts"
import { applyDiscount } from '../../../common/utils/tableUtils.ts'
import { getBookingIdData, getBookingIdStatus } from "../../../booking/features/bookingSlice.ts"
import { BookingFetchByIDThunk } from "../../../booking/features/thunks/bookingFetchByIDThunk.ts"
import { BookingDeleteByIdThunk } from "../../features/thunks/bookingDeleteByIdThunk.ts"


export const BookingDetails = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const { id } = useParams()
    const idParams = parseInt(id!)
    const bookingById: BookingInterfaceRoom = useSelector(getBookingIdData)
    const bookingByIdLoading: ApiStatus = useSelector(getBookingIdStatus)
    const [optionsDisplayed, setOptionsDisplayed] = useState<boolean>(false)

    useEffect(() => {
        if (bookingByIdLoading === ApiStatus.idle) { dispatch(BookingFetchByIDThunk(idParams)) }
        else if (bookingByIdLoading === ApiStatus.fulfilled) {
            if (bookingById._id !== idParams) {
                dispatch(BookingFetchByIDThunk(idParams))
            }
        }
        else if (bookingByIdLoading === ApiStatus.rejected) { alert("Error in API bookings > booking details") }
    }, [bookingByIdLoading, bookingById, id])

    const navigateBackToBookings = () => navigate('../')

    const switchDisplayMenuOptions = (): void => {
        setOptionsDisplayed(!optionsDisplayed)
    }
    const deleteThisBooking = (): void => {
        dispatch(BookingDeleteByIdThunk(bookingById._id))
        navigateBackToBookings()
    }


    return (
        <bookingDetailsStyles.SectionPageBookingDetails>
            <bookingDetailsStyles.DivSection padding='2em'>
                <bookingDetailsStyles.DivCtnImgAndMainData>
                    <bookingDetailsStyles.ImgProfile src={bookingById.photo} />
                    <bookingDetailsStyles.DivCtnMainData>
                        <bookingDetailsStyles.DivCtnNameId>
                            <bookingDetailsStyles.NameProfileH2>{bookingById.full_name_guest}</bookingDetailsStyles.NameProfileH2>
                            <bookingDetailsStyles.SubTittleH4 isId={true}>ID Booking: #{bookingById._id}</bookingDetailsStyles.SubTittleH4>
                        </bookingDetailsStyles.DivCtnNameId>
                        <bookingDetailsStyles.DivCtnContactMessage>
                            <bookingDetailsStyles.IconPhone />
                            <bookingDetailsStyles.ButtonSendMessage>
                                <bookingDetailsStyles.IconChat />
                                Send Message
                            </bookingDetailsStyles.ButtonSendMessage>
                        </bookingDetailsStyles.DivCtnContactMessage>
                    </bookingDetailsStyles.DivCtnMainData>


                    <bookingDetailsStyles.IconOptions onClick={() => { switchDisplayMenuOptions() }} />
                    <DivCtnOptions display={`${optionsDisplayed ? 'flex' : 'none'}`} isInTable={false}>
                        <ButtonOption onClick={() => { navigateBackToBookings() }}>Go to bookings</ButtonOption>
                        <ButtonOption onClick={() => { deleteThisBooking() }}>Delete</ButtonOption>
                    </DivCtnOptions>


                </bookingDetailsStyles.DivCtnImgAndMainData>

                <bookingDetailsStyles.DivCheckInOut>
                    <bookingDetailsStyles.Div50PercentageSection>
                        <bookingDetailsStyles.SubTittleH4 isId={true}>
                            Check In
                        </bookingDetailsStyles.SubTittleH4>
                        <bookingDetailsStyles.SubTittleH4 paddingtop='1em'>
                            {formatDateForPrint(bookingById.check_in_date)}
                        </bookingDetailsStyles.SubTittleH4>
                    </bookingDetailsStyles.Div50PercentageSection>
                    <bookingDetailsStyles.Div50PercentageSection>
                        <bookingDetailsStyles.SubTittleH4 isId={true}>
                            Check Out
                        </bookingDetailsStyles.SubTittleH4>
                        <bookingDetailsStyles.SubTittleH4 paddingtop='1em'>
                            {formatDateForPrint(bookingById.check_out_date)}
                        </bookingDetailsStyles.SubTittleH4>
                    </bookingDetailsStyles.Div50PercentageSection>
                </bookingDetailsStyles.DivCheckInOut>

                <bookingDetailsStyles.DivCtnInfo>
                    <bookingDetailsStyles.Div50PercentageSection>
                        <bookingDetailsStyles.SubTittleH4 isId={true}>
                            Room Info
                        </bookingDetailsStyles.SubTittleH4>
                        <bookingDetailsStyles.SubTittleH4 paddingtop='0.5em' fontsize='1.25em'>
                            Room Nº {bookingById.room_data?.number}
                            <br />
                            {bookingById.room_data?.type}
                        </bookingDetailsStyles.SubTittleH4>
                    </bookingDetailsStyles.Div50PercentageSection>
                    <bookingDetailsStyles.Div50PercentageSection>
                        <bookingDetailsStyles.SubTittleH4 isId={true}>
                            Price
                        </bookingDetailsStyles.SubTittleH4>
                        <bookingDetailsStyles.SubTittleH4 paddingtop='0.5em' fontsize='1.25em'>
                            <del>${bookingById.room_data?.price} /night</del>
                            <br />
                            ${applyDiscount(bookingById.room_data?.price, bookingById.room_data?.discount)} /night (-{bookingById.room_data?.discount}%)
                        </bookingDetailsStyles.SubTittleH4>
                    </bookingDetailsStyles.Div50PercentageSection>
                </bookingDetailsStyles.DivCtnInfo>

                <bookingDetailsStyles.PTextInfo>
                    {bookingById.special_request}
                </bookingDetailsStyles.PTextInfo>

                <bookingDetailsStyles.DivCtnFacilities>
                    <bookingDetailsStyles.SubTittleH4 isId={true} fontsize='1em'>Facilities</bookingDetailsStyles.SubTittleH4>
                    {Array.isArray(bookingById.room_data?.amenities) ? (
                        bookingById.room_data?.amenities.map((amenity, index) => {
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
                        (<bookingDetailsStyles.SubTittleH4 fontsize='1em'>
                            No amenities available
                        </bookingDetailsStyles.SubTittleH4>)
                    }
                </bookingDetailsStyles.DivCtnFacilities>
            </bookingDetailsStyles.DivSection>

            <bookingDetailsStyles.DivSection>
                <bookingDetailsStyles.ImgRoom src={bookingById.room_data?.photos[0]} />
            </bookingDetailsStyles.DivSection>
        </bookingDetailsStyles.SectionPageBookingDetails>
    )
}