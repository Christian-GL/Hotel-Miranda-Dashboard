
import React from "react"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"

import * as contactCreateJS from "./contactUpdateStyles.ts"
import { ToastContainer } from 'react-toastify'
import { ToastifySuccess } from "../../../common/components/toastify/successPopup/toastifySuccess.tsx"
import { ToastifyError } from "../../../common/components/toastify/errorPopup/toastifyError.tsx"
import { AppDispatch } from "../../../common/redux/store.ts"
import { ApiStatus } from "../../../common/enums/ApiStatus.ts"
import { ContactInterface } from "../../interfaces/contactInterface.ts"
import { validateFullName, validateEmail, validateTextArea, validatePhoneNumber } from '../../../common/utils/validators.ts'
import {
    DivCtnForm, DivIcon, DivCtnIcons, IconContact, IconUpdate, TitleForm, Form, DivCtnEntry,
    LabelText, InputText, TextAreaJobDescription, DivButtonCreateUser
} from "../../../common/styles/form.ts"
import { ButtonCreate } from '../../../common/components/buttonCreate/buttonCreate.tsx'
import { getContactIdData, getContactIdStatus } from "../../../contact/features/contactSlice.ts"
import { ContactFetchByIDThunk } from "../../../contact/features/thunks/contactFetchByIDThunk.ts"
import { ContactUpdateThunk } from '../../../contact/features/thunks/contactUpdateThunk.ts'
import { ContactArchivedType } from "../../enums/ContactArchivedType.ts"


export const ContactUpdate = () => {

    const { id } = useParams()
    const idParams = parseInt(id!)
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const contactById = useSelector(getContactIdData)
    const contactByIdLoading = useSelector(getContactIdStatus)
    const [contactUpdated, setContactUpdated] = useState<ContactInterface>({
        _id: 0,
        publish_date: '',
        full_name: '',
        email: '',
        phone_number: '',
        comment: '',
        archived: ContactArchivedType.notArchived
    })

    useEffect(() => {
        if (contactByIdLoading === ApiStatus.idle) { dispatch(ContactFetchByIDThunk(idParams)) }
        else if (contactByIdLoading === ApiStatus.fulfilled) {
            if (contactById._id !== idParams) {
                dispatch(ContactFetchByIDThunk(idParams))
            }
            setContactUpdated({
                _id: contactById._id,
                publish_date: contactById.publish_date || '',
                full_name: contactById.full_name || '',
                email: contactById.email || '',
                phone_number: contactById.phone_number || '',
                comment: contactById.comment || '',
                archived: contactById.archived
            })
        }
        else if (contactByIdLoading === ApiStatus.rejected) { alert("Error in API update contact") }
    }, [contactByIdLoading, contactById, id])

    const handleStringChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setContactUpdated({
            ...contactUpdated,
            [name]: value
        })
    }
    const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setContactUpdated({
            ...contactUpdated,
            [name]: value
        })
    }
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!validateAllData()) { return }

        dispatch(ContactUpdateThunk({ idContact: contactUpdated._id, updatedContactData: contactUpdated }))
            .then(() => {
                ToastifySuccess('Contact updated', () => {
                    navigate('../')
                })
            })
            .catch((error) => {
                ToastifyError(error)
            })
    }

    const validateAllData = (): boolean => {

        const errorsFullName = validateFullName(contactUpdated.full_name, 'Full Name')
        if (errorsFullName.length > 0) { errorsFullName.map(error => ToastifyError(error)); return false }

        const errorsEmail = validateEmail(contactUpdated.email, 'Email')
        if (errorsEmail.length > 0) { errorsEmail.map(error => ToastifyError(error)); return false }

        const errorsPhoneNumber = validatePhoneNumber(contactUpdated.phone_number, 'Phone Number')
        if (errorsPhoneNumber.length > 0) { errorsPhoneNumber.map(error => ToastifyError(error)); return false }

        const errorsTextArea = validateTextArea(contactUpdated.comment, 'Comment')
        if (errorsTextArea.length > 0) { errorsTextArea.map(error => ToastifyError(error)); return false }

        return true
    }


    return (<>
        <ToastContainer />

        <contactCreateJS.SectionPageContactUpdate>
            <DivCtnForm>
                <DivIcon>
                    <DivCtnIcons>
                        <IconContact />
                        <IconUpdate />
                    </DivCtnIcons>
                </DivIcon>
                <TitleForm>Update Contact #{contactUpdated._id}</TitleForm>

                <Form onSubmit={handleSubmit}>
                    <DivCtnEntry>
                        <LabelText>Full Name</LabelText>
                        <InputText name="full_name" value={contactUpdated.full_name} onChange={handleStringChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Email</LabelText>
                        <InputText name="email" value={contactUpdated.email} onChange={handleStringChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Phone Number</LabelText>
                        <InputText name="phone_number" value={contactUpdated.phone_number} onChange={handleStringChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Comment</LabelText>
                        <TextAreaJobDescription name="comment" value={contactUpdated.comment} onChange={handleTextAreaChange} ></TextAreaJobDescription>
                    </DivCtnEntry>

                    <DivButtonCreateUser>
                        <ButtonCreate type="submit" children='⮂ Update Contact' fontSize='1.25em'></ButtonCreate>
                    </DivButtonCreateUser>
                </Form>
            </DivCtnForm>
        </contactCreateJS.SectionPageContactUpdate>
    </>)
}