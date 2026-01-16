
import React from "react"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

import * as bookingCreateStyles from "./bookingCreateStyles"
import { ToastContainer } from 'react-toastify'
import { ToastifySuccess } from "../../../common/components/toastify/successPopup/toastifySuccess"
import { ToastifyError } from "../../../common/components/toastify/errorPopup/toastifyError"
import { AppDispatch } from "../../../common/redux/store"
import { ApiStatus } from "../../../common/enums/ApiStatus"
import { OptionYesNo } from "../../../common/enums/optionYesNo"
import { BookingInterfaceNoId } from "../../interfaces/bookingInterface"
import { createFormHandlers } from '../../../common/utils/formHandlers'
import {
    validatePhoto, validateFullName, validateEmail, validatePhoneNumber, validateDateRelativeToAnother,
    validateTextArea, validateRole, validateNewPassword, validateOptionYesNo
} from '../../../common/utils/commonValidator'
import {
    GlobalDateTimeStyles, DivCtnForm, DivIcon, DivCtnIcons, IconCalendar, IconPlus, TitleForm, Form, InputTextPhoto, ImgUser, DivCtnEntry,
    LabelText, LabelTextNote, InputText, TextAreaJobDescription, Select, Option, InputDate, DivButtonCreateUser
} from "../../../common/styles/form"
import { ButtonCreate } from '../../../common/components/buttonCreate/buttonCreate'
import { getBookingAllData, getBookingAllStatus, getBookingErrorMessage } from "../../../booking/features/bookingSlice"
import { BookingFetchAllThunk } from "../../../booking/features/thunks/bookingFetchAllThunk"
import { BookingCreateThunk } from "../../../booking/features/thunks/bookingCreateThunk"
import { getRoomAllData, getRoomAllStatus, getRoomErrorMessage } from '../../../room/features/roomSlice'
import { RoomFetchAllThunk } from '../../../room/features/thunks/roomFetchAllThunk'


export const BookingCreate = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const bookingAll = useSelector(getBookingAllData)
    const bookingAllLoading = useSelector(getBookingAllStatus)
    const bookingErrorMessage = useSelector(getBookingErrorMessage)
    const roomAll = useSelector(getRoomAllData)
    const roomAllLoading = useSelector(getRoomAllStatus)
    const roomErrorMessage = useSelector(getRoomErrorMessage)
    const [newBooking, setNewBooking] = useState<BookingInterfaceNoId>({
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
    } = createFormHandlers(setNewBooking)
    // const roomsAvailable = roomAll.filter(room => !validateDateIsOccupied(newBooking, bookingAll.filter(booking => booking.room_data._id === room._id)).length)

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

        const newBookingToDispatch = {
            ...newBooking,
            order_date: new Date()
        }

        try {
            await dispatch(BookingCreateThunk(newBookingToDispatch))
                .unwrap()
                .then(() => ToastifySuccess('Booking created', () => navigate('../')))
        }
        catch (error) {
            ToastifyError(String(error))
        }
    }


    return (<>
        <ToastContainer />

        <GlobalDateTimeStyles />

        <bookingCreateStyles.SectionPageBookingCreate>
            <DivCtnForm>
                <DivIcon>
                    <DivCtnIcons>
                        <IconCalendar />
                        <IconPlus />
                    </DivCtnIcons>
                </DivIcon>
                <TitleForm>Create Booking</TitleForm>

                <Form onSubmit={handleSubmit}>
                    <DivCtnEntry>
                        <LabelText>Check in date</LabelText>
                        <InputDate name="check_in_date" type="datetime-local" onChange={handleDateChange} />

                        <LabelText minWidth="10rem" margin="0 0 0 5rem">Check out date</LabelText>
                        <InputDate name="check_out_date" type="datetime-local" onChange={handleDateChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Room number</LabelText>
                        {/* !!! ACTUALIZAR AL TENER LOS DATOS: */}
                        {/* <Select
                            name="room_id"
                            onChange={handleNumberSelectChange}
                            disabled={!newBooking.check_in_date || !newBooking.check_out_date || roomsAvailable.length === 0}
                        >
                            {!newBooking.check_in_date || !newBooking.check_out_date ?
                                (<Option value="null" selected disabled>⚠️ Select Check-in date & Check-out date first</Option>)
                                :
                                (<>
                                    {roomsAvailable.length === 0 ?
                                        (<Option value="null" selected disabled>❌ No rooms available for the selected dates</Option>)
                                        :
                                        (<>
                                            <Option value="null" selected></Option>
                                            {roomsAvailable.map(room => (
                                                <Option key={room._id} value={room._id.toString()}>{room.number}</Option>
                                            ))
                                            }
                                        </>)
                                    }
                                </>)}
                        </Select> */}
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Special request</LabelText>
                        <TextAreaJobDescription name="special_request" onChange={handleTextAreaChange} ></TextAreaJobDescription>
                    </DivCtnEntry>

                    <DivButtonCreateUser>
                        <ButtonCreate type="submit" children='+ Create Booking' fontSize='1.25em'></ButtonCreate>
                    </DivButtonCreateUser>
                </Form>
            </DivCtnForm>
        </bookingCreateStyles.SectionPageBookingCreate>

    </>)
}