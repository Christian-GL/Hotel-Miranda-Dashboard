
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"

import * as bookingCreateJS from "./bookingCreate.js"
import { checkFirstIDAvailable, getActualDate, getActualTime, hourFormatTo12H, hourFormatTo24H, dateFormatToYYYYMMDD } from '../../../common/utils/formUtils.js'
import {
    GlobalDateTimeStyles, DivCtnForm, DivIcon, DivCtnIcons, IconCalendar, IconPlus, TitleForm, Form, InputTextPhoto, ImgUser, DivCtnEntry,
    LabelText, LabelTextNote, InputText, TextAreaJobDescription, Select, Option, InputDate, DivButtonCreateUser
} from "../../../common/styles/form.js"
import { ButtonCreate } from '../../../common/components/buttonCreate/buttonCreate.jsx'
import { getBookingAllData, getBookingAllStatus, getBookingError } from "../../../booking/features/bookingSlice.js"
import { BookingFetchAllThunk } from "../../../booking/features/thunks/bookingFetchAllThunk.js"
import { BookingCreateThunk } from "../../../booking/features/thunks/bookingCreateThunk.js"
import { getRoomAllData, getRoomAllStatus, getRoomError } from '../../../room/features/roomSlice.js'
import { RoomFetchAllThunk } from '../../../room/features/thunks/roomFetchAllThunk.js'
import { RoomUpdateThunk } from "../../../room/features/thunks/roomUpdateThunk.js"


export const BookingCreate = () => {

    const bookingAll = useSelector(getBookingAllData) || []
    const bookingAllLoading = useSelector(getBookingAllStatus)
    const roomAll = useSelector(getRoomAllData)
    const roomAllLoading = useSelector(getRoomAllStatus)
    const [newBooking, setNewBooking] = useState({
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
    const [nextIdAvailable, setNextIdAvailable] = useState(null)

    const dispatch = useDispatch()
    useEffect(() => {
        if (bookingAllLoading === "idle") { dispatch(BookingFetchAllThunk()) }
        else if (bookingAllLoading === "fulfilled") {
            if (bookingAll.length > 0) {
                const id = checkFirstIDAvailable(bookingAll)
                setNextIdAvailable(id)
            } else { setNextIdAvailable(1) }
        }
        else if (bookingAllLoading === "rejected") { alert("Error en la api de bookings") }
    }, [bookingAllLoading, bookingAll])
    useEffect(() => {
        if (roomAllLoading === "idle") { dispatch(RoomFetchAllThunk()) }
        else if (roomAllLoading === "fulfilled") { }
        else if (roomAllLoading === "rejected") { alert("Error en la api de rooms") }
    }, [roomAllLoading, roomAll])


    const handlePhotoChange = (e) => {
        const { name, files } = e.target
        if (files[0]) {
            const photoUrl = URL.createObjectURL(files[0])
            setNewBooking({
                ...newBooking,
                [name]: photoUrl
            })
        }
    }
    const handleFullNameChange = (e) => {
        const { name, value } = e.target
        setNewBooking({
            ...newBooking,
            [name]: value
        })
    }
    const handleCheckInDateChange = (e) => {
        const { name, value } = e.target
        const [year, month, day] = value.split("-")
        const dateFormatted = `${day}/${month}/${year}`
        setNewBooking({
            ...newBooking,
            [name]: dateFormatted
        })
    }
    const handleCheckInTimeChange = (e) => {
        const { name, value } = e.target
        const timeFormatted = hourFormatTo12H(value)
        setNewBooking({
            ...newBooking,
            [name]: timeFormatted
        })
    }
    const handleCheckOutDateChange = (e) => {
        const { name, value } = e.target
        const [year, month, day] = value.split("-")
        const dateFormatted = `${day}/${month}/${year}`
        setNewBooking({
            ...newBooking,
            [name]: dateFormatted
        })
    }
    const handleCheckOutTimeChange = (e) => {
        const { name, value } = e.target
        const timeFormatted = hourFormatTo12H(value)
        setNewBooking({
            ...newBooking,
            [name]: timeFormatted
        })
    }
    const handleSpecialRequestChange = (e) => {
        const { name, value } = e.target
        setNewBooking({
            ...newBooking,
            [name]: value
        })
    }
    const handleIdRoomChange = (e) => {
        const { name, value } = e.target
        setNewBooking({
            ...newBooking,
            [name]: parseInt(value)
        })
    }
    const handleBookingRoomStatusChange = (e) => {
        const { name, value } = e.target
        setNewBooking({
            ...newBooking,
            [name]: value
        })
    }
    const handleSubmit = e => {
        e.preventDefault()
        const getRoomById = (id) => {
            const room = roomAll.find(room => room.id === id)
            return room ?
                room :
                { booking_list: [] }
        }

        // checkAllData(newBooking)
        if (checkIsOccupied()) {
            alert(`La habitación #${newBooking.room_id} esta ocupada en las fechas:
                [${newBooking.check_in_date} ${newBooking.check_in_time}] ⭢ [${newBooking.check_out_date} ${newBooking.check_out_time}]`
            )
        }
        else {
            const newBookingToDispatch = {
                ...newBooking,
                id: nextIdAvailable,
                order_date: getActualDate(),
                order_time: getActualTime(),
                room_type: getRoomById(newBooking.room_id).type
            }
            const roomUpdatedToDispatch = {
                ...getRoomById(newBooking.room_id),
                booking_list: [
                    ...getRoomById(newBooking.room_id).booking_list,
                    nextIdAvailable
                ]
            }

            dispatch(BookingCreateThunk(newBookingToDispatch))
                .then(() => {
                    alert(`Booking #${newBookingToDispatch.id} created`)
                })
                .catch((error) => {
                    alert('Error creating the booking: ', error)
                })
            dispatch(RoomUpdateThunk(roomUpdatedToDispatch))
                .then(() => {
                    alert(`Room #${roomUpdatedToDispatch.id} booking list updated to [${roomUpdatedToDispatch.booking_list}]`)
                })
                .catch((error) => {
                    alert(`Error updating the room ${roomUpdatedToDispatch.id}: `, error)
                })
        }

    }

    const checkIsOccupied = () => {

        const room = roomAll.find(room => room.id === nextIdAvailable)
        const bookings = bookingAll.filter(booking => room.booking_list.includes(booking.id))

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

    const checkAllData = (bookingData) => {
        checkName(bookingData.full_name_guest)
        //Resto de checks de campos
    }


    return (<>

        <GlobalDateTimeStyles />

        <bookingCreateJS.SectionPageBookingCreate>
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
                        <TextAreaJobDescription name="special_request" type='text' onChange={handleSpecialRequestChange} ></TextAreaJobDescription>
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
        </bookingCreateJS.SectionPageBookingCreate>

    </>)
}