
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
import { BookingStatus } from "../../data/bookingStatus.ts"
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
        status: '',
    })
    const [nextIdAvailable, setNextIdAvailable] = useState<number>(0)

    useEffect(() => {
        if (bookingAllLoading === ApiStatus.idle) { dispatch(BookingFetchAllThunk()) }
        else if (bookingAllLoading === ApiStatus.fulfilled) {
            if (bookingAll.length > 0) {
                const id = checkFirstIDAvailable(bookingAll.map(item => item.id))
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
    const handleStringChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setNewBooking({
            ...newBooking,
            [name]: value
        })
    }
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        const [year, month, day] = value.split("-")
        const dateFormatted = `${day}/${month}/${year}`
        setNewBooking({
            ...newBooking,
            [name]: dateFormatted
        })
    }
    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        const timeFormatted = hourFormatTo12H(value)
        setNewBooking({
            ...newBooking,
            [name]: timeFormatted
        })
    }
    const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setNewBooking({
            ...newBooking,
            [name]: value
        })
    }
    const handleNumberChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        setNewBooking({
            ...newBooking,
            [name]: parseInt(value)
        })
    }
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
        if (!room) {
            ToastifyError(`ERROR - room #${newBooking.room_id} nor found`)
            return
        }

        if (checkIsOccupied()) {
            ToastifyError(`Room #${newBooking.room_id} is occupied on dates:
                [${newBooking.check_in_date} ${newBooking.check_in_time}] ⭢ [${newBooking.check_out_date} ${newBooking.check_out_time}]`)
            return
        }

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

    const checkIsOccupied = () => { // NO DEBE ESTAR EN ESTE FICHERO. LO MISMO PARA EL BOOKINGUPDATE

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
        // if (!checkPhoto.test) {
        //     checkPhoto.errorMessages.map(error => ToastifyError(error))
        //     return false
        // }
        const checkGuestName = validateName(newBooking.full_name_guest)
        if (!checkGuestName.test) {
            checkGuestName.errorMessages.map(error => ToastifyError(error))
            return false
        }
        const checkInDate = validateDateAndTime(newBooking.check_in_date)
        if (!checkInDate.test) {
            checkInDate.errorMessages.map(error => ToastifyError(error))
            return false
        }
        const checkInTime = validateDateAndTime(newBooking.check_in_time)
        if (!checkInTime.test) {
            checkInTime.errorMessages.map(error => ToastifyError(error))
            return false
        }
        const checkOutDate = validateDateAndTime(newBooking.check_out_date)
        if (!checkOutDate.test) {
            checkOutDate.errorMessages.map(error => ToastifyError(error))
            return false
        }
        const checkOutTime = validateDateAndTime(newBooking.check_in_time)
        if (!checkOutTime.test) {
            checkOutTime.errorMessages.map(error => ToastifyError(error))
            return false
        }
        const checkSpecialRequest = validateTextArea(newBooking.special_request)
        if (!checkSpecialRequest.test) {
            checkSpecialRequest.errorMessages.map(error => ToastifyError(error))
            return false
        }
        const checkRoomNumber = validateRoomNumber(newBooking.room_id)
        if (!checkRoomNumber.test) {
            checkRoomNumber.errorMessages.map(error => ToastifyError(error))
            return false
        }
        const checkBookingStatus = validateBookingStatus(newBooking.status)
        if (!checkBookingStatus.test) {
            checkBookingStatus.errorMessages.map(error => ToastifyError(error))
            return false
        }

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
                        <InputText name="full_name_guest" onChange={handleStringChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Check in date</LabelText>
                        <InputDate name="check_in_date" type="date" onChange={handleDateChange} />

                        <LabelText minWidth="10rem" margin="0 0 0 5rem">Check in time</LabelText>
                        <InputDate name="check_in_time" type="time" onChange={handleTimeChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Check out date</LabelText>
                        <InputDate name="check_out_date" type="date" onChange={handleDateChange} />

                        <LabelText minWidth="10rem" margin="0 0 0 5rem">Check out time</LabelText>
                        <InputDate name="check_out_time" type="time" onChange={handleTimeChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Room number</LabelText>
                        <Select name="room_id" onChange={handleNumberChange}>
                            <Option value="null" selected></Option>
                            {roomAll.map((room, index) => (
                                <Option key={index}>{room.id}</Option>
                            ))}
                        </Select>

                        <LabelText minWidth="10rem" margin="0 0 0 5rem">Booking Status</LabelText>
                        <Select name="status" onChange={handleSelectChange}>
                            <Option value="null" selected></Option>
                            {Object.values(BookingStatus).map((type, index) => (
                                <option key={index} value={type}>
                                    {type}
                                </option>
                            ))}
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