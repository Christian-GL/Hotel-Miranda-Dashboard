
import React from "react"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"
import { useTheme } from "styled-components"

import * as styles from "common/styles/form"
import { reactSelectStyles } from "common/styles/externalLibrariesStyles"
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
import { ReactSelectOption } from "common/types/reactMultiSelectOption"
import {
    validateCheckInCheckOutExistingBooking, validateTextArea, validateOptionYesNo, validateDateIsOccupiedIfBookingExists
} from '../../../common/utils/commonValidator'
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
    const theme = useTheme()
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
        handleReactSingleSelectChange,
        handleReactMultiSelectChange,
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
    const clientsAvailable = Object.values(clientAll).filter(client => client.isArchived === OptionYesNo.no)
    const roomNumbersReactOptions: ReactSelectOption<string>[] = roomsAvailable.length > 0
        ? roomsAvailable.map(room => ({
            value: room._id,
            label: room.number
        }))
        : []
    const clientReactOptions: ReactSelectOption<string>[] = clientsAvailable.map(client => ({
        value: client._id,
        label: client.full_name
    }))

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
        <styles.GlobalDateTimeStyles />

        <styles.CtnSection>
            <styles.CtnPrimaryIcons>
                <styles.CtnSecondaryIcons>
                    <styles.IconCalendar />
                    <styles.IconUpdate />
                </styles.CtnSecondaryIcons>
            </styles.CtnPrimaryIcons>
            <styles.TitleForm>Update Booking #{bookingUpdated._id}</styles.TitleForm>

            <styles.CtnForm>
                <styles.Form onSubmit={handleSubmit}>
                    <styles.CtnEntryVertical>
                        <styles.CtnEntryHorizontal>
                            <styles.CtnEntryVertical removePaddingSeparator={true}>
                                <styles.Text>Check in date</styles.Text>
                                <styles.InputDate name="check_in_date" value={formatDateForInput(bookingUpdated.check_in_date)} type="datetime-local" onChange={(e) => { handleDateChange(e) }} />
                            </styles.CtnEntryVertical>
                            <styles.CtnEntryVertical removePaddingSeparator={true}>
                                <styles.Text>Check out date</styles.Text>
                                <styles.InputDate name="check_out_date" value={formatDateForInput(bookingUpdated.check_out_date)} type="datetime-local" onChange={(e) => { handleDateChange(e) }} />
                            </styles.CtnEntryVertical>
                        </styles.CtnEntryHorizontal>
                    </styles.CtnEntryVertical>

                    <styles.CtnEntryVertical>
                        <styles.CtnEntryHorizontal>
                            <styles.CtnEntryVertical removePaddingSeparator={true}>
                                <styles.Text>Room number</styles.Text>
                                <styles.SelectReact
                                    name="room_id_list"
                                    menuPlacement="top"
                                    menuPosition="fixed"
                                    placeholder={"Select room numbers"}
                                    isMulti={true}
                                    styles={reactSelectStyles(theme)}
                                    closeMenuOnSelect={false}
                                    options={roomNumbersReactOptions}
                                    value={roomNumbersReactOptions.filter(option => bookingUpdated.room_id_list.includes(option.value))}
                                    onChange={handleReactMultiSelectChange("room_id_list")}
                                />
                            </styles.CtnEntryVertical>
                            <styles.CtnEntryVertical removePaddingSeparator={true}>
                                <styles.Text>Client</styles.Text>
                                <styles.SelectReact
                                    name="client_id"
                                    menuPlacement="top"
                                    menuPosition="fixed"
                                    placeholder="Select client"
                                    isMulti={false}
                                    styles={reactSelectStyles(theme)}
                                    closeMenuOnSelect={true}
                                    options={clientReactOptions}
                                    value={clientReactOptions.find(option => option.value === bookingUpdated.client_id)}
                                    onChange={handleReactSingleSelectChange("client_id")}
                                />
                            </styles.CtnEntryVertical>
                        </styles.CtnEntryHorizontal>
                    </styles.CtnEntryVertical>

                    <styles.CtnEntryVertical>
                        <styles.Text>Special request</styles.Text>
                        <styles.TextAreaJobDescription name="special_request" value={bookingUpdated.special_request} onChange={handleTextAreaChange} ></styles.TextAreaJobDescription>
                    </styles.CtnEntryVertical>

                    <styles.CtnButtonCreateUser>
                        <ButtonCreate type="submit" children='⮂ Update Booking' fontSize='1.25em'></ButtonCreate>
                    </styles.CtnButtonCreateUser>
                </styles.Form>
            </styles.CtnForm>
        </styles.CtnSection>
    </>)
}