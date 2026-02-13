
import React from "react"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"

import * as styles from "common/styles/form"
import { ToastContainer } from 'react-toastify'
import { ToastifySuccess } from "../../../common/components/toastify/successPopup/toastifySuccess"
import { ToastifyError } from "../../../common/components/toastify/errorPopup/toastifyError"
import { AppDispatch } from "../../../common/redux/store"
import { ApiStatus } from "../../../common/enums/ApiStatus"
import { OptionYesNo } from "common/enums/optionYesNo"
import { ClientInterfaceId } from "../../interfaces/clientInterface"
import { ApiErrorResponseInterface } from "common/interfaces/apiResponses/apiErrorResponseInterface"
import { createFormHandlers } from '../../../common/utils/formHandlers'
import { validateFullName, validateEmail, validatePhoneNumber, validateMongoDBObjectIdList } from '../../../common/utils/commonValidator'
import { ButtonCreate } from '../../../common/components/buttonCreate/buttonCreate'
import { getClientIdData, getClientIdStatus } from "../../../client/features/clientSlice"
import { ClientFetchByIDThunk } from "../../../client/features/thunks/clientFetchByIDThunk"
import { ClientUpdateThunk } from '../../../client/features/thunks/clientUpdateThunk'


export const ClientUpdate = () => {

    const { id } = useParams()
    const idParams = id!
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const clientById = useSelector(getClientIdData)
    const clientByIdLoading = useSelector(getClientIdStatus)
    const [clientUpdated, setClientUpdated] = useState<ClientInterfaceId>({
        _id: "0",
        full_name: '',
        email: '',
        phone_number: '',
        isArchived: OptionYesNo.no,
        booking_id_list: []
    })
    const { handleStringChange } = createFormHandlers(setClientUpdated)

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
    }, [clientByIdLoading, clientById, id])

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
                    <styles.IconUpdate />
                </styles.CtnSecondaryIcons>
            </styles.CtnPrimaryIcons>
            <styles.TitleForm>Update Client #{clientUpdated._id}</styles.TitleForm>

            <styles.CtnForm>
                <styles.Form onSubmit={handleSubmit}>
                    <styles.CtnEntryVertical>
                        <styles.Text>Full Name</styles.Text>
                        <styles.InputText name="full_name" value={clientUpdated.full_name} onChange={handleStringChange} />
                    </styles.CtnEntryVertical>

                    <styles.CtnEntryVertical>
                        <styles.Text>Email</styles.Text>
                        <styles.InputText name="email" value={clientUpdated.email} onChange={handleStringChange} />
                    </styles.CtnEntryVertical>

                    <styles.CtnEntryVertical>
                        <styles.Text>Phone Number</styles.Text>
                        <styles.InputText name="phone_number" value={clientUpdated.phone_number} onChange={handleStringChange} />
                    </styles.CtnEntryVertical>

                    <styles.CtnButtonCreateUser>
                        <ButtonCreate type="submit" children='⮂ Update Client' fontSize='1.25em'></ButtonCreate>
                    </styles.CtnButtonCreateUser>
                </styles.Form>
            </styles.CtnForm>
        </styles.CtnSection>
    </>)

}