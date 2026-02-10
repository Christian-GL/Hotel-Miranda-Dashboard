
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
import { ClientInterface } from "../../interfaces/clientInterface"
import { createFormHandlers } from '../../../common/utils/formHandlers'
import { validateFullName, validateEmail, validatePhoneNumber, validateMongoDBObjectIdList } from '../../../common/utils/commonValidator'
import {
    CtnForm, CtnPrimaryIcon, CtnSecondaryIcon, IconClient, IconPlus, TitleForm,
    Form, CtnEntry, Text, InputText, DivButtonCreateUser
} from "../../../common/styles/form"
import { ButtonCreate } from '../../../common/components/buttonCreate/buttonCreate'
import { getClientAllData, getClientAllStatus } from "../../../client/features/clientSlice"
import { ClientFetchAllThunk } from "../../../client/features/thunks/clientFetchAllThunk"
import { ClientCreateThunk } from "../../../client/features/thunks/clientCreateThunk"


export const ClientCreate = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const clientAll = useSelector(getClientAllData)
    const clientAllLoading = useSelector(getClientAllStatus)
    const [newClient, setNewClient] = useState<ClientInterface>({
        full_name: '',
        email: '',
        phone_number: '',
        isArchived: OptionYesNo.no,
        booking_id_list: []
    })
    const { handleStringChange } = createFormHandlers(setNewClient)

    useEffect(() => {
        if (clientAllLoading === ApiStatus.idle) { dispatch(ClientFetchAllThunk()) }
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
            <CtnForm>
                <CtnPrimaryIcon>
                    <CtnSecondaryIcon>
                        <IconClient />
                        <IconPlus />
                    </CtnSecondaryIcon>
                </CtnPrimaryIcon>
                <TitleForm>Create Client</TitleForm>

                <Form onSubmit={handleSubmit}>
                    <CtnEntry>
                        <Text>Full Name</Text>
                        <InputText name="full_name" onChange={handleStringChange} />
                    </CtnEntry>

                    <CtnEntry>
                        <Text>Email</Text>
                        <InputText name="email" onChange={handleStringChange} />
                    </CtnEntry>

                    <CtnEntry>
                        <Text>Phone Number</Text>
                        <InputText name="phone_number" onChange={handleStringChange} />
                    </CtnEntry>

                    <DivButtonCreateUser>
                        <ButtonCreate type="submit" children='+ Create Client' fontSize='1.25em'></ButtonCreate>
                    </DivButtonCreateUser>
                </Form>
            </CtnForm>
        </clientCreateStyles.SectionPageClientCreate>
    </>)
}