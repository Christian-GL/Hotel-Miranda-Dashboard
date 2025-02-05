
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams } from "react-router-dom"

import * as bookingUpdateJS from "./bookingUpdate.js"
import { dateFormatToYYYYMMDD, dateFormatToDDMMYYYY, hourFormatTo12H, hourFormatTo24H } from '../../../common/utils/formUtils.js'
import {
    GlobalDateTimeStyles, DivCtnForm, DivIcon, DivCtnIcons, IconCalendar, IconUpdate, TitleForm, Form, InputTextPhoto, ImgUser, DivCtnEntry,
    LabelText, InputText, TextAreaJobDescription, Select, Option, InputDate, DivButtonCreateUser
} from "../../../common/styles/form.js"
import { ButtonCreate } from '../../../common/components/buttonCreate/buttonCreate.tsx'
import { getBookingIdData, getBookingIdStatus, getBookingError } from "../../../booking/features/bookingSlice.js"
import { BookingFetchByIDThunk } from "../../../booking/features/thunks/bookingFetchByIDThunk.js"
import { BookingUpdateThunk } from "../../../booking/features/thunks/bookingUpdateThunk.js"
import { getRoomAllData, getRoomAllStatus, getRoomError } from '../../../room/features/roomSlice.js'
import { RoomFetchAllThunk } from '../../../room/features/thunks/roomFetchAllThunk.js'
import { RoomUpdateThunk } from "../../../room/features/thunks/roomUpdateThunk.js"


