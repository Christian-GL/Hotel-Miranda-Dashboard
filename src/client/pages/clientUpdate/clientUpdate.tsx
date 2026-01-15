
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
import { ClientInterface } from "../../interfaces/clientInterface"
import { createFormHandlers } from '../../../common/utils/formHandlers'
import { validateFullName, validateEmail, validatePhoneNumber, validateMongoDBObjectIdList } from '../../../common/utils/commonValidator'
import {
    DivCtnForm, DivIcon, DivCtnIcons, IconClient, IconUpdate, TitleForm,
    Form, DivCtnEntry, LabelText, InputText, LabelTextInfoBooking, DivButtonCreateUser
} from "../../../common/styles/form"
import { ButtonCreate } from '../../../common/components/buttonCreate/buttonCreate'
import { getClientBookingsByRoom } from "../../../common/utils/clientBookingsByRoom"
import { getClientIdData, getClientIdStatus, getClientErrorMessage } from "../../../client/features/clientSlice"
import { ClientFetchByIDThunk } from "../../../client/features/thunks/clientFetchByIDThunk"
import { ClientUpdateThunk } from '../../../client/features/thunks/clientUpdateThunk'
import { RoomInterface } from "room/interfaces/roomInterface"
import { getRoomAllData, getRoomAllStatus, getRoomErrorMessage } from "../../../room/features/roomSlice"
import { RoomFetchAllThunk } from "../../../room/features/thunks/roomFetchAllThunk"
import { BookingInterface } from "../../../booking/interfaces/bookingInterface"
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
    const bookingAll: BookingInterface[] = useSelector(getBookingAllData)
    const bookingAllLoading: ApiStatus = useSelector(getBookingAllStatus)
    const bookingErrorMessage = useSelector(getBookingErrorMessage)
    const roomAll: RoomInterface[] = useSelector(getRoomAllData)
    const roomAllLoading: ApiStatus = useSelector(getRoomAllStatus)
    const roomErrorMessage = useSelector(getRoomErrorMessage)
    const [clientUpdated, setClientUpdated] = useState<ClientInterface>({
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
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (validateAllData().length > 0) {
            validateAllData().forEach(error => ToastifyError(error))
            return
        }

        dispatch(ClientUpdateThunk({ idClient: clientUpdated._id, updatedClientData: clientUpdated }))
            .then(() => {
                ToastifySuccess('Client updated', () => {
                    navigate('../')
                })
            })
            .catch((error) => {
                ToastifyError(error)
            })
    }


    return (<>
        <ToastContainer />

        <clientCreateJS.SectionPageClientUpdate>
            <DivCtnForm>
                <DivIcon>
                    <DivCtnIcons>
                        <IconClient />
                        <IconUpdate />
                    </DivCtnIcons>
                </DivIcon>
                <TitleForm>Update Client #{clientUpdated._id}</TitleForm>

                <Form onSubmit={handleSubmit}>
                    <DivCtnEntry>
                        <LabelText>Full Name</LabelText>
                        <InputText name="full_name" value={clientUpdated.full_name} onChange={handleStringChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Email</LabelText>
                        <InputText name="email" value={clientUpdated.email} onChange={handleStringChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Phone Number</LabelText>
                        <InputText name="phone_number" value={clientUpdated.phone_number} onChange={handleStringChange} />
                    </DivCtnEntry>

                    {/* !!! DEBE MOSTRAR INFO DE LAS BOOKINGS RELACIONADAS (NO EDITABLE) */}
                    <DivCtnEntry>
                        <LabelText>Room Booking List</LabelText>
                        <LabelTextInfoBooking>
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
                        </LabelTextInfoBooking>
                        {/* <InputText name="booking_id_list" value={clientUpdated.booking_id_list} onChange={handleStringChange} /> */}
                    </DivCtnEntry>

                    <DivButtonCreateUser>
                        <ButtonCreate type="submit" children='⮂ Update Client' fontSize='1.25em'></ButtonCreate>
                    </DivButtonCreateUser>
                </Form>
            </DivCtnForm>
        </clientCreateJS.SectionPageClientUpdate>
    </>)
}