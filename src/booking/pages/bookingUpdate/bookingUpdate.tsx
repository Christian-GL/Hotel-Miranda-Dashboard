
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
    GlobalDateTimeStyles, CtnForm, CtnPrimaryIcon, CtnSecondaryIcon, IconCalendar, IconUpdate, TitleForm, Form, InputTextPhoto, ImgUser, CtnEntry,
    Text, InputText, TextAreaJobDescription, Select, Option, InputDate, DivButtonCreateUser
} from "../../../common/styles/form"
import { ButtonCreate } from '../../../common/components/buttonCreate/buttonCreate'
import { BookingFetchByIDThunk } from "../../../booking/features/thunks/bookingFetchByIDThunk"
import { BookingUpdateThunk } from "../../../booking/features/thunks/bookingUpdateThunk"
import { getBookingAllData, getBookingAllStatus, getBookingIdData, getBookingIdStatus, getBookingErrorMessage } from "../../../booking/features/bookingSlice"
import { BookingFetchAllThunk } from "../../../booking/features/thunks/bookingFetchAllThunk"
import { getRoomAllData, getRoomAllStatus, getRoomErrorMessage } from '../../../room/features/roomSlice'
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
    const bookingErrorMessage = useSelector(getBookingErrorMessage)
    const roomAll = useSelector(getRoomAllData)
    const roomAllLoading = useSelector(getRoomAllStatus)
    const roomErrorMessage = useSelector(getRoomErrorMessage)
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
    const { handleDateChange,
        handleTextAreaChange,
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
                client_id: bookingById.client_id || '0'
            })
        }
        else if (bookingByIdLoading === ApiStatus.rejected && bookingErrorMessage) { ToastifyError(bookingErrorMessage) }
    }, [bookingByIdLoading, bookingById, id])
    useEffect(() => {
        if (bookingAllLoading === ApiStatus.idle) { dispatch(BookingFetchAllThunk()) }
        else if (bookingAllLoading === ApiStatus.fulfilled) { }
        else if (bookingAllLoading === ApiStatus.rejected && bookingErrorMessage) { ToastifyError(bookingErrorMessage) }
    }, [bookingAllLoading, bookingAll])
    useEffect(() => {
        if (roomAllLoading === ApiStatus.idle) { dispatch(RoomFetchAllThunk()) }
        else if (roomAllLoading === ApiStatus.fulfilled) { }
        else if (roomAllLoading === ApiStatus.rejected && roomErrorMessage) { ToastifyError(roomErrorMessage) }
    }, [roomAllLoading, roomAll])

    const validateAllData = (): string[] => {
        const allErrorMessages: string[] = []

        // !!! IMPORTAR VALIDADORES DE LA API

        return allErrorMessages
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const errors = validateAllData()
        if (errors.length > 0) {
            errors.forEach(error => ToastifyError(error))
            return
        }

        try {
            await dispatch(BookingUpdateThunk({ idBooking: bookingUpdated._id, updatedBookingData: bookingUpdated }))
                .unwrap()
                .then(() => ToastifySuccess('Room created', () => navigate('../')))
        }
        catch (error) {
            ToastifyError(String(error))
        }
    }


    return (<>
        <ToastContainer />

        <GlobalDateTimeStyles />

        <bookingUpdateStyles.SectionPageBookingUpdate>
            <CtnForm>
                <CtnPrimaryIcon>
                    <CtnSecondaryIcon>
                        <IconCalendar />
                        <IconUpdate />
                    </CtnSecondaryIcon>
                </CtnPrimaryIcon>
                <TitleForm>Update Booking #{bookingUpdated._id}</TitleForm>

                <Form onSubmit={handleSubmit}>
                    <CtnEntry>
                        <Text>Check in date</Text>
                        <InputDate name="check_in_date" value={formatDateForInput(bookingUpdated.check_in_date)} type="datetime-local" onChange={handleDateChange} />

                        <Text minWidth="10rem" margin="0 0 0 5rem">Check out date</Text>
                        <InputDate name="check_out_date" value={formatDateForInput(bookingUpdated.check_out_date)} type="datetime-local" onChange={handleDateChange} />
                    </CtnEntry>

                    <CtnEntry>
                        <Text>Room number</Text>
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
                    </CtnEntry>

                    <CtnEntry>
                        <Text>Special request</Text>
                        <TextAreaJobDescription name="special_request" value={bookingUpdated.special_request} onChange={handleTextAreaChange} ></TextAreaJobDescription>
                    </CtnEntry>

                    <DivButtonCreateUser>
                        <ButtonCreate type="submit" children='⮂ Update Booking' fontSize='1.25em'></ButtonCreate>
                    </DivButtonCreateUser>
                </Form>
            </CtnForm>
        </bookingUpdateStyles.SectionPageBookingUpdate >
    </>)
}