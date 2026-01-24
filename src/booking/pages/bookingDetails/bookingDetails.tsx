
import React, { useState } from "react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { useParams } from "react-router-dom"

import * as bookingDetailsStyles from "./bookingDetailsStyles"
import { BookingInterfaceId } from "../../interfaces/bookingInterface"
import { CtnMenuOptions, CtnOptionsDisplayed, ButtonOption } from "../../../common/styles/tableStyles"
import { AppDispatch } from "../../../common/redux/store"
import { formatDateForPrint } from "../../../common/utils/dateUtils"
import { ApiStatus } from "../../../common/enums/ApiStatus"
import { RoomAmenities } from "../../../room/enums/roomAmenities"
import { applyDiscount } from '../../../common/utils/tableUtils'
import { getBookingIdData, getBookingIdStatus } from "../../../booking/features/bookingSlice"
import { BookingFetchByIDThunk } from "../../../booking/features/thunks/bookingFetchByIDThunk"
import { BookingDeleteByIdThunk } from "../../features/thunks/bookingDeleteByIdThunk"


export const BookingDetails = () => {

    const navigate = useNavigate()
    const navigateBackToBookings = () => navigate('../')
    const dispatch = useDispatch<AppDispatch>()
    const { id } = useParams()
    const idParams = id!
    const bookingById: BookingInterfaceId = useSelector(getBookingIdData)
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
                    {/* !!! TENDRÁ QUE SER LA FOTOS/FOTOS DE LA ROOM ASOCIADA: */}
                    {/* <bookingDetailsStyles.ImgProfile src={bookingById.photo} /> */}
                    <bookingDetailsStyles.DivCtnMainData>
                        <bookingDetailsStyles.DivCtnNameId>
                            {/* !!! TENDRÁ QUE SER EL NOMBRE DEL CLIENTE ASOCIADO */}
                            <bookingDetailsStyles.NameProfileH2>{bookingById.client_id}</bookingDetailsStyles.NameProfileH2>
                            <bookingDetailsStyles.SubTittleH4 isId={true}>ID Booking: #{bookingById._id}</bookingDetailsStyles.SubTittleH4>
                        </bookingDetailsStyles.DivCtnNameId>
                        <bookingDetailsStyles.DivCtnClientMessage>
                            <bookingDetailsStyles.IconPhone />
                            <bookingDetailsStyles.ButtonSendMessage>
                                <bookingDetailsStyles.IconChat />
                                Send Message
                            </bookingDetailsStyles.ButtonSendMessage>
                        </bookingDetailsStyles.DivCtnClientMessage>
                    </bookingDetailsStyles.DivCtnMainData>


                    <bookingDetailsStyles.IconOptions onClick={() => { switchDisplayMenuOptions() }} />
                    <CtnOptionsDisplayed display={`${optionsDisplayed ? 'flex' : 'none'}`} isInTable={false}>
                        <ButtonOption onClick={() => { navigateBackToBookings() }}>Go to bookings</ButtonOption>
                        <ButtonOption onClick={() => { deleteThisBooking() }}>Delete</ButtonOption>
                    </CtnOptionsDisplayed>


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
                            {/* !!! TENDRÁ QUE SER LOS NÚMEROS DE LAS ROOMS ASOCIADAS */}
                            {/* Room Nº {bookingById.room_data?.number} */}
                            <br />
                            {/* !!! TENDRÁ QUE SER LOS TIPOS DE LAS ROOMS ASOCIADAS */}
                            {/* {bookingById.room_data?.type} */}
                        </bookingDetailsStyles.SubTittleH4>
                    </bookingDetailsStyles.Div50PercentageSection>
                    <bookingDetailsStyles.Div50PercentageSection>
                        <bookingDetailsStyles.SubTittleH4 isId={true}>
                            Price
                        </bookingDetailsStyles.SubTittleH4>
                        <bookingDetailsStyles.SubTittleH4 paddingtop='0.5em' fontsize='1.25em'>
                            <del>${bookingById.price} /night</del>
                            <br />
                            {/* !!! TENDRÁ QUE SER LOS DESCUENTOS DE LAS ROOMS ASOCIADAS */}
                            {/* ${applyDiscount(bookingById.price, bookingById.room_data?.discount)} /night (-{bookingById.room_data?.discount}%) */}
                        </bookingDetailsStyles.SubTittleH4>
                    </bookingDetailsStyles.Div50PercentageSection>
                </bookingDetailsStyles.DivCtnInfo>

                <bookingDetailsStyles.PTextInfo>
                    {bookingById.special_request}
                </bookingDetailsStyles.PTextInfo>

                <bookingDetailsStyles.DivCtnFacilities>
                    <bookingDetailsStyles.SubTittleH4 isId={true} fontsize='1em'>Facilities</bookingDetailsStyles.SubTittleH4>
                    {/* !!! */}
                    {/* {Array.isArray(bookingById.room_data?.amenities) ? (
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
                    } */}
                </bookingDetailsStyles.DivCtnFacilities>
            </bookingDetailsStyles.DivSection>

            <bookingDetailsStyles.DivSection>
                {/* !!! LA FOTO PRINCIPAL DE CADA ROOM ASOCIADA: */}
                {/* <bookingDetailsStyles.ImgRoom src={bookingById.room_data_list[0].photos[0]} /> */}
            </bookingDetailsStyles.DivSection>
        </bookingDetailsStyles.SectionPageBookingDetails>
    )
}