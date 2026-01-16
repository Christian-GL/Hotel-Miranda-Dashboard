
import React from "react"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

import * as clientCreateStyles from "./clientCreateStyles"
import { ToastContainer } from 'react-toastify'
import { ToastifySuccess } from "../../../common/components/toastify/successPopup/toastifySuccess"
import { ToastifyError } from "../../../common/components/toastify/errorPopup/toastifyError"
import { AppDispatch } from "../../../common/redux/store"
import { ApiStatus } from "../../../common/enums/ApiStatus"
import { OptionYesNo } from "common/enums/optionYesNo"
import { ClientInterfaceNoId } from "../../interfaces/clientInterface"
import { createFormHandlers } from '../../../common/utils/formHandlers'
import { validateFullName, validateEmail, validatePhoneNumber, validateMongoDBObjectIdList } from '../../../common/utils/commonValidator'
import {
    DivCtnForm, DivIcon, DivCtnIcons, IconClient, IconPlus, TitleForm,
    Form, DivCtnEntry, LabelText, InputText, DivButtonCreateUser
} from "../../../common/styles/form"
import { ButtonCreate } from '../../../common/components/buttonCreate/buttonCreate'
import { getClientAllData, getClientAllStatus, getClientErrorMessage } from "../../../client/features/clientSlice"
import { ClientFetchAllThunk } from "../../../client/features/thunks/clientFetchAllThunk"
import { ClientCreateThunk } from "../../../client/features/thunks/clientCreateThunk"


export const ClientCreate = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const clientAll = useSelector(getClientAllData)
    const clientAllLoading = useSelector(getClientAllStatus)
    const clientErrorMessage = useSelector(getClientErrorMessage)
    const [newClient, setNewClient] = useState<ClientInterfaceNoId>({
        full_name: '',
        email: '',
        phone_number: '',
        isArchived: OptionYesNo.no,
        booking_id_list: []
    })
    const { handleStringChange } = createFormHandlers(setNewClient)

    useEffect(() => {
        if (clientAllLoading === ApiStatus.idle) { dispatch(ClientFetchAllThunk()) }
        else if (clientAllLoading === ApiStatus.fulfilled) { }
        else if (clientAllLoading === ApiStatus.rejected && clientErrorMessage) { ToastifyError(clientErrorMessage) }
    }, [clientAllLoading, clientAll])

    const validateAllData = (): string[] => {
        const allErrorMessages: string[] = []

        validateFullName(newClient.full_name, 'Full name').map(
            error => allErrorMessages.push(error)
        )
        validateEmail(newClient.email, 'Email').map(
            error => allErrorMessages.push(error)
        )
        validatePhoneNumber(newClient.phone_number, 'Phone number').map(
            error => allErrorMessages.push(error)
        )
        validateMongoDBObjectIdList(newClient.booking_id_list, 'Booking ID list').map(
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
            await dispatch(ClientCreateThunk(newClient))
                .unwrap()
                .then(() => ToastifySuccess('Client created', () => navigate('../')))
        }
        catch (error) {
            ToastifyError(String(error))
        }
    }


    return (<>
        <ToastContainer />

        <clientCreateStyles.SectionPageClientCreate>
            <DivCtnForm>
                <DivIcon>
                    <DivCtnIcons>
                        <IconClient />
                        <IconPlus />
                    </DivCtnIcons>
                </DivIcon>
                <TitleForm>Create Client</TitleForm>

                <Form onSubmit={handleSubmit}>
                    <DivCtnEntry>
                        <LabelText>Full Name</LabelText>
                        <InputText name="full_name" onChange={handleStringChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Email</LabelText>
                        <InputText name="email" onChange={handleStringChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Phone Number</LabelText>
                        <InputText name="phone_number" onChange={handleStringChange} />
                    </DivCtnEntry>

                    <DivButtonCreateUser>
                        <ButtonCreate type="submit" children='+ Create Client' fontSize='1.25em'></ButtonCreate>
                    </DivButtonCreateUser>
                </Form>
            </DivCtnForm>
        </clientCreateStyles.SectionPageClientCreate>
    </>)
}