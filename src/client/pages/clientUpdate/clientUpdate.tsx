
import React from "react"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"

import * as clientCreateJS from "./clientUpdateStyles"
import { ToastContainer } from 'react-toastify'
import { ToastifySuccess } from "../../../common/components/toastify/successPopup/toastifySuccess"
import { ToastifyError } from "../../../common/components/toastify/errorPopup/toastifyError"
import { AppDispatch } from "../../../common/redux/store"
import { ApiStatus } from "../../../common/enums/ApiStatus"
import { OptionYesNo } from "common/enums/optionYesNo"
import { ClientInterfaceId } from "../../interfaces/clientInterface"
import { createFormHandlers } from '../../../common/utils/formHandlers'
import { validateFullName, validateEmail, validatePhoneNumber, validateMongoDBObjectIdList } from '../../../common/utils/commonValidator'
import {
    CtnForm, CtnPrimaryIcon, CtnSecondaryIcon, IconClient, IconUpdate, TitleForm,
    Form, CtnEntry, Text, InputText, TextInfoBooking, DivButtonCreateUser
} from "../../../common/styles/form"
import { ButtonCreate } from '../../../common/components/buttonCreate/buttonCreate'
import { getClientBookingsByRoom } from "../../../common/utils/clientBookingsByRoom"
import { getClientIdData, getClientIdStatus, getClientErrorMessage } from "../../../client/features/clientSlice"
import { ClientFetchByIDThunk } from "../../../client/features/thunks/clientFetchByIDThunk"
import { ClientUpdateThunk } from '../../../client/features/thunks/clientUpdateThunk'
import { RoomInterfaceId } from "room/interfaces/roomInterface"
import { getRoomAllData, getRoomAllStatus, getRoomErrorMessage } from "../../../room/features/roomSlice"
import { RoomFetchAllThunk } from "../../../room/features/thunks/roomFetchAllThunk"
import { BookingInterfaceId } from "../../../booking/interfaces/bookingInterface"
import { getBookingAllData, getBookingAllStatus, getBookingErrorMessage } from "../../../booking/features/bookingSlice"
import { BookingFetchAllThunk } from "../../../booking/features/thunks/bookingFetchAllThunk"


export const ClientUpdate = () => {

    const { id } = useParams()
    const idParams = id!
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const clientById = useSelector(getClientIdData)
    const clientByIdLoading = useSelector(getClientIdStatus)
    const clientErrorMessage = useSelector(getClientErrorMessage)
    const bookingAll: BookingInterfaceId[] = useSelector(getBookingAllData)
    const bookingAllLoading: ApiStatus = useSelector(getBookingAllStatus)
    const bookingErrorMessage = useSelector(getBookingErrorMessage)
    const roomAll: RoomInterfaceId[] = useSelector(getRoomAllData)
    const roomAllLoading: ApiStatus = useSelector(getRoomAllStatus)
    const roomErrorMessage = useSelector(getRoomErrorMessage)
    const [clientUpdated, setClientUpdated] = useState<ClientInterfaceId>({
        _id: "0",
        full_name: '',
        email: '',
        phone_number: '',
        isArchived: OptionYesNo.no,
        booking_id_list: []
    })
    const { handleStringChange } = createFormHandlers(setClientUpdated)
    const clientBookingsByRoom = getClientBookingsByRoom(clientUpdated, bookingAll, roomAll)

    useEffect(() => {
        if (clientByIdLoading === ApiStatus.idle) { dispatch(ClientFetchByIDThunk(idParams)) }
        else if (clientByIdLoading === ApiStatus.fulfilled) {
            if (clientById._id !== idParams) {
                dispatch(ClientFetchByIDThunk(idParams))
            }
            setClientUpdated({
                _id: clientById._id,
                full_name: clientById.full_name || '',
                email: clientById.email || '',
                phone_number: clientById.phone_number || '',
                isArchived: clientById.isArchived,
                booking_id_list: clientById.booking_id_list || []
            })
        }
        else if (clientByIdLoading === ApiStatus.rejected && clientErrorMessage) { ToastifyError(clientErrorMessage) }
    }, [clientByIdLoading, clientById, id])
    useEffect(() => {
        if (roomAllLoading === ApiStatus.idle) { dispatch(RoomFetchAllThunk()) }
        else if (roomAllLoading === ApiStatus.fulfilled) { }
        else if (roomAllLoading === ApiStatus.rejected && roomErrorMessage) { ToastifyError(roomErrorMessage) }
    }, [roomAllLoading, roomAll])
    useEffect(() => {
        if (bookingAllLoading === ApiStatus.idle) { dispatch(BookingFetchAllThunk()) }
        else if (bookingAllLoading === ApiStatus.fulfilled) { }
        else if (bookingAllLoading === ApiStatus.rejected && bookingErrorMessage) { ToastifyError(bookingErrorMessage) }
    }, [bookingAllLoading, bookingAll])

    const validateAllData = (): string[] => {
        const allErrorMessages: string[] = []

        validateFullName(clientUpdated.full_name, 'Full name').map(
            error => allErrorMessages.push(error)
        )
        validateEmail(clientUpdated.email, 'Email').map(
            error => allErrorMessages.push(error)
        )
        validatePhoneNumber(clientUpdated.phone_number, 'Phone number').map(
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
            await dispatch(ClientUpdateThunk({ idClient: clientUpdated._id, updatedClientData: clientUpdated }))
                .unwrap()
                .then(() => ToastifySuccess('Client updated', () => navigate('../')))
        }
        catch (error) {
            ToastifyError(String(error))
        }
    }


    return (<>
        <ToastContainer />

        <clientCreateJS.SectionPageClientUpdate>
            <CtnForm>
                <CtnPrimaryIcon>
                    <CtnSecondaryIcon>
                        <IconClient />
                        <IconUpdate />
                    </CtnSecondaryIcon>
                </CtnPrimaryIcon>
                <TitleForm>Update Client #{clientUpdated._id}</TitleForm>

                <Form onSubmit={handleSubmit}>
                    <CtnEntry>
                        <Text>Full Name</Text>
                        <InputText name="full_name" value={clientUpdated.full_name} onChange={handleStringChange} />
                    </CtnEntry>

                    <CtnEntry>
                        <Text>Email</Text>
                        <InputText name="email" value={clientUpdated.email} onChange={handleStringChange} />
                    </CtnEntry>

                    <CtnEntry>
                        <Text>Phone Number</Text>
                        <InputText name="phone_number" value={clientUpdated.phone_number} onChange={handleStringChange} />
                    </CtnEntry>

                    {/* !!! DEBE MOSTRAR INFO DE LAS BOOKINGS RELACIONADAS (NO EDITABLE) */}
                    <CtnEntry>
                        <Text>Room Booking List</Text>
                        <TextInfoBooking>
                            {
                                clientBookingsByRoom.length > 0 ? (
                                    clientBookingsByRoom.map(booking => (
                                        <p key={booking.bookingId}>
                                            {booking.roomNumbers.join(', ')}
                                        </p>
                                    ))
                                ) : (
                                    <p>No bookings yet</p>
                                )
                            }
                        </TextInfoBooking>
                        {/* <InputText name="booking_id_list" value={clientUpdated.booking_id_list} onChange={handleStringChange} /> */}
                    </CtnEntry>

                    <DivButtonCreateUser>
                        <ButtonCreate type="submit" children='⮂ Update Client' fontSize='1.25em'></ButtonCreate>
                    </DivButtonCreateUser>
                </Form>
            </CtnForm>
        </clientCreateJS.SectionPageClientUpdate>
    </>)
}