
import { useState } from "react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'

import * as styles from "./bookingDetailsStyles"
import roomDefaultImg from "../../../assets/img/roomDefault.jpg"
import { useLoginOptionsContext } from "../../../signIn/features/loginProvider"
import { BookingInterfaceId } from "../../interfaces/bookingInterface"
import { ApiErrorResponseInterface } from "common/interfaces/apiResponses/apiErrorResponseInterface"
import { CtnOptions, ButtonOption } from "../../../common/styles/tableStyles"
import { AppDispatch } from "../../../common/redux/store"
import { handleNonAdminClick } from 'common/utils/nonAdminPopupMessage'
import { formatDateForPrint } from "../../../common/utils/dateUtils"
import { applyDiscount } from '../../../common/utils/tableUtils'
import { customPopupMessage } from '../../../common/utils/customPopupMessage'
import { handleSelectionPopupMessage } from '../../../common/utils/selectionPopupMessage'
import { PopupText } from "../../../common/components/popupText/popupText"
import { PopupTextInterface } from '../../../common/interfaces/popupTextInterface'
import { ToastContainer, toast } from 'react-toastify'
import { ToastifyLoadingData } from "../../../common/components/toastify/loadingDataPopup/toastifyLoadingData"
import { Role } from "../../../user/enums/role"
import { ApiStatus } from "../../../common/enums/ApiStatus"
import { RoomAmenities } from "../../../room/enums/roomAmenities"
import { OptionYesNo } from "../../../common/enums/optionYesNo"
import { getBookingIdData, getBookingIdStatus } from "../../../booking/features/bookingSlice"
import { BookingFetchByIDThunk } from "../../features/thunks/bookingFetchByIDThunk"
import { BookingUpdateThunk } from "./../../features/thunks/bookingUpdateThunk"
import { BookingDeleteByIdThunk } from "../../features/thunks/bookingDeleteByIdThunk"
import { ClientInterfaceId } from "../../../client/interfaces/clientInterface"
import { getClientIdData, getClientIdStatus, getClientApiError } from "../../../client/features/clientSlice"
import { ClientFetchByIDThunk } from "../../../client/features/thunks/clientFetchByIDThunk"
import { getRoomAllData, getRoomAllStatus, getRoomIdData, getRoomIdStatus } from "../../../room/features/roomSlice"
import { RoomFetchAllThunk } from "../../../room/features/thunks/roomFetchAllThunk"
import { RoomInterfaceId } from "../../../room/interfaces/roomInterface"


