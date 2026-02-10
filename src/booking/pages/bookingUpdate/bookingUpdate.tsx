
import React from "react"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"

import * as bookingUpdateStyles from "./bookingUpdateStyles"
import { ToastContainer } from 'react-toastify'
import { ToastifySuccess } from "../../../common/components/toastify/successPopup/toastifySuccess"
import { ToastifyError } from "../../../common/components/toastify/errorPopup/toastifyError"
import { AppDispatch } from "../../../common/redux/store"
import { ApiStatus } from "../../../common/enums/ApiStatus"
import { OptionYesNo } from "../../../common/enums/optionYesNo"
import { BookingInterfaceCheckInOutId, BookingInterfaceId } from "../../interfaces/bookingInterface"
import { ApiErrorResponseInterface } from "common/interfaces/apiResponses/apiErrorResponseInterface"
import { formatDateForInput } from "../../../common/utils/dateUtils"
import { createFormHandlers } from '../../../common/utils/formHandlers'
import {
    validateCheckInCheckOutExistingBooking, validateTextArea, validateOptionYesNo, validateDateIsOccupiedIfBookingExists
} from '../../../common/utils/commonValidator'
import {
    GlobalDateTimeStyles, CtnForm, CtnPrimaryIcon, CtnSecondaryIcon, IconCalendar, IconUpdate, TitleForm, Form, InputTextPhoto, ImgUser, CtnEntry,
    Text, InputText, TextAreaJobDescription, Select, Option, InputDate, DivButtonCreateUser, SelectMultipleOptions
} from "../../../common/styles/form"
import { ButtonCreate } from '../../../common/components/buttonCreate/buttonCreate'
import { BookingFetchByIDThunk } from "../../../booking/features/thunks/bookingFetchByIDThunk"
import { BookingUpdateThunk } from "../../../booking/features/thunks/bookingUpdateThunk"
import { getBookingAllData, getBookingAllStatus, getBookingIdData, getBookingIdStatus } from "../../../booking/features/bookingSlice"
import { BookingFetchAllThunk } from "../../../booking/features/thunks/bookingFetchAllThunk"
import { getRoomAllData, getRoomAllStatus } from '../../../room/features/roomSlice'
import { RoomFetchAllThunk } from '../../../room/features/thunks/roomFetchAllThunk'
import { getClientAllData, getClientAllStatus } from "../../../client/features/clientSlice"
import { ClientFetchAllThunk } from '../../../client/features/thunks/clientFetchAllThunk'


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
    const clientAll = useSelector(getClientAllData)
    const clientAllLoading: ApiStatus = useSelector(getClientAllStatus)
    const [bookingUpdated, setBookingUpdated] = useState<BookingInterfaceId>({
        _id: '0',
        order_date: new Date(),
        check_in_date: new Date(),
        check_out_date: new Date(),
        price: 0,
        special_request: '',
        isArchived: OptionYesNo.yes,
        room_id_list: [],
        client_id: ''
    })
    const { handleDateChange,
        handleTextAreaChange,
        handleSelectChange,
        handleMultiSelectChange
    } = createFormHandlers(setBookingUpdated)

    const roomsAvailable = roomAll
        .filter(room => room.isArchived === OptionYesNo.no)
        .filter(room => {
            const bookingsOfRoom: BookingInterfaceCheckInOutId[] = bookingAll
                .filter(booking =>
                    booking.isArchived === OptionYesNo.no &&
                    booking.room_id_list.includes(room._id)
                )
                .map(booking => ({
                    _id: booking._id,
                    check_in_date: booking.check_in_date,
                    check_out_date: booking.check_out_date
                }))

            return validateDateIsOccupiedIfBookingExists(bookingUpdated, bookingsOfRoom).length === 0
        })

    // !!! DEBERÍA SER SUFICIENTE CON 1 DE LOS 2 PRIMEROS useEffects?
    useEffect(() => {
        if (bookingByIdLoading === ApiStatus.idle) { dispatch(BookingFetchByIDThunk(idParams)) }
        else if (bookingByIdLoading === ApiStatus.fulfilled) {
            if (bookingById._id !== idParams) {
                dispatch(BookingFetchByIDThunk(idParams))
            }
            setBookingUpdated({
                _id: bookingById._id || "0",
                order_date: bookingById.order_date || '',
                check_in_date: bookingById.check_in_date || '',
                check_out_date: bookingById.check_out_date || '',
                price: bookingById.price || 0,
                special_request: bookingById.special_request || '',
                isArchived: bookingById.isArchived || OptionYesNo.yes,
                room_id_list: bookingById.room_id_list || [],
                client_id: bookingById.client_id || '0'
            })
        }
    }, [bookingByIdLoading, bookingById, id])
    useEffect(() => {
        if (bookingAllLoading === ApiStatus.idle) { dispatch(BookingFetchAllThunk()) }
    }, [bookingAllLoading, bookingAll])
    useEffect(() => {
        if (roomAllLoading === ApiStatus.idle) { dispatch(RoomFetchAllThunk()) }
    }, [roomAllLoading, roomAll])
    useEffect(() => {
        if (clientAllLoading === ApiStatus.idle) { dispatch(ClientFetchAllThunk()) }
    }, [clientAllLoading, clientAll])

    const validateAllData = (): string[] => {
        const allErrorMessages: string[] = []

        if (bookingUpdated.room_id_list.length < 1) {
            allErrorMessages.push('Room ID list is empty')
        }
        if (bookingUpdated.client_id === '') {
            allErrorMessages.push('Client ID is empty')
        }

        validateTextArea(bookingUpdated.special_request, 'Booking special request').map(
            error => allErrorMessages.push(error)
        )
        validateOptionYesNo(bookingUpdated.isArchived, 'Booking isArchived').map(
            error => allErrorMessages.push(error)
        )

        // Comprobamos que los IDs de las rooms y el cliente asociados a la booking existan en BD
        const allRoomIdsNotArchived: string[] = roomAll
            .filter(room => room.isArchived === OptionYesNo.no)
            .map(room => room._id)
        for (const roomId of bookingUpdated.room_id_list) {
            if (!allRoomIdsNotArchived.includes(roomId)) {
                allErrorMessages.push(`Room ID: ${roomId} didn't exist in DB or is archived`)
            }
        }
        const allClientIdsNotArchived: string[] = clientAll
            .filter(client => client.isArchived === OptionYesNo.no)
            .map(client => client._id)
        if (!allClientIdsNotArchived.includes(bookingUpdated.client_id)) {
            allErrorMessages.push(`Client ID: ${bookingUpdated.client_id} didn't exist in DB or is archived`)
        }

        // Validaciones de booking existente:
        validateCheckInCheckOutExistingBooking(new Date(bookingUpdated.check_in_date), new Date(bookingUpdated.check_out_date)).map(
            error => allErrorMessages.push(error)
        )
        const allBookingDatesAndIdByRoomsNotArchived: BookingInterfaceCheckInOutId[] =
            bookingAll
                .filter(booking =>
                    booking.isArchived === OptionYesNo.no &&
                    booking.room_id_list.some(roomId =>
                        bookingUpdated.room_id_list.includes(roomId)
                    )
                )
                .map(booking => ({
                    _id: booking._id,
                    check_in_date: new Date(booking.check_in_date),
                    check_out_date: new Date(booking.check_out_date)
                }))
        validateDateIsOccupiedIfBookingExists(bookingUpdated, allBookingDatesAndIdByRoomsNotArchived).map(
            error => allErrorMessages.push(error)
        )



        return allErrorMessages
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const errors = validateAllData()
        if (errors.length > 0) {
            errors.forEach(error => ToastifyError(error))
            return
        }

        try {
            await dispatch(BookingUpdateThunk({ idBooking: bookingUpdated._id, updatedBookingData: bookingUpdated }))
                .unwrap()
                .then(() => ToastifySuccess('Booking updated', () => navigate('../')))
        }
        catch (error) {
            const apiError = error as ApiErrorResponseInterface
            apiError.message
                ? ToastifyError(apiError.message)
                : ToastifyError('Unexpected API Error')
        }
    }


    return (<>
        <ToastContainer />

        <GlobalDateTimeStyles />

        <bookingUpdateStyles.SectionPageBookingUpdate>
            <CtnForm>
                <CtnPrimaryIcon>
                    <CtnSecondaryIcon>
                        <IconCalendar />
                        <IconUpdate />
                    </CtnSecondaryIcon>
                </CtnPrimaryIcon>
                <TitleForm>Update Booking #{bookingUpdated._id}</TitleForm>

                <Form onSubmit={handleSubmit}>
                    <CtnEntry>
                        <Text>Check in date</Text>
                        <InputDate name="check_in_date" value={formatDateForInput(bookingUpdated.check_in_date)} type="datetime-local" onChange={handleDateChange} />

                        <Text minWidth="10rem" margin="0 0 0 5rem">Check out date</Text>
                        <InputDate name="check_out_date" value={formatDateForInput(bookingUpdated.check_out_date)} type="datetime-local" onChange={handleDateChange} />
                    </CtnEntry>

                    <CtnEntry>
                        <Text>Room number</Text>
                        <SelectMultipleOptions
                            name="room_id_list"
                            width="100%"
                            value={bookingUpdated.room_id_list}
                            onChange={handleMultiSelectChange}
                            multiple={true}
                        >
                            {roomsAvailable.length === 0
                                ? <Option value="null" disabled>❌ No rooms available for the selected dates</Option>
                                : roomsAvailable.map((room, index) => (
                                    <Option key={index} value={room._id}>
                                        {room.number}
                                    </Option>
                                ))}
                        </SelectMultipleOptions>

                        <Text minWidth="10rem" margin="0 0 0 5rem">Client</Text>
                        <Select name="client_id" value={bookingUpdated.client_id} onChange={handleSelectChange}>
                            <Option value="null"></Option>
                            {Object.values(clientAll).map(client => (
                                <Option value={client._id}>
                                    {client.full_name}
                                </Option>
                            ))}
                        </Select>
                    </CtnEntry>

                    <CtnEntry>
                        <Text>Special request</Text>
                        <TextAreaJobDescription name="special_request" value={bookingUpdated.special_request} onChange={handleTextAreaChange} ></TextAreaJobDescription>
                    </CtnEntry>

                    <DivButtonCreateUser>
                        <ButtonCreate type="submit" children='⮂ Update Booking' fontSize='1.25em'></ButtonCreate>
                    </DivButtonCreateUser>
                </Form>
            </CtnForm>
        </bookingUpdateStyles.SectionPageBookingUpdate >
    </>)
}