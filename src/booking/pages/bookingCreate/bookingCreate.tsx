
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
import { OptionYesNo } from "../../../common/enums/optionYesNo"
import { BookingInterfaceCheckInOut, BookingInterface } from "../../interfaces/bookingInterface"
import { createFormHandlers } from '../../../common/utils/formHandlers'
import {
    validateCheckInCheckOutNewBooking, validateTextArea, validateOptionYesNo, validateDateIsOccupied
} from '../../../common/utils/commonValidator'
import {
    GlobalDateTimeStyles, CtnForm, CtnPrimaryIcon, CtnSecondaryIcon, IconCalendar, IconPlus, TitleForm, Form, CtnEntry,
    Text, ArrayBox, ArrayItem, ButtonAddDelete, TextAreaJobDescription, Select, Option, InputDate, DivButtonCreateUser,
    SelectMultipleOptions
} from "../../../common/styles/form"
import { ButtonCreate } from '../../../common/components/buttonCreate/buttonCreate'
import { getBookingAllData, getBookingAllStatus } from "../../../booking/features/bookingSlice"
import { BookingFetchAllThunk } from "../../../booking/features/thunks/bookingFetchAllThunk"
import { BookingCreateThunk } from "../../../booking/features/thunks/bookingCreateThunk"
import { getRoomAllData, getRoomAllStatus } from '../../../room/features/roomSlice'
import { RoomFetchAllThunk } from '../../../room/features/thunks/roomFetchAllThunk'
import { getClientAllData, getClientAllStatus } from "../../../client/features/clientSlice"
import { ClientFetchAllThunk } from '../../../client/features/thunks/clientFetchAllThunk'


