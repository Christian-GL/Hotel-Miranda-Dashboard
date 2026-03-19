
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { ToastContainer } from 'react-toastify'

import { getClientAllData, getClientAllStatus } from "client/features/clientSlice"
import { ClientCreateThunk } from "client/features/thunks/clientCreateThunk"
import { ClientFetchAllThunk } from "client/features/thunks/clientFetchAllThunk"
import { ClientInterface } from "client/interfaces/clientInterface"
import { ClientValidator } from "client/validators/clientValidator"
import { ButtonCreate } from 'common/components/buttonCreate/buttonCreate'
import { ToastifyError } from "common/components/toastify/errorPopup/toastifyError"
import { ToastifySuccess } from "common/components/toastify/successPopup/toastifySuccess"
import { ApiStatus } from "common/enums/ApiStatus"
import { OptionYesNo } from "common/enums/optionYesNo"
import { ApiErrorResponseInterface } from "common/interfaces/apiResponses/apiErrorResponseInterface"
import { AppDispatch } from "common/redux/store"
import { ROUTES } from "common/router/routes"
import * as styles from "common/styles/form"
import { createFormHandlers } from 'common/utils/formHandlers'


export const ClientCreate = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const clientAll = useSelector(getClientAllData)
    const clientAllLoading = useSelector(getClientAllStatus)
    const [clientNew, setClientNew] = useState<ClientInterface>({
        full_name: '',
        email: '',
        phone_number: '',
        isArchived: OptionYesNo.no,
        booking_id_list: []
    })
    const { handleStringChange } = createFormHandlers(setClientNew)

    useEffect(() => {
        if (clientAllLoading === ApiStatus.idle) { dispatch(ClientFetchAllThunk()) }
    }, [clientAllLoading, clientAll])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const clientValidator = new ClientValidator()
        const validationErrors = clientValidator.validateNewClient(clientNew)
        if (validationErrors.length > 0) {
            validationErrors.forEach(error => ToastifyError(error))
            return
        }

        try {
            await dispatch(ClientCreateThunk(clientNew))
                .unwrap()
                .then(() => ToastifySuccess('Client created', () => navigate(ROUTES.clients.root)))
        }
        catch (error) {
            const apiError = error as ApiErrorResponseInterface
            apiError.message
                ? ToastifyError('API Error: ' + apiError.message)
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