export const BookingUpdate = () => {

    const { id } = useParams()
    const dispatch = useDispatch()
    const bookingById = useSelector(getBookingIdData)
    const bookingByIdLoading = useSelector(getBookingIdStatus)
    const roomAll = useSelector(getRoomAllData)
    const roomAllLoading = useSelector(getRoomAllStatus)
    const previusRoomId = bookingById.room_id || 0
    const [bookingUpdated, setBookingUpdated] = useState({
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

    useEffect(() => {
        dispatch(BookingFetchByIDThunk(parseInt(id)))
    }, [id, dispatch])
    useEffect(() => {
        if (bookingByIdLoading === "idle") { dispatch(BookingFetchByIDThunk(parseInt(id))) }
        else if (bookingByIdLoading === "fulfilled") {
            setBookingUpdated({
                id: bookingById.id,
                photo: bookingById.photo || '',
                full_name_guest: bookingById.full_name_guest || '',
                order_date: bookingById.order_date || '',
                order_time: bookingById.order_time || '',
                check_in_date: bookingById.check_in_date || '',
                check_in_time: bookingById.check_in_time || '',
                check_out_date: bookingById.check_out_date || '',
                check_out_time: bookingById.check_out_time || '',
                special_request: bookingById.special_request || '',
                room_id: bookingById.room_id || 0,
                room_type: bookingById.room_type || '',
                room_booking_status: bookingById.room_booking_status || ''
            })
            if (roomAllLoading === "idle") { dispatch(RoomFetchAllThunk()) }
            else if (roomAllLoading === "fulfilled") { }
            else if (roomAllLoading === "rejected") { alert("Error en la api de rooms") }
        }
        else if (bookingByIdLoading === "rejected") { alert("Error en la api de bookings") }
    }, [bookingByIdLoading, bookingById, roomAllLoading, roomAll])

    const handlePhotoChange = (e) => {
        const { name, files } = e.target
        if (files[0]) {
            const photoUrl = URL.createObjectURL(files[0])
            setBookingUpdated({
                ...bookingUpdated,
                [name]: photoUrl
            })
        }
    }
    const handleFullNameChange = (e) => {
        const { name, value } = e.target
        setBookingUpdated({
            ...bookingUpdated,
            [name]: value
        })
    }
    const handleCheckInDateChange = (e) => {
        const { name, value } = e.target
        setBookingUpdated({
            ...bookingUpdated,
            [name]: dateFormatToDDMMYYYY(value)
        })
    }
    const handleCheckInTimeChange = (e) => {
        const { name, value } = e.target
        setBookingUpdated({
            ...bookingUpdated,
            [name]: hourFormatTo12H(value)
        })
    }
    const handleCheckOutDateChange = (e) => {
        const { name, value } = e.target
        setBookingUpdated({
            ...bookingUpdated,
            [name]: dateFormatToDDMMYYYY(value)
        })
    }
    const handleCheckOutTimeChange = (e) => {
        const { name, value } = e.target
        setBookingUpdated({
            ...bookingUpdated,
            [name]: hourFormatTo12H(value)
        })
    }
    const handleSpecialRequestChange = (e) => {
        const { name, value } = e.target
        setBookingUpdated({
            ...bookingUpdated,
            [name]: value
        })
    }
    const handleIdRoomChange = (e) => {
        const { name, value } = e.target
        setBookingUpdated({
            ...bookingUpdated,
            [name]: parseInt(value)
        })
    }
    const handleBookingRoomStatusChange = (e) => {
        const { name, value } = e.target
        setBookingUpdated({
            ...bookingUpdated,
            [name]: value
        })
    }
    const handleSubmit = e => {
        e.preventDefault()
        const getRoomById = (id) => {
            const room = roomAll.find(room => room.id === id)
            return room ? room : 0
        }

        const roomUpdatedToDispatch = {
            ...getRoomById(previusRoomId)
        }
        const roomUpdatedToDispatch2 = {
            ...getRoomById(bookingUpdated.room_id)
        }

        dispatch(BookingUpdateThunk(bookingUpdated))
            .then(() => {
                alert(`Booking #${bookingUpdated.id} updated`)
            })
            .catch((error) => {
                alert(`Error updating the booking #${bookingUpdated.id}: `, error)
            })

        if (previusRoomId !== bookingUpdated.room_id) {
            const oldRoomUpdatedToDispatch = {
                ...roomUpdatedToDispatch,
                booking_list: roomUpdatedToDispatch.booking_list.filter(bookingId => bookingId !== previusRoomId)
            }
            console.log('--> ', bookingUpdated.room_id)
            const newRoomUpdatedToDispatch = {
                ...roomUpdatedToDispatch2,
                booking_list: [...roomUpdatedToDispatch2.booking_list, bookingUpdated.room_id]
            }

            dispatch(RoomUpdateThunk(oldRoomUpdatedToDispatch))
                .then(() => {
                    alert(`Room #${previusRoomId} booking list updated to [${oldRoomUpdatedToDispatch.booking_list}]`)
                })
                .catch((error) => {
                    alert(`Error updating the room ${previusRoomId}: `, error)
                })
            dispatch(RoomUpdateThunk(newRoomUpdatedToDispatch))
                .then(() => {
                    alert(`Room #${bookingUpdated.room_id} booking list updated to [${newRoomUpdatedToDispatch.booking_list}]`)
                })
                .catch((error) => {
                    alert(`Error updating the room ${bookingUpdated.room_id}: `, error)
                })
        }
    }

    return (<>

        <GlobalDateTimeStyles />

        <bookingUpdateJS.SectionPageBookingUpdate>
            <DivCtnForm>
                <DivIcon>
                    <DivCtnIcons>
                        <IconCalendar />
                        <IconUpdate />
                    </DivCtnIcons>
                </DivIcon>
                <TitleForm>Update Booking #{bookingUpdated.id}</TitleForm>

                <Form onSubmit={handleSubmit}>
                    <DivCtnEntry>
                        <LabelText>Guest photo</LabelText>
                        <InputTextPhoto name="photo" type='file' onChange={handlePhotoChange} />
                        <ImgUser src={bookingUpdated.photo} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Full name guest</LabelText>
                        <InputText name="full_name_guest" value={bookingUpdated.full_name_guest} onChange={handleFullNameChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Check in date</LabelText>
                        <InputDate name="check_in_date" value={dateFormatToYYYYMMDD(bookingUpdated.check_in_date)} type="date" onChange={handleCheckInDateChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Check in time</LabelText>
                        <InputDate name="check_in_time" value={hourFormatTo24H(bookingUpdated.check_in_time)} type="time" onChange={handleCheckInTimeChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Check out date</LabelText>
                        <InputDate name="check_out_date" value={dateFormatToYYYYMMDD(bookingUpdated.check_out_date)} type="date" onChange={handleCheckOutDateChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Check out time</LabelText>
                        <InputDate name="check_out_time" value={hourFormatTo24H(bookingUpdated.check_out_time)} type="time" onChange={handleCheckOutTimeChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Special request</LabelText>
                        <TextAreaJobDescription name="special_request" type='text' value={bookingUpdated.special_request} onChange={handleSpecialRequestChange} ></TextAreaJobDescription>
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Room number</LabelText>
                        <Select name="room_id" value={bookingUpdated.room_id} onChange={handleIdRoomChange}>
                            {roomAll.map((room, index) => (
                                <Option key={index} value={room.id}>{room.id}</Option>
                            ))}
                        </Select>
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Booking Status</LabelText>
                        <Select name="room_booking_status" value={bookingUpdated.room_booking_status} onChange={handleBookingRoomStatusChange}>
                            <Option value='Check In'>Check In</Option>
                            <Option value='Check Out'>Check Out</Option>
                            <Option value='In Progress'>In Progress</Option>
                        </Select>
                    </DivCtnEntry>

                    <DivButtonCreateUser>
                        <ButtonCreate type="submit" children='⮂ Update Booking' fontSize='1.25em'></ButtonCreate>
                    </DivButtonCreateUser>
                </Form>
            </DivCtnForm>
        </bookingUpdateJS.SectionPageBookingUpdate>

    </>)
}