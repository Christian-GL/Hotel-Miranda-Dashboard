
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"

import * as bookingCreateJS from "./bookingCreate.js"
import { hourFormatTo12H } from '../../../common/utils/formUtils.jsx'
import { checkFirstIDAvailable, getActualDate, getActualTime } from '../../../common/utils/formUtils.jsx'
import {
    DivCtnForm, DivIcon, DivCtnIcons, IconCalendar, IconPlus, TitleForm, Form, InputTextPhoto, ImgUser, DivCtnEntry,
    LabelText, InputText, Select, Option, InputDate, DivButtonCreateUser
} from "../../../common/styles/form.js"
import { ButtonCreate } from '../../../common/components/buttonCreate/buttonCreate.jsx'
import { getBookingAllData, getBookingAllStatus, getBookingError } from "../../../bookings/features/bookingSlice.js"
import { BookingFetchAllThunk } from "../../../bookings/features/thunks/bookingFetchAllThunk.js"
import { BookingCreateThunk } from "../../../bookings/features/thunks/bookingCreateThunk.js"

export const BookingCreate = () => {

    const bookingAll = useSelector(getBookingAllData) || []
    const bookingAllLoading = useSelector(getBookingAllStatus)
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
        room_type: '',
        room_number: '',
        status: '',
    })
    const [nextIdAvailable, setNextIdAvailable] = useState(null)

    const dispatch = useDispatch()
    useEffect(() => {
        if (bookingAllLoading === "idle") { dispatch(BookingFetchAllThunk()) }
        else if (bookingAllLoading === "fulfilled") {
            if (bookingAll.length > 0) {
                const id = checkFirstIDAvailable(bookingAll)
                setNextIdAvailable(id)
            }
            else {
                setNextIdAvailable(1)
            }
        }
        else if (bookingAllLoading === "rejected") { alert("Error en la api") }
    }, [bookingAllLoading, bookingAll])


    // QUE URL DE FOTO DEBE GUARDAR EN REDUX ???
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
        const dateFormatted = `${day}-${month}-${year}`
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
        const dateFormatted = `${day}-${month}-${year}`
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
    const handleTypeChange = (e) => {
        const { name, value } = e.target
        setNewBooking({
            ...newBooking,
            [name]: value
        })
    }
    const handleNumberChange = (e) => {
        const { name, value } = e.target
        setNewBooking({
            ...newBooking,
            [name]: parseInt(value)
        })
    }
    const handleBookingStatusChange = (e) => {
        const { name, value } = e.target
        setNewBooking({
            ...newBooking,
            [name]: value
        })
    }
    const handleSubmit = e => {
        e.preventDefault()
        const newBookingToDispatch = {
            ...newBooking,
            id: nextIdAvailable,
            order_date: getActualDate(),
            order_time: getActualTime()
        }
        dispatch(BookingCreateThunk(newBookingToDispatch))
            .then(() => {
                alert(`Booking #${newBookingToDispatch.id} created`)
            })
            .catch((error) => {
                alert('Error creating the booking: ', error)
            })
    }

    return (

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
                        <LabelText>Photo</LabelText>
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
                        <LabelText>Room Type</LabelText>
                        <Select name="room_type" onChange={handleTypeChange} >
                            <Option value='suite'>Suite</Option>
                            <Option value='single_bed'>Single Bed</Option>
                            <Option value='double_bed'>Double Bed</Option>
                            <Option value='double_superior'>Double Superior</Option>
                        </Select>
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Room Number</LabelText>
                        <InputText name="room_number" onChange={handleNumberChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Booking Status</LabelText>
                        <Select name="status" onChange={handleBookingStatusChange}>
                            <Option value='check_in'>Check In</Option>
                            <Option value='check_out'>Check Out</Option>
                            <Option value='in_progress'>In Progress</Option>
                        </Select>
                    </DivCtnEntry>

                    <DivButtonCreateUser>
                        <ButtonCreate type="submit" text='+ Create Booking' fontsize='1.25em'></ButtonCreate>
                    </DivButtonCreateUser>
                </Form>
            </DivCtnForm>
        </bookingCreateJS.SectionPageBookingCreate>

    )
}