export const BookingCreate = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const bookingAll = useSelector(getBookingAllData)
    const bookingAllLoading = useSelector(getBookingAllStatus)
    const roomAll = useSelector(getRoomAllData)
    const roomAllLoading = useSelector(getRoomAllStatus)
    const clientAll = useSelector(getClientAllData)
    const clientAllLoading: ApiStatus = useSelector(getClientAllStatus)
    const [newBooking, setNewBooking] = useState<BookingInterface>({
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
        handleMultiSelectChange,
    } = createFormHandlers(setNewBooking)

    const [checkInTouched, setCheckInTouched] = useState(false)
    const [checkOutTouched, setCheckOutTouched] = useState(false)
    const datesSelected = checkInTouched && checkOutTouched
    const roomsAvailable = !datesSelected
        ? []
        : roomAll.filter(room => {
            const bookingsOfRoom: BookingInterfaceCheckInOut[] = bookingAll
                .filter(booking => booking.room_id_list.includes(room._id))
                .map(booking => ({
                    check_in_date: booking.check_in_date,
                    check_out_date: booking.check_out_date
                }))

            return validateDateIsOccupied(newBooking, bookingsOfRoom).length === 0
        })

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

        if (newBooking.room_id_list.length < 1) {
            allErrorMessages.push('Room ID list is empty')
        }
        if (newBooking.client_id === '') {
            allErrorMessages.push('Client ID is empty')
        }

        validateTextArea(newBooking.special_request, 'Booking special request').map(
            error => allErrorMessages.push(error)
        )
        validateOptionYesNo(newBooking.isArchived, 'Booking isArchived').map(
            error => allErrorMessages.push(error)
        )
        validateCheckInCheckOutNewBooking(newBooking.check_in_date, newBooking.check_out_date).map(
            error => allErrorMessages.push(error)
        )

        const bookingDates: BookingInterfaceCheckInOut[] = bookingAll.map(booking => ({
            check_in_date: booking.check_in_date,
            check_out_date: booking.check_out_date
        }))
        validateDateIsOccupied(newBooking, bookingDates).map(
            error => allErrorMessages.push(error)
        )

        // Comprobamos que los IDs de las rooms y el cliente asociados a la booking existan en BD
        const allRoomIdsNotArchived: string[] = roomAll
            .filter(room => room.isArchived === OptionYesNo.no)
            .map(room => room._id)
        for (const roomId of newBooking.room_id_list) {
            if (!allRoomIdsNotArchived.includes(roomId)) {
                allErrorMessages.push(`Room ID: ${roomId} didn't exist in DB or is archived`)
            }
        }
        const allClientIdsNotArchived: string[] = clientAll
            .filter(client => client.isArchived === OptionYesNo.no)
            .map(client => client._id)
        if (!allClientIdsNotArchived.includes(newBooking.client_id)) {
            allErrorMessages.push(`Client ID: ${newBooking.client_id} didn't exist in DB or is archived`)
        }

        return allErrorMessages
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const errors = validateAllData()
        if (errors.length > 0) {
            errors.forEach(error => ToastifyError(error))
            return
        }

        const newBookingToDispatch = {
            ...newBooking,
            order_date: new Date()
        }

        try {
            await dispatch(BookingCreateThunk(newBookingToDispatch))
                .unwrap()
                .then(() => ToastifySuccess('Booking created', () => navigate('../')))
        }
        catch (error) {
            ToastifyError(String(error))
        }
    }


    return (<>
        <ToastContainer />

        <GlobalDateTimeStyles />

        <bookingCreateStyles.SectionPageBookingCreate>
            <CtnForm>
                <CtnPrimaryIcon>
                    <CtnSecondaryIcon>
                        <IconCalendar />
                        <IconPlus />
                    </CtnSecondaryIcon>
                </CtnPrimaryIcon>
                <TitleForm>Create Booking</TitleForm>

                <Form onSubmit={handleSubmit}>
                    <CtnEntry>
                        <Text>Check in date</Text>
                        <InputDate name="check_in_date" type="datetime-local" onChange={(e) => {
                            setCheckInTouched(true)
                            handleDateChange(e)
                        }} />

                        <Text minWidth="10rem" margin="0 0 0 5rem">Check out date</Text>
                        <InputDate name="check_out_date" type="datetime-local" onChange={(e) => {
                            setCheckOutTouched(true)
                            handleDateChange(e)
                        }} />
                    </CtnEntry>

                    <CtnEntry>
                        <Text>Room number</Text>
                        <SelectMultipleOptions
                            name="room_id_list"
                            width="100%"
                            onChange={handleMultiSelectChange}
                            multiple={true}
                        >
                            {!datesSelected
                                ? <Option value="null" disabled>⚠️ Select Check-in date & Check-out date first</Option>
                                : roomsAvailable.length === 0
                                    ? <Option value="null" disabled>❌ No rooms available for the selected dates</Option>
                                    : roomsAvailable.map((room, index) => (
                                        <Option key={index} value={room._id}>
                                            {room.number}
                                        </Option>
                                    ))}
                        </SelectMultipleOptions>
                        {/* <Select
                            name="room_id_list"
                            onChange={handleSelectAppendToArray("room_id_list")}
                            value={newBooking.room_id_list[0]}
                            disabled={!datesSelected || roomsAvailable.length === 0}
                        >
                            {!datesSelected
                                ? (<Option value="null" disabled>⚠️ Select Check-in date & Check-out date first</Option>)
                                : roomsAvailable.length === 0
                                    ? (<Option value="null" disabled>❌ No rooms available for the selected dates</Option>)
                                    : (<>
                                        <Option value="null"></Option>
                                        {roomsAvailable.map(room => (
                                            <Option value={room._id}>
                                                {room.number}
                                            </Option>
                                        ))}</>
                                    )}
                        </Select> */}

                        <Text minWidth="10rem" margin="0 0 0 5rem">Client</Text>
                        <Select name="client_id" onChange={handleSelectChange}>
                            <Option value="null"></Option>
                            {Object.values(clientAll).map(client => (
                                <Option value={client._id}>
                                    {client.full_name}
                                </Option>
                            ))}
                        </Select>
                    </CtnEntry>

                    {/* <CtnEntry>
                        {newBooking.room_id_list.length > 0 && (
                            <ArrayBox>
                                {newBooking.room_id_list.map((room, index) => (
                                    <ArrayItem key={index}>
                                        {room}
                                        <ButtonAddDelete
                                            margin="0 0 0 0.35rem"
                                            isAdd={false}
                                        // onClick={() => handleRemoveTelefono(index)}
                                        > &times;
                                        </ButtonAddDelete>
                                    </ArrayItem>
                                ))}
                            </ArrayBox>
                        )}
                    </CtnEntry> */}

                    <CtnEntry>
                        <Text>Special request</Text>
                        <TextAreaJobDescription name="special_request" onChange={handleTextAreaChange} ></TextAreaJobDescription>
                    </CtnEntry>

                    <DivButtonCreateUser>
                        <ButtonCreate type="submit" children='+ Create Booking' fontSize='1.25em'></ButtonCreate>
                    </DivButtonCreateUser>
                </Form>
            </CtnForm>
        </bookingCreateStyles.SectionPageBookingCreate>

    </>)
}