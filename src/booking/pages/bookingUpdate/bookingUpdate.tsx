
import React from "react"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"

import * as bookingUpdateStyles from "./bookingUpdateStyles.ts"
import { ToastContainer } from 'react-toastify'
import { ToastifySuccess } from "../../../common/components/toastify/successPopup/toastifySuccess.tsx"
import { ToastifyError } from "../../../common/components/toastify/errorPopup/toastifyError.tsx"
import { AppDispatch } from "../../../common/redux/store.ts"
import { ApiStatus } from "../../../common/enums/ApiStatus.ts"
import { BookingInterface } from "../../interfaces/bookingInterface.ts"
import { BookingStatus } from "../../data/bookingStatus.ts"
import { formatDateForInput } from "../../../common/utils/formUtils.ts"
import {
    validatePhoto, validateFullName, validateCheckInCheckOut,
    validateDateIsOccupiedIfBookingExists, validateBookingStatus, validateTextArea
} from '../../../common/utils/validators.ts'
import {
    GlobalDateTimeStyles, DivCtnForm, DivIcon, DivCtnIcons, IconCalendar, IconUpdate, TitleForm, Form, InputTextPhoto, ImgUser, DivCtnEntry,
    LabelText, InputText, TextAreaJobDescription, Select, Option, InputDate, DivButtonCreateUser
} from "../../../common/styles/form.ts"
import { ButtonCreate } from '../../../common/components/buttonCreate/buttonCreate.tsx'
import { getBookingIdData, getBookingIdStatus } from "../../../booking/features/bookingSlice.ts"
import { BookingFetchByIDThunk } from "../../../booking/features/thunks/bookingFetchByIDThunk.ts"
import { BookingUpdateThunk } from "../../../booking/features/thunks/bookingUpdateThunk.ts"
import { getBookingAllData, getBookingAllStatus } from "../../../booking/features/bookingSlice.ts"
import { BookingFetchAllThunk } from "../../../booking/features/thunks/bookingFetchAllThunk.ts"
import { getRoomAllData, getRoomAllStatus } from '../../../room/features/roomSlice.ts'
import { RoomFetchAllThunk } from '../../../room/features/thunks/roomFetchAllThunk.ts'


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
        _id: '',
        photo: '',
        full_name_guest: '',
        order_date: '',
        check_in_date: '',
        check_out_date: '',
        status: BookingStatus.checkIn,
        special_request: '',
        room_id: '0'
    })

    useEffect(() => {
        if (bookingByIdLoading === ApiStatus.idle) { dispatch(BookingFetchByIDThunk(idParams)) }
        else if (bookingByIdLoading === ApiStatus.fulfilled) {
            if (bookingById._id !== idParams) {
                dispatch(BookingFetchByIDThunk(idParams))
            }
            setBookingUpdated({
                _id: bookingById._id,
                photo: bookingById.photo || '',
                full_name_guest: bookingById.full_name_guest || '',
                order_date: bookingById.order_date || '',
                check_in_date: bookingById.check_in_date || '',
                check_out_date: bookingById.check_out_date || '',
                status: bookingById.status,
                special_request: bookingById.special_request || '',
                room_id: bookingById.room_data._id
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

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target
        if (files && files[0]) {
            const photoUrl = URL.createObjectURL(files[0])
            setBookingUpdated({
                ...bookingUpdated,
                [name]: photoUrl
            })
        }
    }
    const handleStringInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setBookingUpdated({
            ...bookingUpdated,
            [name]: value
        })
    }
    const handleStringSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        setBookingUpdated({
            ...bookingUpdated,
            [name]: value
        })
    }
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        if (!value) return
        const date = new Date(value)
        const dateISO = date.toISOString()

        setBookingUpdated({
            ...bookingUpdated,
            [name]: dateISO
        })
    }
    const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setBookingUpdated({
            ...bookingUpdated,
            [name]: value
        })
    }
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        setBookingUpdated({
            ...bookingUpdated,
            [name]: value
        })
    }
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!validateAllData()) { return }

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
    // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault()

    //     if (!validateAllData()) { return }

    //     const room = roomAll.find(room => room.id === previusRoomId)
    //     if (!room) {
    //         ToastifyError(`ERROR - room #${previusRoomId} nor found`)
    //         return
    //     }
    //     const room2 = roomAll.find(room => room.id === bookingUpdated.room_id)
    //     if (!room2) {
    //         ToastifyError(`ERROR - booking #${bookingUpdated.room_id} nor found`)
    //         return
    //     }
    //     // HACER ESTO EN LA API? EL DE bookingCreate TAMBIEN ??
    //     // if (checkIsOccupied()) {
    //     //     ToastifyError(`Room #${bookingUpdated.room_id} is occupied on dates:
    //     //                 [${bookingUpdated.check_in_date} ${bookingUpdated.check_in_time}] ⭢ [${bookingUpdated.check_out_date} ${newBooking.check_out_time}]`)
    //     //     return
    //     // }

    //     const roomUpdatedToDispatch = {
    //         ...room
    //     }
    //     const roomUpdatedToDispatch2 = {
    //         ...room2
    //     }

    //     dispatch(BookingUpdateThunk(bookingUpdated))
    //         .then(() => {
    //             ToastifySuccess(`Booking #${bookingUpdated.id} updated`, () => {
    //                 navigate('../')
    //             })
    //         })
    //         .catch((error) => {
    //             ToastifyError(error)
    //         })

    //     if (previusRoomId !== bookingUpdated.room_id) {
    //         const oldRoomUpdatedToDispatch = {
    //             ...roomUpdatedToDispatch,
    //             booking_list: roomUpdatedToDispatch.booking_list.filter(bookingId => bookingId !== previusRoomId)
    //         }
    //         console.log('--> ', bookingUpdated.room_id)
    //         const newRoomUpdatedToDispatch = {
    //             ...roomUpdatedToDispatch2,
    //             booking_list: [...roomUpdatedToDispatch2.booking_list, bookingUpdated.room_id]
    //         }

    //         dispatch(RoomUpdateThunk(oldRoomUpdatedToDispatch))
    //             .then(() => {
    //                 ToastifySuccess(`Room #${previusRoomId} booking list updated to [${oldRoomUpdatedToDispatch.booking_list}]`, () => {
    //                     navigate('../')
    //                 })
    //             })
    //             .catch((error) => {
    //                 ToastifyError(error)
    //             })
    //         dispatch(RoomUpdateThunk(newRoomUpdatedToDispatch))
    //             .then(() => {
    //                 ToastifySuccess(`Room #${bookingUpdated.room_id} booking list updated to [${newRoomUpdatedToDispatch.booking_list}]`, () => {
    //                     navigate('../')
    //                 })
    //             })
    //             .catch((error) => {
    //                 ToastifyError(error)
    //             })
    //     }
    // }

    const validateAllData = (): boolean => {
        // const errorsPhoto = validatePhoto(newBooking.photo, 'Photo')
        // if (errorsPhoto.length > 0) { errorsPhoto.map(error => ToastifyError(error)); return false }

        const errorsFullName = validateFullName(bookingUpdated.full_name_guest, 'Full name guest')
        if (errorsFullName.length > 0) { errorsFullName.map(error => ToastifyError(error)); return false }

        const errorsCheckInDate = validateCheckInCheckOut(new Date(bookingUpdated.check_in_date), new Date(bookingUpdated.check_out_date))
        if (errorsCheckInDate.length > 0) { errorsCheckInDate.map(error => ToastifyError(error)); return false }

        const errorsBookingStatus = validateBookingStatus(bookingUpdated.status, 'Booking status')
        if (errorsBookingStatus.length > 0) { errorsBookingStatus.map(error => ToastifyError(error)); return false }

        const errorsSpecialRequest = validateTextArea(bookingUpdated.special_request, 'Special request')
        if (errorsSpecialRequest.length > 0) { errorsSpecialRequest.map(error => ToastifyError(error)); return false }

        // VALIDAR ROOM_ID ??

        const errorsDateIsOccupied = validateDateIsOccupiedIfBookingExists(bookingUpdated, bookingAll)
        if (errorsDateIsOccupied.length > 0) { errorsDateIsOccupied.map(error => ToastifyError(error)); return false }

        return true
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
                        <LabelText>Guest photo</LabelText>
                        <InputTextPhoto name="photo" type='file' onChange={handlePhotoChange} />
                        <ImgUser src={bookingUpdated.photo} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Full name guest</LabelText>
                        <InputText name="full_name_guest" value={bookingUpdated.full_name_guest} onChange={handleStringInputChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Check in date</LabelText>
                        <InputDate name="check_in_date" value={formatDateForInput(bookingUpdated.check_in_date)} type="datetime-local" onChange={handleDateChange} />

                        <LabelText minWidth="10rem" margin="0 0 0 5rem">Check out date</LabelText>
                        <InputDate name="check_out_date" value={formatDateForInput(bookingUpdated.check_out_date)} type="datetime-local" onChange={handleDateChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Room number</LabelText>
                        <Select
                            value={bookingUpdated.room_id || bookingById.room_data._id}
                            onChange={(e) => setBookingUpdated({ ...bookingUpdated, room_id: e.target.value })}
                        >
                            {roomAll.map((room) => (
                                <option key={room._id} value={room._id}>
                                    {room.number}
                                </option>
                            ))}
                        </Select>

                        <LabelText minWidth="10rem" margin="0 0 0 5rem">Booking Status</LabelText>
                        <Select name="status" onChange={handleSelectChange}>
                            <Option value="null" selected></Option>
                            {Object.values(BookingStatus).map((type, index) => (
                                index === 0 ?
                                    <Option key={index} value={type} selected>{type}</Option> :
                                    <Option key={index} value={type}>{type}</Option>
                            ))}
                        </Select>
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
        </bookingUpdateStyles.SectionPageBookingUpdate>
    </>)
}