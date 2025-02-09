
import React from "react"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

import * as bookingCreateStyles from "./bookingCreateStyles.ts"
import { ToastContainer } from 'react-toastify'
import { ToastifySuccess } from "../../../common/components/toastify/successPopup/toastifySuccess.tsx"
import { ToastifyError } from "../../../common/components/toastify/errorPopup/toastifyError.tsx"
import { AppDispatch } from "../../../common/redux/store.ts"
import { ApiStatus } from "../../../common/enums/ApiStatus.ts"
import { BookingInterface } from "../../interfaces/bookingInterface.ts"
import {
    checkFirstIDAvailable, getActualDate, getActualTime, hourFormatTo12H, hourFormatTo24H, dateFormatToYYYYMMDD,
    validatePhoto, validateName, validateDateAndTime, validateTextArea, validateRoomNumber, validateBookingStatus
} from '../../../common/utils/formUtils.ts'
import {
    GlobalDateTimeStyles, DivCtnForm, DivIcon, DivCtnIcons, IconCalendar, IconPlus, TitleForm, Form, InputTextPhoto, ImgUser, DivCtnEntry,
    LabelText, LabelTextNote, InputText, TextAreaJobDescription, Select, Option, InputDate, DivButtonCreateUser
} from "../../../common/styles/form.ts"
import { ButtonCreate } from '../../../common/components/buttonCreate/buttonCreate.tsx'
import { getBookingAllData, getBookingAllStatus } from "../../../booking/features/bookingSlice.ts"
import { BookingFetchAllThunk } from "../../../booking/features/thunks/bookingFetchAllThunk.ts"
import { BookingCreateThunk } from "../../../booking/features/thunks/bookingCreateThunk.ts"
import { getRoomAllData, getRoomAllStatus } from '../../../room/features/roomSlice.ts'
import { RoomFetchAllThunk } from '../../../room/features/thunks/roomFetchAllThunk.ts'
import { RoomUpdateThunk } from "../../../room/features/thunks/roomUpdateThunk.ts"


