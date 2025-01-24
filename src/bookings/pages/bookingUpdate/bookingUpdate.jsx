
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams } from "react-router-dom"

import * as bookingUpdateJS from "./bookingUpdate.js"
import {
    DivCtnForm, DivIcon, DivCtnIcons, IconCalendar, IconUpdate, TitleForm, Form, InputTextPhoto, ImgUser, DivCtnEntry,
    LabelText, InputText, Select, Option, InputDate, DivButtonCreateUser
} from '../../../common/components/form/form.js'
import { ButtonCreate } from '../../../common/components/buttonCreate/buttonCreate.jsx'
import { getBookingIdData, getBookingIdStatus, getBookingError } from "../../../bookings/features/bookingSlice.js"
import { BookingFetchByIDThunk } from "../../../bookings/features/thunks/bookingFetchByIDThunk.js"
import { BookingUpdateByIdThunk } from "../../../bookings/features/thunks/bookingUpdateByIdThunk.js"


const convertTo12HourFormat = (time) => {
    const [hours, minutes] = time.split(":")
    let hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    hour = hour % 12
    hour = hour ? hour : 12
    const minute = minutes
    return `${hour}:${minute} ${ampm}`
}

const convertTo24HourFormat = (time12hr) => {
    const [time, period] = time12hr.split(' ')
    let [hours, minutes] = time.split(':')
    hours = parseInt(hours)
    if (period === 'PM' && hours < 12) {
        hours += 12
    }
    if (period === 'AM' && hours === 12) {
        hours = 0
    }
    return `${hours < 10 ? '0' + hours : hours}:${minutes}`;
}

const formatDateToYYYYMMDD = (date) => {
    const [day, month, year] = date.split('/')
    return `${year}-${month}-${day}`
}

const formatDateToDDMMYYYY = (date) => {
    const [year, month, day] = date.split('-')
    return `${day}/${month}/${year}`
}


export const BookingUpdate = () => {

    const { id } = useParams()
    const bookingById = useSelector(getBookingIdData) || []
    const bookingByIdLoading = useSelector(getBookingIdStatus)
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
        room_type: '',
        room_number: '',
        status: '',
    })

    const dispatch = useDispatch()
    useEffect(() => {
        if (bookingByIdLoading === "idle") { dispatch(BookingFetchByIDThunk(parseInt(id))) }
        else if (bookingByIdLoading === "fulfilled" && Object.keys(bookingById).length !== 0) {
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
                room_type: bookingById.room_type || '',
                room_number: bookingById.room_number || '',
                status: bookingById.status || ''
            })
        }
        else if (bookingByIdLoading === "rejected") { alert("Error en la api") }
    }, [bookingByIdLoading, bookingById])


    // QUE URL DE FOTO DEBE GUARDAR EN REDUX ???
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
            [name]: formatDateToDDMMYYYY(value)
        })
    }
    const handleCheckInTimeChange = (e) => {
        const { name, value } = e.target
        setBookingUpdated({
            ...bookingUpdated,
            [name]: convertTo12HourFormat(value)
        })
    }
    const handleCheckOutDateChange = (e) => {
        const { name, value } = e.target
        setBookingUpdated({
            ...bookingUpdated,
            [name]: formatDateToDDMMYYYY(value)
        })
    }
    const handleCheckOutTimeChange = (e) => {
        const { name, value } = e.target
        setBookingUpdated({
            ...bookingUpdated,
            [name]: convertTo12HourFormat(value)
        })
    }
    const handleTypeChange = (e) => {
        const { name, value } = e.target
        setBookingUpdated({
            ...bookingUpdated,
            [name]: value
        })
    }
    const handleNumberChange = (e) => {
        const { name, value } = e.target
        setBookingUpdated({
            ...bookingUpdated,
            [name]: parseInt(value)
        })
    }
    const handleBookingStatusChange = (e) => {
        const { name, value } = e.target
        setBookingUpdated({
            ...bookingUpdated,
            [name]: value
        })
    }
    const handleSubmit = e => {
        e.preventDefault()
        dispatch(BookingUpdateByIdThunk(bookingUpdated))
            .then(() => {
                alert(`Booking #${bookingUpdated.id} updated`)
            })
            .catch((error) => {
                alert(`Error updating the booking #${bookingUpdated.id}: `, error)
            })
    }

    return (

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
                        <LabelText>Photo</LabelText>
                        <InputTextPhoto name="photo" type='file' onChange={handlePhotoChange} />
                        <ImgUser src={bookingUpdated.photo} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Full name guest</LabelText>
                        <InputText name="full_name_guest" value={bookingUpdated.full_name_guest} onChange={handleFullNameChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Check in date</LabelText>
                        <InputDate name="check_in_date" value={formatDateToYYYYMMDD(bookingUpdated.check_in_date)} type="date" onChange={handleCheckInDateChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Check in time</LabelText>
                        <InputDate name="check_in_time" value={convertTo24HourFormat(bookingUpdated.check_in_time)} type="time" onChange={handleCheckInTimeChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Check out date</LabelText>
                        <InputDate name="check_out_date" value={formatDateToYYYYMMDD(bookingUpdated.check_out_date)} type="date" onChange={handleCheckOutDateChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Check out time</LabelText>
                        <InputDate name="check_out_time" value={convertTo24HourFormat(bookingUpdated.check_out_time)} type="time" onChange={handleCheckOutTimeChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Room Type</LabelText>
                        <Select name="room_type" value={bookingUpdated.room_type} onChange={handleTypeChange} >
                            <Option value='suite'>Suite</Option>
                            <Option value='single_bed'>Single Bed</Option>
                            <Option value='double_bed'>Double Bed</Option>
                            <Option value='double_superior'>Double Superior</Option>
                        </Select>
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Room Number</LabelText>
                        <InputText name="room_number" value={bookingUpdated.room_number} onChange={handleNumberChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Booking Status</LabelText>
                        <Select name="status" value={bookingUpdated.status} onChange={handleBookingStatusChange}>
                            <Option value='check_in'>Check In</Option>
                            <Option value='check_out'>Check Out</Option>
                            <Option value='in_progress'>In Progress</Option>
                        </Select>
                    </DivCtnEntry>

                    <DivButtonCreateUser>
                        <ButtonCreate type="submit" text='⮂ Update Booking' fontsize='1.25em'></ButtonCreate>
                    </DivButtonCreateUser>
                </Form>
            </DivCtnForm>
        </bookingUpdateJS.SectionPageBookingUpdate>

    )
}