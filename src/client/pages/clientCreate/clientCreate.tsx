
import React from "react"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

import * as styles from "common/styles/form"
import { ToastContainer } from 'react-toastify'
import { ToastifySuccess } from "../../../common/components/toastify/successPopup/toastifySuccess"
import { ToastifyError } from "../../../common/components/toastify/errorPopup/toastifyError"
import { AppDispatch } from "../../../common/redux/store"
import { ApiStatus } from "../../../common/enums/ApiStatus"
import { OptionYesNo } from "common/enums/optionYesNo"
import { ClientInterface } from "../../interfaces/clientInterface"
import { ApiErrorResponseInterface } from "common/interfaces/apiResponses/apiErrorResponseInterface"
import { createFormHandlers } from '../../../common/utils/formHandlers'
import { validateFullName, validateEmail, validatePhoneNumber, validateMongoDBObjectIdList } from '../../../common/utils/validators'
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
            const apiError = error as ApiErrorResponseInterface
            apiError.message
                ? ToastifyError(apiError.message)
                : ToastifyError('Unexpected API Error')
        }
    }


    return (<>
        <ToastContainer />

        <styles.CtnSection>
            <styles.CtnPrimaryIcons>
                <styles.CtnSecondaryIcons>
                    <styles.IconClient />
                    <styles.IconPlus />
                </styles.CtnSecondaryIcons>
            </styles.CtnPrimaryIcons>
            <styles.TitleForm>Create Client</styles.TitleForm>

            <styles.CtnForm>
                <styles.Form onSubmit={handleSubmit}>
                    <styles.CtnEntryVertical>
                        <styles.Text>Full Name</styles.Text>
                        <styles.InputText name="full_name" onChange={handleStringChange} />
                    </styles.CtnEntryVertical>

                    <styles.CtnEntryVertical>
                        <styles.Text>Email</styles.Text>
                        <styles.InputText name="email" onChange={handleStringChange} />
                    </styles.CtnEntryVertical>

                    <styles.CtnEntryVertical>
                        <styles.Text>Phone Number</styles.Text>
                        <styles.InputText name="phone_number" onChange={handleStringChange} />
                    </styles.CtnEntryVertical>

                    <styles.CtnButtonCreateUser>
                        <ButtonCreate type="submit" children='+ Create Client' fontSize='1.25em'></ButtonCreate>
                    </styles.CtnButtonCreateUser>
                </styles.Form>
            </styles.CtnForm>
        </styles.CtnSection>
    </>)

}