export const BookingCreate = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const bookingAll = useSelector(getBookingAllData)
    const bookingAllLoading = useSelector(getBookingAllStatus)
    const roomAll = useSelector(getRoomAllData)
    const roomAllLoading = useSelector(getRoomAllStatus)
    const [newBooking, setNewBooking] = useState<BookingInterface>({
        id: 0,
        photo: '',
        full_name_guest: '',
        order_date: '',
        order_time: '',
        check_in_date: '',
        check_in_time: '',
        check_out_date: '',
        check_out_time: '',
        special_request: '',
        room_id: 0,
        room_type: '',
        room_booking_status: '',
    })
    const [nextIdAvailable, setNextIdAvailable] = useState<number>(0)

    useEffect(() => {
        if (bookingAllLoading === ApiStatus.idle) { dispatch(BookingFetchAllThunk()) }
        else if (bookingAllLoading === ApiStatus.fulfilled) {
            if (bookingAll.length > 0) {
                const id = checkFirstIDAvailable(bookingAll)
                setNextIdAvailable(id)
            }
            else { setNextIdAvailable(1) }
        }
        else if (bookingAllLoading === ApiStatus.rejected) { alert("Error en la api de booking create") }
    }, [bookingAllLoading, bookingAll])
    useEffect(() => {
        if (roomAllLoading === ApiStatus.idle) { dispatch(RoomFetchAllThunk()) }
        else if (roomAllLoading === ApiStatus.fulfilled) { }
        else if (roomAllLoading === ApiStatus.rejected) { alert("Error en la api de booking create > rooms") }
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
    const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setNewBooking({
            ...newBooking,
            [name]: value
        })
    }
    const handleCheckInDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        const [year, month, day] = value.split("-")
        const dateFormatted = `${day}/${month}/${year}`
        setNewBooking({
            ...newBooking,
            [name]: dateFormatted
        })
    }
    const handleCheckInTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        const timeFormatted = hourFormatTo12H(value)
        setNewBooking({
            ...newBooking,
            [name]: timeFormatted
        })
    }
    const handleCheckOutDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        const [year, month, day] = value.split("-")
        const dateFormatted = `${day}/${month}/${year}`
        setNewBooking({
            ...newBooking,
            [name]: dateFormatted
        })
    }
    const handleCheckOutTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        const timeFormatted = hourFormatTo12H(value)
        setNewBooking({
            ...newBooking,
            [name]: timeFormatted
        })
    }
    const handleSpecialRequestChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setNewBooking({
            ...newBooking,
            [name]: value
        })
    }
    const handleIdRoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        setNewBooking({
            ...newBooking,
            [name]: parseInt(value)
        })
    }
    const handleBookingRoomStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        setNewBooking({
            ...newBooking,
            [name]: value
        })
    }
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!validateAllData()) { return }

        const room = roomAll.find(room => room.id === newBooking.room_id)
        if (!room) { return }

        if (checkIsOccupied()) {
            ToastifyError(`La habitación #${newBooking.room_id} esta ocupada en las fechas:
                [${newBooking.check_in_date} ${newBooking.check_in_time}] ⭢ [${newBooking.check_out_date} ${newBooking.check_out_time}]`)
        }
        else {
            const newBookingToDispatch = {
                ...newBooking,
                id: nextIdAvailable,
                order_date: getActualDate(),
                order_time: getActualTime(),
                room_type: room.type
            }
            const roomUpdatedToDispatch = {
                ...room,
                booking_list: [
                    ...room.booking_list,
                    nextIdAvailable
                ]
            }

            dispatch(BookingCreateThunk(newBookingToDispatch))
                .then(() => {
                    ToastifySuccess(`Booking #${newBookingToDispatch.id} created`, () => {
                        navigate('../')
                    })
                })
                .catch((error) => {
                    ToastifyError(error)
                })
            dispatch(RoomUpdateThunk(roomUpdatedToDispatch))
                .then(() => {
                    ToastifySuccess(`Room #${roomUpdatedToDispatch.id} booking list updated to [${roomUpdatedToDispatch.booking_list}]`, () => {
                        navigate('../')
                    })
                })
                .catch((error) => {
                    ToastifyError(error)
                })
        }
    }

    const checkIsOccupied = () => {

        const room = roomAll.find(room => room.id === nextIdAvailable)
        if (!room) { return }

        const bookings = bookingAll.filter(booking => room.booking_list.includes(booking.id))
        if (!bookings) { return }

        const bookingDataCheckIn = new Date(`${dateFormatToYYYYMMDD(newBooking.check_in_date)}T${hourFormatTo24H(newBooking.check_in_time)}:00`)
        const bookingDataCheckOut = new Date(`${dateFormatToYYYYMMDD(newBooking.check_out_date)}T${hourFormatTo24H(newBooking.check_out_time)}:00`)
        for (let booking of bookings) {
            const bookingCheckIn = new Date(`${dateFormatToYYYYMMDD(booking.check_in_date)}T${hourFormatTo24H(booking.check_in_time)}:00`)
            const bookingCheckOut = new Date(`${dateFormatToYYYYMMDD(booking.check_out_date)}T${hourFormatTo24H(booking.check_out_time)}:00`)

            if ((bookingDataCheckIn < bookingCheckOut) && (bookingDataCheckOut > bookingCheckIn)) {
                return true
            }
        }
        return false
    }

    const validateAllData = (): boolean => {
        // const checkPhoto = validatePhoto(newBooking.photo)
        const checkGuestName = validateName(newBooking.full_name_guest)
        const checkInDate = validateDateAndTime(newBooking.check_in_date)
        const checkInTime = validateDateAndTime(newBooking.check_in_time)
        const checkOutDate = validateDateAndTime(newBooking.check_out_date)
        const checkOutTime = validateDateAndTime(newBooking.check_in_time)
        const checkSpecialRequest = validateTextArea(newBooking.special_request)
        const checkRoomNumber = validateRoomNumber(newBooking.room_id)
        const checkBookingStatus = validateBookingStatus(newBooking.room_booking_status)

        // if (!checkPhoto.test) { ToastifyError(checkPhoto.errorMessage); return false }
        if (!checkGuestName.test) { ToastifyError(checkGuestName.errorMessage); return false }
        if (!checkInDate.test) { ToastifyError(checkInDate.errorMessage); return false }
        if (!checkInTime.test) { ToastifyError(checkInTime.errorMessage); return false }
        if (!checkOutDate.test) { ToastifyError(checkOutDate.errorMessage); return false }
        if (!checkOutTime.test) { ToastifyError(checkOutTime.errorMessage); return false }
        if (!checkSpecialRequest.test) { ToastifyError(checkSpecialRequest.errorMessage); return false }
        if (!checkRoomNumber.test) { ToastifyError(checkRoomNumber.errorMessage); return false }
        if (!checkBookingStatus.test) { ToastifyError(checkBookingStatus.errorMessage); return false }

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
                        <InputText name="full_name_guest" onChange={handleFullNameChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Check in date</LabelText>
                        <InputDate name="check_in_date" type="date" onChange={handleCheckInDateChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Check in time</LabelText>
                        <InputDate name="check_in_time" type="time" onChange={handleCheckInTimeChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Check out date</LabelText>
                        <InputDate name="check_out_date" type="date" onChange={handleCheckOutDateChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Check out time</LabelText>
                        <InputDate name="check_out_time" type="time" onChange={handleCheckOutTimeChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Special request</LabelText>
                        <TextAreaJobDescription name="special_request" onChange={handleSpecialRequestChange} ></TextAreaJobDescription>
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Room number</LabelText>
                        <Select name="room_id" onChange={handleIdRoomChange}>
                            <Option value="null" selected></Option>
                            {roomAll.map((room, index) => (
                                <Option key={index}>{room.id}</Option>
                            ))}
                        </Select>
                        {/* <LabelTextNote><b>* Check in date/time</b> and <b>Check out date/time</b> must be especified before</LabelTextNote> */}
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Booking Status</LabelText>
                        <Select name="room_booking_status" onChange={handleBookingRoomStatusChange}>
                            <Option value="null" selected></Option>
                            <Option value='Check In'>Check In</Option>
                            <Option value='Check Out'>Check Out</Option>
                            <Option value='In Progress'>In Progress</Option>
                        </Select>
                    </DivCtnEntry>

                    <DivButtonCreateUser>
                        <ButtonCreate type="submit" children='+ Create Booking' fontSize='1.25em'></ButtonCreate>
                    </DivButtonCreateUser>
                </Form>
            </DivCtnForm>
        </bookingCreateStyles.SectionPageBookingCreate>

    </>)
}