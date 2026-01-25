
import React, { useState } from "react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { useParams } from "react-router-dom"

import * as styles from "./bookingDetailsStyles"
import { BookingInterfaceId } from "../../interfaces/bookingInterface"
import { CtnMenuOptions, CtnOptionsDisplayed, ButtonOption } from "../../../common/styles/tableStyles"
import { AppDispatch } from "../../../common/redux/store"
import { formatDateForPrint } from "../../../common/utils/dateUtils"
import { applyDiscount } from '../../../common/utils/tableUtils'
import { customPopupMessage } from '../../../common/utils/customPopupMessage'
import { PopupText } from "../../../common/components/popupText/popupText"
import { PopupTextInterface } from '../../../common/interfaces/popupTextInterface'
import { ToastContainer, toast } from 'react-toastify'
import { ToastifyLoadingData } from "../../../common/components/toastify/loadingDataPopup/toastifyLoadingData"
import { ApiStatus } from "../../../common/enums/ApiStatus"
import { RoomAmenities } from "../../../room/enums/roomAmenities"
import { OptionYesNo } from "../../../common/enums/optionYesNo"
import { getBookingIdData, getBookingIdStatus, getBookingErrorMessage } from "../../../booking/features/bookingSlice"
import { BookingFetchByIDThunk } from "../../features/thunks/bookingFetchByIDThunk"
import { BookingUpdateThunk } from "./../../features/thunks/bookingUpdateThunk"
import { BookingDeleteByIdThunk } from "../../features/thunks/bookingDeleteByIdThunk"
import { getRoomAllData, getRoomAllStatus, getRoomIdData, getRoomIdStatus, getRoomErrorMessage } from "../../../room/features/roomSlice"
import { RoomFetchAllThunk } from "../../../room/features/thunks/roomFetchAllThunk"
import { RoomFetchByIDThunk } from "../../../room/features/thunks/roomFetchByIDThunk"
import { RoomInterfaceId } from "../../../room/interfaces/roomInterface"


