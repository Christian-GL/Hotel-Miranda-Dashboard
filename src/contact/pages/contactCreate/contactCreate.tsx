
import React from "react"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

import * as contactCreateStyles from "./contactCreateStyles"
import { ToastContainer } from 'react-toastify'
import { ToastifySuccess } from "../../../common/components/toastify/successPopup/toastifySuccess"
import { ToastifyError } from "../../../common/components/toastify/errorPopup/toastifyError"
import { AppDispatch } from "../../../common/redux/store"
import { ApiStatus } from "../../../common/enums/ApiStatus"
import { ContactInterfaceNoId } from "../../interfaces/contactInterface"
import { validateFullName, validateEmail, validateTextArea, validatePhoneNumber } from '../../../common/utils/validators'
import {
    DivCtnForm, DivIcon, DivCtnIcons, IconContact, IconPlus, TitleForm, Form, DivCtnEntry,
    LabelText, InputText, TextAreaJobDescription, DivButtonCreateUser
} from "../../../common/styles/form"
import { ButtonCreate } from '../../../common/components/buttonCreate/buttonCreate'
import { getContactAllData, getContactAllStatus } from "../../../contact/features/contactSlice"
import { ContactFetchAllThunk } from "../../../contact/features/thunks/contactFetchAllThunk"
import { ContactCreateThunk } from "../../../contact/features/thunks/contactCreateThunk"
import { ContactArchivedType } from "../../enums/contactArchivedType"


export const ContactCreate = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const contactAll = useSelector(getContactAllData)
    const contactAllLoading = useSelector(getContactAllStatus)
    const [newContact, setNewContact] = useState<ContactInterfaceNoId>({
        publish_date: '',
        full_name: '',
        email: '',
        phone_number: '',
        comment: '',
        archived: ContactArchivedType.notArchived
    })

    useEffect(() => {
        if (contactAllLoading === ApiStatus.idle) { dispatch(ContactFetchAllThunk()) }
        else if (contactAllLoading === ApiStatus.fulfilled) { }
        else if (contactAllLoading === ApiStatus.rejected) { alert("Error in API create contact") }
    }, [contactAllLoading, contactAll])

    const handleStringChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setNewContact({
            ...newContact,
            [name]: value
        })
    }
    const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setNewContact({
            ...newContact,
            [name]: value
        })
    }
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!validateAllData()) { return }

        const newContactToDispatch = {
            ...newContact,
            publish_date: new Date().toISOString()
        }

        dispatch(ContactCreateThunk(newContactToDispatch))
            .then(() => {
                ToastifySuccess('Contact created', () => {
                    navigate('../')
                })
            })
            .catch((error) => {
                ToastifyError(error)
            })
    }

    const validateAllData = (): boolean => {
        const errorsFullName = validateFullName(newContact.full_name, 'Full Name')
        if (errorsFullName.length > 0) { errorsFullName.map(error => ToastifyError(error)); return false }

        const errorsEmail = validateEmail(newContact.email, 'Email')
        if (errorsEmail.length > 0) { errorsEmail.map(error => ToastifyError(error)); return false }

        const errorsPhoneNumber = validatePhoneNumber(newContact.phone_number, 'Phone Number')
        if (errorsPhoneNumber.length > 0) { errorsPhoneNumber.map(error => ToastifyError(error)); return false }

        const errorsTextArea = validateTextArea(newContact.comment, 'Comment')
        if (errorsTextArea.length > 0) { errorsTextArea.map(error => ToastifyError(error)); return false }

        return true
    }


    return (<>
        <ToastContainer />

        <contactCreateStyles.SectionPageContactCreate>
            <DivCtnForm>
                <DivIcon>
                    <DivCtnIcons>
                        <IconContact />
                        <IconPlus />
                    </DivCtnIcons>
                </DivIcon>
                <TitleForm>Create Contact</TitleForm>

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

                    <DivCtnEntry>
                        <LabelText>Comment</LabelText>
                        <TextAreaJobDescription name="comment" onChange={handleTextAreaChange} ></TextAreaJobDescription>
                    </DivCtnEntry>

                    <DivButtonCreateUser>
                        <ButtonCreate type="submit" children='+ Create Contact' fontSize='1.25em'></ButtonCreate>
                    </DivButtonCreateUser>
                </Form>
            </DivCtnForm>
        </contactCreateStyles.SectionPageContactCreate>
    </>)
}