export const BookingDetails = () => {

    const navigate = useNavigate()
    const navigateBackToBookings = () => navigate('../')
    const dispatch = useDispatch<AppDispatch>()
    const { getRole } = useLoginOptionsContext()
    const { id } = useParams()
    const idParams = id!
    const bookingById: BookingInterfaceId = useSelector(getBookingIdData)
    const bookingByIdLoading: ApiStatus = useSelector(getBookingIdStatus)
    const roomAll = useSelector(getRoomAllData)
    const roomAllLoading = useSelector(getRoomAllStatus)
    // const roomById = useSelector(getRoomIdData)
    // const roomByIdLoading = useSelector(getRoomIdStatus)
    // const roomIndex = rooms.length
    const clientById: ClientInterfaceId = useSelector(getClientIdData)
    const clientByIdLoading: ApiStatus = useSelector(getClientIdStatus)
    const [showPopup, setShowPopup] = useState<boolean>(false)
    const [infoPopup, setInfoPopup] = useState<PopupTextInterface>({ title: '', text: '' })
    const [optionsDisplayed, setOptionsDisplayed] = useState<boolean>(false)
    const [roomsOfBooking, setRoomsOfBooking] = useState<RoomInterfaceId[]>([])
    const isDataLoading = bookingByIdLoading !== ApiStatus.fulfilled || roomAllLoading !== ApiStatus.fulfilled

    useEffect(() => {
        if (bookingByIdLoading === ApiStatus.idle) { dispatch(BookingFetchByIDThunk(idParams)) }
        else if (bookingByIdLoading === ApiStatus.fulfilled) {
            if (bookingById._id !== idParams) {
                dispatch(BookingFetchByIDThunk(idParams))
            }
        }
    }, [bookingByIdLoading, bookingById, id])
    useEffect(() => {
        if (roomAllLoading === ApiStatus.idle) { dispatch(RoomFetchAllThunk()) }
    }, [roomAllLoading, roomAll])
    useEffect(() => {
        if (clientByIdLoading === ApiStatus.idle && bookingByIdLoading === ApiStatus.fulfilled) { dispatch(ClientFetchByIDThunk(bookingById.client_id)) }
    }, [clientByIdLoading, clientById, bookingByIdLoading, bookingById, id])
    useEffect(() => {
        if (!isDataLoading) {
            const filteredRooms = bookingById.room_id_list
                .map(roomId => roomAll.find(room => room._id === roomId))
                .filter((room): room is RoomInterfaceId => !!room)
            setRoomsOfBooking(filteredRooms)
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

    const toggleArchivedThisBooking = async (): Promise<void> => {
        const updatedBooking = {
            ...bookingById,
            isArchived: bookingById.isArchived === OptionYesNo.no
                ? OptionYesNo.yes
                : OptionYesNo.no
        }
        try {
            await dispatch(BookingUpdateThunk({ idBooking: updatedBooking._id, updatedBookingData: updatedBooking })).unwrap()
            navigateBackToBookings()
        }
        catch (error) {
            const apiError = error as ApiErrorResponseInterface
            customPopupMessage(setInfoPopup, setShowPopup, 'API Error', apiError.message)
        }
    }
    const deleteThisBooking = async (): Promise<void> => {
        try {
            await dispatch(BookingDeleteByIdThunk(bookingById._id)).unwrap()
            navigateBackToBookings()
        }
        catch (error) {
            const apiError = error as ApiErrorResponseInterface
            customPopupMessage(setInfoPopup, setShowPopup, 'API Error', apiError.message)
        }
    }


    return isDataLoading
        ? <ToastContainer />
        : <styles.PageBookingDetails>

            {showPopup && <PopupText
                title={infoPopup.title}
                text={infoPopup.text}
                onConfirm={infoPopup.onConfirm}
                onCancel={infoPopup.onCancel}
                onClose={() => { setShowPopup(false); setOptionsDisplayed(false) }}
            />}

            <styles.Section padding='2em'>
                <styles.CtnMainData>
                    <styles.SubCtnMainData>
                        <styles.CtnNameId>
                            <styles.NameProfileH2>{clientById.full_name}</styles.NameProfileH2>
                            <styles.SubTittleH4 isId={true}>ID Client: #{clientById._id}</styles.SubTittleH4>
                        </styles.CtnNameId>
                        <styles.CtnClientMessage>
                            <styles.IconPhone />
                            <styles.ButtonSendMessage>
                                <styles.IconChat />
                                Send Message
                            </styles.ButtonSendMessage>
                        </styles.CtnClientMessage>
                    </styles.SubCtnMainData>

                    <styles.CtnMenuOptions>
                        <styles.IconOptions onClick={() => { setOptionsDisplayed(!optionsDisplayed) }} />
                        <CtnOptions display={`${optionsDisplayed ? 'flex' : 'none'}`} isInTable={false}>
                            <ButtonOption onClick={() => { navigateBackToBookings() }}>Go back to bookings</ButtonOption>
                            <ButtonOption onClick={() => { navigate(`../booking-update/${bookingById._id}`) }}>Update</ButtonOption>
                            <ButtonOption
                                onClick={() => handleSelectionPopupMessage(
                                    setInfoPopup,
                                    setShowPopup,
                                    `${bookingById.isArchived === OptionYesNo.no ? 'Archive' : 'Unarchive'} booking #${bookingById._id}`,
                                    `Are you sure you want to ${bookingById.isArchived === OptionYesNo.no ? 'archive' : 'unarchive'} this booking?`,
                                    () => { toggleArchivedThisBooking(); navigateBackToBookings() },
                                    () => setOptionsDisplayed(false)
                                )}
                            >{bookingById.isArchived === OptionYesNo.no ? 'Archive' : 'Unarchive'}
                            </ButtonOption>
                            <ButtonOption
                                onClick={getRole() === Role.admin
                                    ? () => handleSelectionPopupMessage(
                                        setInfoPopup,
                                        setShowPopup,
                                        `Delete booking #${bookingById._id}`,
                                        'Are you sure you want to delete this booking? This action cannot be undone.',
                                        () => { deleteThisBooking(); navigateBackToBookings() },
                                        () => setOptionsDisplayed(false)
                                    )
                                    : () => handleNonAdminClick(setInfoPopup, setShowPopup)
                                }
                                disabledClick={getRole() !== Role.admin}
                            >Delete
                            </ButtonOption>
                        </CtnOptions>
                    </styles.CtnMenuOptions>
                </styles.CtnMainData>

                <styles.CtnCheckInOut>
                    <styles.CtnEcualSection>
                        <styles.SubTittleH4 isId={true}>Order Date</styles.SubTittleH4>
                        <styles.SubTittleH4 paddingtop='1em'>{formatDateForPrint(bookingById.order_date)}</styles.SubTittleH4>
                    </styles.CtnEcualSection>
                    <styles.CtnEcualSection>
                        <styles.SubTittleH4 isId={true}>Check In</styles.SubTittleH4>
                        <styles.SubTittleH4 paddingtop='1em'>{formatDateForPrint(bookingById.check_in_date)}</styles.SubTittleH4>
                    </styles.CtnEcualSection>
                    <styles.CtnEcualSection>
                        <styles.SubTittleH4 isId={true}>Check Out</styles.SubTittleH4>
                        <styles.SubTittleH4 paddingtop='1em'>{formatDateForPrint(bookingById.check_out_date)}</styles.SubTittleH4>
                    </styles.CtnEcualSection>
                </styles.CtnCheckInOut>

                <styles.CtnInfo>
                    <styles.CtnEcualSection>
                        <styles.SubTittleH4 isId={true}>Rooms Info</styles.SubTittleH4>
                        {roomsOfBooking.map((room) => (
                            <styles.SubTittleH4 key={room._id}>Room Nº {room.number} - {room.type}</styles.SubTittleH4>
                        ))}
                    </styles.CtnEcualSection>
                    <styles.CtnEcualSection>
                        <styles.SubTittleH4 isId={true}>Original price</styles.SubTittleH4>
                        {roomsOfBooking.map((room) => (
                            <styles.SubTittleH4 key={room._id}>{room.price}€</styles.SubTittleH4>
                        ))}
                    </styles.CtnEcualSection>
                    <styles.CtnEcualSection>
                        <styles.SubTittleH4 isId={true}>Disccount</styles.SubTittleH4>
                        {roomsOfBooking.map((room) => (
                            <styles.SubTittleH4 key={room._id}>{room.discount}%</styles.SubTittleH4>
                        ))}
                    </styles.CtnEcualSection>
                    <styles.CtnEcualSection>
                        <styles.SubTittleH4 isId={true}>Final price per room</styles.SubTittleH4>
                        {roomsOfBooking.map((room) => (
                            <styles.SubTittleH4 key={room._id}>{applyDiscount(room.price, room.discount)}€</styles.SubTittleH4>
                        ))}
                    </styles.CtnEcualSection>
                    <styles.CtnEcualSection>
                        <styles.SubTittleH4 isId={true}>Total price</styles.SubTittleH4>
                        <styles.SubTittleH4 key={bookingById._id}>{bookingById.price}€</styles.SubTittleH4>
                    </styles.CtnEcualSection>
                </styles.CtnInfo>

                <styles.SubTittleH4 isId={true} fontsize='1em'>Special request</styles.SubTittleH4>
                <styles.PTextInfo>{bookingById.special_request}</styles.PTextInfo>

                <styles.CtnFacilities>
                    <styles.SubTittleH4 isId={true} fontsize='1em'>Facilities</styles.SubTittleH4>
                    {roomsOfBooking.map((room) => {
                        return (<>
                            <styles.SubTittleH4 paddingtop='1em'>Room Nº {room.number}:</styles.SubTittleH4>
                            {room.amenities.length > 0
                                ? room.amenities.map((amenity, index) => {
                                    switch (amenity) {
                                        case RoomAmenities.bedSpace3:
                                            return (
                                                <styles.ButtonFacility key={`${room._id}-bed-${index}`} withicon="true">
                                                    3 Bed Space
                                                    <styles.IconBed />
                                                </styles.ButtonFacility>
                                            )
                                        case RoomAmenities.guard24Hours:
                                            return (
                                                <styles.ButtonFacility key={`${room._id}-guard-${index}`} withicon="true">
                                                    24 Hours Guard
                                                    <styles.IconShieldCheck />
                                                </styles.ButtonFacility>
                                            )
                                        case RoomAmenities.wiFi:
                                            return (
                                                <styles.ButtonFacility key={`${room._id}-wifi-${index}`} withicon="true">
                                                    Wifi
                                                    <styles.IconWiFi />
                                                </styles.ButtonFacility>
                                            )
                                        default:
                                            return (
                                                <styles.ButtonFacility key={`${room._id}-default-${index}`}>
                                                    {amenity}
                                                </styles.ButtonFacility>
                                            )
                                    }
                                })
                                : (
                                    <styles.SubTittleH4 key={`${room._id}-no-amenities`} fontsize="1em">
                                        No amenities available
                                    </styles.SubTittleH4>
                                )}
                        </>)
                    })}
                </styles.CtnFacilities>
            </styles.Section>

            <styles.Section>
                <styles.SwiperCustom>
                    <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={48}
                        slidesPerView={1}
                        navigation={true}
                        pagination={{ clickable: true }}
                        loop={false}
                    >
                        {roomsOfBooking.map(room =>
                            room.photos.map((photo, index) => (
                                <SwiperSlide key={`${room._id}-photo-${index}`}>
                                    <styles.ImgRoom
                                        src={photo || roomDefaultImg}
                                        onError={(e) => { e.currentTarget.src = roomDefaultImg }}
                                    />
                                    {/* <styles.NameProfileH2>{clientById.full_name}</styles.NameProfileH2> */}
                                </SwiperSlide>
                            ))
                        )}
                    </Swiper>
                </styles.SwiperCustom>
            </styles.Section>
        </styles.PageBookingDetails>

}