export const BookingDetails = () => {

    const navigate = useNavigate()
    const navigateBackToBookings = () => navigate('../')
    const dispatch = useDispatch<AppDispatch>()
    const { id } = useParams()
    const idParams = id!
    const bookingById: BookingInterfaceId = useSelector(getBookingIdData)
    const bookingByIdLoading: ApiStatus = useSelector(getBookingIdStatus)
    const bookingErrorMessage = useSelector(getBookingErrorMessage)
    const roomAll = useSelector(getRoomAllData)
    const roomAllLoading = useSelector(getRoomAllStatus)
    // const roomById = useSelector(getRoomIdData)
    // const roomByIdLoading = useSelector(getRoomIdStatus)
    const roomErrorMessage = useSelector(getRoomErrorMessage)
    const [showPopup, setShowPopup] = useState<boolean>(false)
    const [infoPopup, setInfoPopup] = useState<PopupTextInterface>({ title: '', text: '' })
    const [optionsDisplayed, setOptionsDisplayed] = useState<boolean>(false)
    const [rooms, setRooms] = useState<RoomInterfaceId[]>([])
    const isDataLoading = bookingByIdLoading !== ApiStatus.fulfilled || roomAllLoading !== ApiStatus.fulfilled

    // const roomIndex = rooms.length

    useEffect(() => {
        if (bookingByIdLoading === ApiStatus.idle) { dispatch(BookingFetchByIDThunk(idParams)) }
        else if (bookingByIdLoading === ApiStatus.fulfilled) {
            if (bookingById._id !== idParams) {
                dispatch(BookingFetchByIDThunk(idParams))
            }
        }
        else if (bookingByIdLoading === ApiStatus.rejected && bookingErrorMessage) { customPopupMessage(setInfoPopup, setShowPopup, 'API Error', bookingErrorMessage) }
    }, [bookingByIdLoading, bookingById, id])
    useEffect(() => {
        if (roomAllLoading === ApiStatus.idle) { dispatch(RoomFetchAllThunk()) }
        else if (roomAllLoading === ApiStatus.fulfilled) { }
        else if (roomAllLoading === ApiStatus.rejected && roomErrorMessage) { customPopupMessage(setInfoPopup, setShowPopup, 'API Error', roomErrorMessage) }
    }, [roomAllLoading, roomAll])
    useEffect(() => {
        if (!isDataLoading) {
            const filteredRooms = bookingById.room_id_list
                .map(roomId => roomAll.find(room => room._id === roomId))
                .filter((room): room is RoomInterfaceId => !!room)
            setRooms(filteredRooms)
        }
    }, [])
    useEffect(() => {
        if (isDataLoading) { ToastifyLoadingData(1, 'Loading rooms data...') }
        else { toast.dismiss(1) }
    }, [isDataLoading])

    // !!! AVERIGUAR COMO OBTENER LAS ROOMS CON EL THUNK INDIVIDUAL EN VEZ DE USAR EL THUNK CON TODAS LAS ROOMS:
    // useEffect(() => {
    //     if (roomByIdLoading === ApiStatus.idle || bookingById.room_id_list.length > roomIndex) {
    //         dispatch(RoomFetchByIDThunk(bookingById.room_id_list[roomIndex]))
    //     }
    //     else if (roomByIdLoading === ApiStatus.fulfilled) {
    //         setRooms(prev => {
    //             if (prev.some(room => room._id === roomById._id)) return prev
    //             return [...prev, roomById]
    //         })
    //     }
    //     else if (roomByIdLoading === ApiStatus.rejected && roomErrorMessage) { customPopupMessage(setInfoPopup, setShowPopup, 'API Error', roomErrorMessage) }
    //     console.log('======> ', rooms)
    // }, [bookingByIdLoading, bookingById, id, roomByIdLoading, roomById])

    const toggleArchivedBooking = async (): Promise<void> => {
        const updatedBooking = {
            ...bookingById,
            isArchived: bookingById.isArchived === OptionYesNo.no
                ? OptionYesNo.yes
                : OptionYesNo.no
        }
        try {
            await dispatch(BookingUpdateThunk({ idBooking: bookingById._id, updatedBookingData: bookingById })).unwrap()
            navigateBackToBookings()
        }
        catch (error) {
            customPopupMessage(setInfoPopup, setShowPopup, 'API Error', String(error))
        }
    }
    const deleteThisBooking = async (): Promise<void> => {
        try {
            await dispatch(BookingDeleteByIdThunk(bookingById._id)).unwrap()
            navigateBackToBookings()
        }
        catch (error) {
            customPopupMessage(setInfoPopup, setShowPopup, 'API Error', String(error))
        }
    }


    return isDataLoading
        ? <ToastContainer />
        : <styles.SectionPageBookingDetails>

            {showPopup && <PopupText isSlider={false} title={infoPopup.title} text={infoPopup.text} onClose={() => setShowPopup(false)} />}

            <styles.DivSection padding='2em'>
                <styles.DivCtnImgAndMainData>
                    {/* <styles.ImgProfile src={rooms[0].photos[0]} /> */}

                    <styles.DivCtnMainData>
                        <styles.DivCtnNameId>
                            {/* !!! TENDRÁ QUE SER EL NOMBRE DEL CLIENTE ASOCIADO */}
                            <styles.NameProfileH2>{bookingById.client_id}</styles.NameProfileH2>
                            <styles.SubTittleH4 isId={true}>ID Booking: #{bookingById._id}</styles.SubTittleH4>
                        </styles.DivCtnNameId>
                        <styles.DivCtnClientMessage>
                            <styles.IconPhone />
                            <styles.ButtonSendMessage>
                                <styles.IconChat />
                                Send Message
                            </styles.ButtonSendMessage>
                        </styles.DivCtnClientMessage>
                    </styles.DivCtnMainData>


                    <styles.IconOptions onClick={() => { setOptionsDisplayed(!optionsDisplayed) }} />
                    <CtnOptionsDisplayed display={`${optionsDisplayed ? 'flex' : 'none'}`} isInTable={false}>
                        <ButtonOption onClick={() => { navigateBackToBookings() }}>Go to bookings</ButtonOption>
                        <ButtonOption onClick={() => { deleteThisBooking() }}>Delete</ButtonOption>
                    </CtnOptionsDisplayed>


                </styles.DivCtnImgAndMainData>

                <styles.DivCheckInOut>
                    <styles.Div50PercentageSection>
                        <styles.SubTittleH4 isId={true}>
                            Check In
                        </styles.SubTittleH4>
                        <styles.SubTittleH4 paddingtop='1em'>
                            {formatDateForPrint(bookingById.check_in_date)}
                        </styles.SubTittleH4>
                    </styles.Div50PercentageSection>
                    <styles.Div50PercentageSection>
                        <styles.SubTittleH4 isId={true}>
                            Check Out
                        </styles.SubTittleH4>
                        <styles.SubTittleH4 paddingtop='1em'>
                            {formatDateForPrint(bookingById.check_out_date)}
                        </styles.SubTittleH4>
                    </styles.Div50PercentageSection>
                </styles.DivCheckInOut>

                <styles.DivCtnInfo>
                    <styles.Div50PercentageSection>
                        <styles.SubTittleH4 isId={true}>
                            Room Info
                        </styles.SubTittleH4>
                        <styles.SubTittleH4 paddingtop='0.5em' fontsize='1.25em'>
                            {/* !!! TENDRÁ QUE SER LOS NÚMEROS DE LAS ROOMS ASOCIADAS */}
                            {/* Room Nº {bookingById.room_data?.number} */}
                            <br />
                            {/* !!! TENDRÁ QUE SER LOS TIPOS DE LAS ROOMS ASOCIADAS */}
                            {/* {bookingById.room_data?.type} */}
                        </styles.SubTittleH4>
                    </styles.Div50PercentageSection>
                    <styles.Div50PercentageSection>
                        <styles.SubTittleH4 isId={true}>
                            Price
                        </styles.SubTittleH4>
                        <styles.SubTittleH4 paddingtop='0.5em' fontsize='1.25em'>
                            <del>${bookingById.price} /night</del>
                            <br />
                            {/* !!! TENDRÁ QUE SER LOS DESCUENTOS DE LAS ROOMS ASOCIADAS */}
                            {/* ${applyDiscount(bookingById.price, bookingById.room_data?.discount)} /night (-{bookingById.room_data?.discount}%) */}
                        </styles.SubTittleH4>
                    </styles.Div50PercentageSection>
                </styles.DivCtnInfo>

                <styles.PTextInfo>
                    {bookingById.special_request}
                </styles.PTextInfo>

                <styles.DivCtnFacilities>
                    <styles.SubTittleH4 isId={true} fontsize='1em'>Facilities</styles.SubTittleH4>
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
                </styles.DivCtnFacilities>
            </styles.DivSection>

            <styles.DivSection>
                {/* !!! LA FOTO PRINCIPAL DE CADA ROOM ASOCIADA: */}
                {/* <bookingDetailsStyles.ImgRoom src={bookingById.room_data_list[0].photos[0]} /> */}
            </styles.DivSection>
        </styles.SectionPageBookingDetails>

}