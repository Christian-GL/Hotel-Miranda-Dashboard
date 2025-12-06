
import React from "react"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"

import * as bookingUpdateStyles from "./bookingUpdateStyles"
import { ToastContainer } from 'react-toastify'
import { ToastifySuccess } from "../../../common/components/toastify/successPopup/toastifySuccess"
import { ToastifyError } from "../../../common/components/toastify/errorPopup/toastifyError"
import { AppDispatch } from "../../../common/redux/store"
import { ApiStatus } from "../../../common/enums/ApiStatus"
import { OptionYesNo } from "../../../common/enums/optionYesNo"
import { BookingInterface } from "../../interfaces/bookingInterface"
import { formatDateForInput } from "../../../common/utils/dateUtils"
import { createFormHandlers } from '../../../common/utils/formHandlers'
import {
    validatePhoto, validateFullName, validateEmail, validatePhoneNumber, validateDateRelativeToAnother,
    validateTextArea, validateRole, validateNewPassword, validateOptionYesNo
} from '../../../common/utils/commonValidator'
import {
    GlobalDateTimeStyles, DivCtnForm, DivIcon, DivCtnIcons, IconCalendar, IconUpdate, TitleForm, Form, InputTextPhoto, ImgUser, DivCtnEntry,
    LabelText, InputText, TextAreaJobDescription, Select, Option, InputDate, DivButtonCreateUser
} from "../../../common/styles/form"
import { ButtonCreate } from '../../../common/components/buttonCreate/buttonCreate'
import { getBookingIdData, getBookingIdStatus } from "../../../booking/features/bookingSlice"
import { BookingFetchByIDThunk } from "../../../booking/features/thunks/bookingFetchByIDThunk"
import { BookingUpdateThunk } from "../../../booking/features/thunks/bookingUpdateThunk"
import { getBookingAllData, getBookingAllStatus } from "../../../booking/features/bookingSlice"
import { BookingFetchAllThunk } from "../../../booking/features/thunks/bookingFetchAllThunk"
import { getRoomAllData, getRoomAllStatus } from '../../../room/features/roomSlice'
import { RoomFetchAllThunk } from '../../../room/features/thunks/roomFetchAllThunk'


