
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
import { ClientInterface } from "../../interfaces/clientInterface"
import { validateFullName, validateEmail, validateTextArea, validatePhoneNumber } from '../../../common/utils/validators'
import {
    DivCtnForm, DivIcon, DivCtnIcons, IconClient, IconUpdate, TitleForm, Form, DivCtnEntry,
    LabelText, InputText, TextAreaJobDescription, DivButtonCreateUser
} from "../../../common/styles/form"
import { ButtonCreate } from '../../../common/components/buttonCreate/buttonCreate'
import { getClientIdData, getClientIdStatus } from "../../../client/features/clientSlice"
import { ClientFetchByIDThunk } from "../../../client/features/thunks/clientFetchByIDThunk"
import { ClientUpdateThunk } from '../../../client/features/thunks/clientUpdateThunk'
import { OptionYesNo } from "common/enums/optionYesNo"


export const ClientUpdate = () => {

    const { id } = useParams()
    const idParams = id!
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const clientById = useSelector(getClientIdData)
    const clientByIdLoading = useSelector(getClientIdStatus)
    const [clientUpdated, setClientUpdated] = useState<ClientInterface>({
        _id: "0",
        publish_date: '',
        full_name: '',
        email: '',
        phone_number: '',
        comment: '',
        isArchived: OptionYesNo.no
    })

    useEffect(() => {
        if (clientByIdLoading === ApiStatus.idle) { dispatch(ClientFetchByIDThunk(idParams)) }
        else if (clientByIdLoading === ApiStatus.fulfilled) {
            if (clientById._id !== idParams) {
                dispatch(ClientFetchByIDThunk(idParams))
            }
            setClientUpdated({
                _id: clientById._id,
                publish_date: clientById.publish_date || '',
                full_name: clientById.full_name || '',
                email: clientById.email || '',
                phone_number: clientById.phone_number || '',
                comment: clientById.comment || '',
                isArchived: clientById.isArchived
            })
        }
        else if (clientByIdLoading === ApiStatus.rejected) { alert("Error in API update client") }
    }, [clientByIdLoading, clientById, id])

    const handleStringChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setClientUpdated({
            ...clientUpdated,
            [name]: value
        })
    }
    const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setClientUpdated({
            ...clientUpdated,
            [name]: value
        })
    }
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!validateAllData()) { return }

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

    const validateAllData = (): boolean => {

        const errorsFullName = validateFullName(clientUpdated.full_name, 'Full Name')
        if (errorsFullName.length > 0) { errorsFullName.map(error => ToastifyError(error)); return false }

        const errorsEmail = validateEmail(clientUpdated.email, 'Email')
        if (errorsEmail.length > 0) { errorsEmail.map(error => ToastifyError(error)); return false }

        const errorsPhoneNumber = validatePhoneNumber(clientUpdated.phone_number, 'Phone Number')
        if (errorsPhoneNumber.length > 0) { errorsPhoneNumber.map(error => ToastifyError(error)); return false }

        const errorsTextArea = validateTextArea(clientUpdated.comment, 'Comment')
        if (errorsTextArea.length > 0) { errorsTextArea.map(error => ToastifyError(error)); return false }

        return true
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

                    <DivCtnEntry>
                        <LabelText>Comment</LabelText>
                        <TextAreaJobDescription name="comment" value={clientUpdated.comment} onChange={handleTextAreaChange} ></TextAreaJobDescription>
                    </DivCtnEntry>

                    <DivButtonCreateUser>
                        <ButtonCreate type="submit" children='⮂ Update Client' fontSize='1.25em'></ButtonCreate>
                    </DivButtonCreateUser>
                </Form>
            </DivCtnForm>
        </clientCreateJS.SectionPageClientUpdate>
    </>)
}