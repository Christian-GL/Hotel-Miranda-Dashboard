
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
import { BookingInterfaceNoId } from "../../interfaces/bookingInterface"
import {
    validatePhoto, validateFullName, validateCheckInCheckOut,
    validateDateIsOccupied, validateTextArea
} from '../../../common/utils/validators'
import {
    GlobalDateTimeStyles, DivCtnForm, DivIcon, DivCtnIcons, IconCalendar, IconPlus, TitleForm, Form, InputTextPhoto, ImgUser, DivCtnEntry,
    LabelText, LabelTextNote, InputText, TextAreaJobDescription, Select, Option, InputDate, DivButtonCreateUser
} from "../../../common/styles/form"
import { ButtonCreate } from '../../../common/components/buttonCreate/buttonCreate'
import { getBookingAllData, getBookingAllStatus } from "../../../booking/features/bookingSlice"
import { BookingFetchAllThunk } from "../../../booking/features/thunks/bookingFetchAllThunk"
import { BookingCreateThunk } from "../../../booking/features/thunks/bookingCreateThunk"
import { getRoomAllData, getRoomAllStatus } from '../../../room/features/roomSlice'
import { RoomFetchAllThunk } from '../../../room/features/thunks/roomFetchAllThunk'


export const BookingCreate = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const bookingAll = useSelector(getBookingAllData)
    const bookingAllLoading = useSelector(getBookingAllStatus)
    const roomAll = useSelector(getRoomAllData)
    const roomAllLoading = useSelector(getRoomAllStatus)
    const [newBooking, setNewBooking] = useState<BookingInterfaceNoId>({
        photo: '',
        full_name_guest: '',
        order_date: '',
        check_in_date: '',
        check_out_date: '',
        special_request: '',
        room_id: 0
    })
    const roomsAvailable = roomAll.filter(room => !validateDateIsOccupied(newBooking, bookingAll.filter(booking => booking.room_data._id === room._id)).length)

    useEffect(() => {
        if (bookingAllLoading === ApiStatus.idle) { dispatch(BookingFetchAllThunk()) }
        else if (bookingAllLoading === ApiStatus.fulfilled) { }
        else if (bookingAllLoading === ApiStatus.rejected) { alert("Error in API create booking") }
    }, [bookingAllLoading, bookingAll])
    useEffect(() => {
        if (roomAllLoading === ApiStatus.idle) { dispatch(RoomFetchAllThunk()) }
        else if (roomAllLoading === ApiStatus.fulfilled) { }
        else if (roomAllLoading === ApiStatus.rejected) { alert("Error in API create booking > rooms") }
    }, [roomAllLoading, roomAll])


    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target
        if (files && files[0]) {
            const photoUrl = URL.createObjectURL(files[0])
            setNewBooking({
                ...newBooking,
                [name]: photoUrl
            })
        }
    }
    const handleStringInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setNewBooking({
            ...newBooking,
            [name]: value
        })
    }
    const handleNumberSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        setNewBooking({
            ...newBooking,
            [name]: parseInt(value)
        })
    }
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        if (!value) return
        const date = new Date(value)
        const dateISO = date.toISOString()

        setNewBooking({
            ...newBooking,
            [name]: dateISO
        })
    }
    const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setNewBooking({
            ...newBooking,
            [name]: value
        })
    }
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!validateAllData()) { return }

        const newBookingToDispatch = {
            ...newBooking,
            order_date: new Date().toISOString()
        }

        dispatch(BookingCreateThunk(newBookingToDispatch))
            .then(() => {
                ToastifySuccess('Booking Created', () => {
                    navigate('../')
                })
            })
            .catch((error) => {
                ToastifyError(error)
            })
    }

    const validateAllData = (): boolean => {
        // const errorsPhoto = validatePhoto(newBooking.photo, 'Photo')
        // if (errorsPhoto.length > 0) { errorsPhoto.map(error => ToastifyError(error)); return false }

        const errorsFullName = validateFullName(newBooking.full_name_guest, 'Full name guest')
        if (errorsFullName.length > 0) { errorsFullName.map(error => ToastifyError(error)); return false }

        const errorsCheckInDate = validateCheckInCheckOut(new Date(newBooking.check_in_date), new Date(newBooking.check_out_date))
        if (errorsCheckInDate.length > 0) { errorsCheckInDate.map(error => ToastifyError(error)); return false }

        const errorsSpecialRequest = validateTextArea(newBooking.special_request, 'Special request')
        if (errorsSpecialRequest.length > 0) { errorsSpecialRequest.map(error => ToastifyError(error)); return false }

        const roomOfBooking = roomAll.find(room => room._id === newBooking.room_id)
        const bookingsOfRoom = bookingAll.filter(booking => booking.room_data.number === roomOfBooking?.number)

        const errorsDateIsOccupied = validateDateIsOccupied(newBooking, bookingsOfRoom)
        if (errorsDateIsOccupied.length > 0) { errorsDateIsOccupied.map(error => ToastifyError(error)); return false }

        return true
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
                        <LabelText>Guest photo</LabelText>
                        <InputTextPhoto name="photo" type='file' onChange={handlePhotoChange} />
                        <ImgUser src={newBooking.photo} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Full name guest</LabelText>
                        <InputText name="full_name_guest" onChange={handleStringInputChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Check in date</LabelText>
                        <InputDate name="check_in_date" type="datetime-local" onChange={handleDateChange} />

                        <LabelText minWidth="10rem" margin="0 0 0 5rem">Check out date</LabelText>
                        <InputDate name="check_out_date" type="datetime-local" onChange={handleDateChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Room number</LabelText>
                        <Select
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
                        </Select>
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