export const BookingUpdate = () => {

    const { id } = useParams()
    const idParams = id!
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const bookingById = useSelector(getBookingIdData)
    const bookingByIdLoading = useSelector(getBookingIdStatus)
    const bookingAll = useSelector(getBookingAllData)
    const bookingAllLoading = useSelector(getBookingAllStatus)
    const roomAll = useSelector(getRoomAllData)
    const roomAllLoading = useSelector(getRoomAllStatus)
    const [bookingUpdated, setBookingUpdated] = useState<BookingInterface>({
        _id: '0',
        order_date: new Date(),
        check_in_date: new Date(),
        check_out_date: new Date(),
        price: 0,
        special_request: '',
        isArchived: OptionYesNo.yes,
        room_id_list: [],
        client_id: ''
    })
    const { handleStringChange,
        handleDateChange,
        handlePhotoChange,
        handleTextAreaChange,
        handleSelectChange
    } = createFormHandlers(setBookingUpdated)
    // const roomsAvailable = roomAll.filter(room => !validateDateIsOccupied(bookingUpdated, bookingAll.filter(booking => booking.room_data._id === room._id)).length)
    // const currentRoom = bookingUpdated.room_id ?
    //     roomAll.find(room => Number(room._id) === Number(bookingUpdated.room_id)) :
    //     null
    // const effectiveRooms = currentRoom && !roomsAvailable.some(room => Number(room._id) === Number(currentRoom._id)) ?
    //     [currentRoom, ...roomsAvailable] :
    //     roomsAvailable

    useEffect(() => {
        if (bookingByIdLoading === ApiStatus.idle) { dispatch(BookingFetchByIDThunk(idParams)) }
        else if (bookingByIdLoading === ApiStatus.fulfilled) {
            if (bookingById._id !== idParams) {
                dispatch(BookingFetchByIDThunk(idParams))
            }
            setBookingUpdated({
                _id: bookingById._id || "0",
                order_date: bookingById.order_date || '',
                check_in_date: bookingById.check_in_date || '',
                check_out_date: bookingById.check_out_date || '',
                price: bookingById.price || 0,
                special_request: bookingById.special_request || '',
                isArchived: bookingById.isArchived || OptionYesNo.yes,
                room_id_list: bookingById.room_id_list || [],
                client_id: bookingById.client_id || ''
            })
        }
        else if (bookingByIdLoading === ApiStatus.rejected) { alert("Error en la api de booking update > bookings") }
    }, [bookingByIdLoading, bookingById, id])
    useEffect(() => {
        if (bookingAllLoading === ApiStatus.idle) { dispatch(BookingFetchAllThunk()) }
        else if (bookingAllLoading === ApiStatus.fulfilled) { }
        else if (bookingAllLoading === ApiStatus.rejected) { alert("Error in API create booking") }
    }, [bookingAllLoading, bookingAll])
    useEffect(() => {
        if (roomAllLoading === ApiStatus.idle) { dispatch(RoomFetchAllThunk()) }
        else if (roomAllLoading === ApiStatus.fulfilled) { }
        else if (roomAllLoading === ApiStatus.rejected) { alert("Error in API update bookings > rooms") }
    }, [roomAllLoading, roomAll])

    const validateAllData = (): string[] => {
        const allErrorMessages: string[] = []

        // !!! IMPORTAR VALIDADORES DE LA API

        return allErrorMessages
    }
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (validateAllData().length > 0) {
            validateAllData().forEach(error => ToastifyError(error))
            return
        }

        dispatch(BookingUpdateThunk({ idBooking: bookingUpdated._id, updatedBookingData: bookingUpdated }))
            .then(() => {
                ToastifySuccess('Booking updated', () => {
                    navigate('../')
                })
            })
            .catch((error) => {
                ToastifyError(error)
            })
    }


    return (<>
        <ToastContainer />

        <GlobalDateTimeStyles />

        <bookingUpdateStyles.SectionPageBookingUpdate>
            <DivCtnForm>
                <DivIcon>
                    <DivCtnIcons>
                        <IconCalendar />
                        <IconUpdate />
                    </DivCtnIcons>
                </DivIcon>
                <TitleForm>Update Booking #{bookingUpdated._id}</TitleForm>

                <Form onSubmit={handleSubmit}>
                    <DivCtnEntry>
                        <LabelText>Check in date</LabelText>
                        <InputDate name="check_in_date" value={formatDateForInput(bookingUpdated.check_in_date)} type="datetime-local" onChange={handleDateChange} />

                        <LabelText minWidth="10rem" margin="0 0 0 5rem">Check out date</LabelText>
                        <InputDate name="check_out_date" value={formatDateForInput(bookingUpdated.check_out_date)} type="datetime-local" onChange={handleDateChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Room number</LabelText>
                        {/* !!! ACTUALIZAR AL TENER LOS DATOS: */}
                        {/* <Select
                            name="room_id"
                            value={bookingUpdated.room_id || (bookingById.room_data ? bookingById.room_data._id : '')}
                            onChange={handleNumberSelectChange}
                            disabled={
                                !bookingUpdated.check_in_date ||
                                !bookingUpdated.check_out_date ||
                                effectiveRooms.length === 0
                            }
                        >
                            {!bookingUpdated.check_in_date || !bookingUpdated.check_out_date ?
                                (<Option value="null" selected disabled>
                                    ⚠️ Select Check-in date & Check-out date first
                                </Option>)
                                :
                                (<>
                                    {effectiveRooms.length === 0 ?
                                        (<Option value="null" selected disabled>
                                            ❌ No rooms available for the selected dates
                                        </Option>)
                                        :
                                        (<>
                                            <Option value="null" selected></Option>
                                            {effectiveRooms.map(room => (
                                                <Option key={room._id} value={room._id.toString()}>
                                                    {room.number}
                                                </Option>
                                            ))}
                                        </>)
                                    }
                                </>)}
                        </Select> */}
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Special request</LabelText>
                        <TextAreaJobDescription name="special_request" value={bookingUpdated.special_request} onChange={handleTextAreaChange} ></TextAreaJobDescription>
                    </DivCtnEntry>

                    <DivButtonCreateUser>
                        <ButtonCreate type="submit" children='⮂ Update Booking' fontSize='1.25em'></ButtonCreate>
                    </DivButtonCreateUser>
                </Form>
            </DivCtnForm>
        </bookingUpdateStyles.SectionPageBookingUpdate >
    </>)
}