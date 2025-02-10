
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
import {
    dateFormatToYYYYMMDD, dateFormatToDDMMYYYY, hourFormatTo12H, hourFormatTo24H,
    validatePhoto, validateName, validateDateAndTime, validateTextArea, validateRoomNumber, validateBookingStatus
} from '../../../common/utils/formUtils.ts'
import {
    GlobalDateTimeStyles, DivCtnForm, DivIcon, DivCtnIcons, IconCalendar, IconUpdate, TitleForm, Form, InputTextPhoto, ImgUser, DivCtnEntry,
    LabelText, InputText, TextAreaJobDescription, Select, Option, InputDate, DivButtonCreateUser
} from "../../../common/styles/form.ts"
import { ButtonCreate } from '../../../common/components/buttonCreate/buttonCreate.tsx'
import { getBookingIdData, getBookingIdStatus } from "../../../booking/features/bookingSlice.ts"
import { BookingFetchByIDThunk } from "../../../booking/features/thunks/bookingFetchByIDThunk.ts"
import { BookingUpdateThunk } from "../../../booking/features/thunks/bookingUpdateThunk.ts"
import { getRoomAllData, getRoomAllStatus } from '../../../room/features/roomSlice.ts'
import { RoomFetchAllThunk } from '../../../room/features/thunks/roomFetchAllThunk.ts'
import { RoomUpdateThunk } from "../../../room/features/thunks/roomUpdateThunk.ts"


export const BookingUpdate = () => {

    const { id } = useParams()
    const idParams = parseInt(id!)
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const bookingById = useSelector(getBookingIdData)
    const bookingByIdLoading = useSelector(getBookingIdStatus)
    const roomAll = useSelector(getRoomAllData)
    const roomAllLoading = useSelector(getRoomAllStatus)
    const previusRoomId: number = bookingById.room_id || 0
    const [bookingUpdated, setBookingUpdated] = useState<BookingInterface>({
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
        if (bookingByIdLoading === ApiStatus.idle) { dispatch(BookingFetchByIDThunk(idParams)) }
        else if (bookingByIdLoading === ApiStatus.fulfilled) {
            if (bookingById?.id !== idParams) {
                dispatch(BookingFetchByIDThunk(idParams))
            }
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
        }
        else if (bookingByIdLoading === ApiStatus.rejected) { alert("Error en la api de booking update > bookings") }
    }, [bookingByIdLoading, bookingById, id])
    useEffect(() => {
        if (roomAllLoading === ApiStatus.idle) { dispatch(RoomFetchAllThunk()) }
        else if (roomAllLoading === ApiStatus.fulfilled) { }
        else if (roomAllLoading === ApiStatus.rejected) { alert("Error en la api de booking update > rooms") }
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
    const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setBookingUpdated({
            ...bookingUpdated,
            [name]: value
        })
    }
    const handleCheckInDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setBookingUpdated({
            ...bookingUpdated,
            [name]: dateFormatToDDMMYYYY(value)
        })
    }
    const handleCheckInTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setBookingUpdated({
            ...bookingUpdated,
            [name]: hourFormatTo12H(value)
        })
    }
    const handleCheckOutDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setBookingUpdated({
            ...bookingUpdated,
            [name]: dateFormatToDDMMYYYY(value)
        })
    }
    const handleCheckOutTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setBookingUpdated({
            ...bookingUpdated,
            [name]: hourFormatTo12H(value)
        })
    }
    const handleSpecialRequestChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setBookingUpdated({
            ...bookingUpdated,
            [name]: value
        })
    }
    const handleIdRoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        setBookingUpdated({
            ...bookingUpdated,
            [name]: parseInt(value)
        })
    }
    const handleBookingRoomStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        setBookingUpdated({
            ...bookingUpdated,
            [name]: value
        })
    }
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!validateAllData()) { return }

        const room = roomAll.find(room => room.id === previusRoomId)
        if (!room) {
            ToastifyError(`ERROR - room #${previusRoomId} nor found`)
            return
        }
        const room2 = roomAll.find(room => room.id === bookingUpdated.room_id)
        if (!room2) {
            ToastifyError(`ERROR - booking #${bookingUpdated.room_id} nor found`)
            return
        }
        // HACER ESTO EN LA API? EL DE bookingCreate TAMBIEN ??
        // if (checkIsOccupied()) {
        //     ToastifyError(`Room #${bookingUpdated.room_id} is occupied on dates:
        //                 [${bookingUpdated.check_in_date} ${bookingUpdated.check_in_time}] ⭢ [${bookingUpdated.check_out_date} ${newBooking.check_out_time}]`)
        //     return
        // }

        const roomUpdatedToDispatch = {
            ...room
        }
        const roomUpdatedToDispatch2 = {
            ...room2
        }

        dispatch(BookingUpdateThunk(bookingUpdated))
            .then(() => {
                ToastifySuccess(`Booking #${bookingUpdated.id} updated`, () => {
                    navigate('../')
                })
            })
            .catch((error) => {
                ToastifyError(error)
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
                    ToastifySuccess(`Room #${previusRoomId} booking list updated to [${oldRoomUpdatedToDispatch.booking_list}]`, () => {
                        navigate('../')
                    })
                })
                .catch((error) => {
                    ToastifyError(error)
                })
            dispatch(RoomUpdateThunk(newRoomUpdatedToDispatch))
                .then(() => {
                    ToastifySuccess(`Room #${bookingUpdated.room_id} booking list updated to [${newRoomUpdatedToDispatch.booking_list}]`, () => {
                        navigate('../')
                    })
                })
                .catch((error) => {
                    ToastifyError(error)
                })
        }
    }

    const validateAllData = (): boolean => {
        // const checkPhoto = validatePhoto(bookingUpdated.photo)
        const checkGuestName = validateName(bookingUpdated.full_name_guest)
        const checkInDate = validateDateAndTime(bookingUpdated.check_in_date)
        const checkInTime = validateDateAndTime(bookingUpdated.check_in_time)
        const checkOutDate = validateDateAndTime(bookingUpdated.check_out_date)
        const checkOutTime = validateDateAndTime(bookingUpdated.check_in_time)
        const checkSpecialRequest = validateTextArea(bookingUpdated.special_request)
        const checkRoomNumber = validateRoomNumber(bookingUpdated.room_id)
        const checkBookingStatus = validateBookingStatus(bookingUpdated.room_booking_status)

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

        <bookingUpdateStyles.SectionPageBookingUpdate>
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
                        <TextAreaJobDescription name="special_request" value={bookingUpdated.special_request} onChange={handleSpecialRequestChange} ></TextAreaJobDescription>
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
        </bookingUpdateStyles.SectionPageBookingUpdate>
    </>)
}