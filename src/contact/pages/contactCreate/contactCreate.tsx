
import React from "react"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

import * as contactCreateStyles from "./contactCreateStyles.ts"
import { ToastContainer } from 'react-toastify'
import { ToastifySuccess } from "../../../common/components/toastify/successPopup/toastifySuccess.tsx"
import { ToastifyError } from "../../../common/components/toastify/errorPopup/toastifyError.tsx"
import { AppDispatch } from "../../../common/redux/store.ts"
import { ApiStatus } from "../../../common/enums/ApiStatus.ts"
import { ContactInterface } from "../../interfaces/contactInterface.ts"
import {
    checkFirstIDAvailable, getActualDate, getActualTime, validateName,
    validateEmail, validateTextArea, validatePhoneNumber
} from '../../../common/utils/formUtils.ts'
import {
    DivCtnForm, DivIcon, DivCtnIcons, IconContact, IconPlus, TitleForm, Form, DivCtnEntry,
    LabelText, InputText, TextAreaJobDescription, DivButtonCreateUser
} from "../../../common/styles/form.ts"
import { ButtonCreate } from '../../../common/components/buttonCreate/buttonCreate.tsx'
import { getContactAllData, getContactAllStatus, getContactError } from "../../../contact/features/contactSlice.ts"
import { ContactFetchAllThunk } from "../../../contact/features/thunks/contactFetchAllThunk.ts"
import { ContactCreateThunk } from "../../../contact/features/thunks/contactCreateThunk.ts"


export const ContactCreate = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const contactAll = useSelector(getContactAllData)
    const contactAllLoading = useSelector(getContactAllStatus)
    const [newContact, setNewContact] = useState<ContactInterface>({
        id: 0,
        publish_date: '',
        publish_time: '',
        full_name: '',
        email: '',
        contact: '',
        comment: ''
    })
    const [nextIdAvailable, setNextIdAvailable] = useState<number>(0)

    useEffect(() => {
        if (contactAllLoading === ApiStatus.idle) { dispatch(ContactFetchAllThunk()) }
        else if (contactAllLoading === ApiStatus.fulfilled) {
            if (contactAll.length > 0) {
                const id = checkFirstIDAvailable(contactAll.map(item => item.id))
                setNextIdAvailable(id)
            }
            else { setNextIdAvailable(1) }
        }
        else if (contactAllLoading === ApiStatus.rejected) { alert("Error en la api de contact create") }
    }, [contactAllLoading, contactAll])


    const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setNewContact({
            ...newContact,
            [name]: value
        })
    }
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setNewContact({
            ...newContact,
            [name]: value
        })
    }
    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setNewContact({
            ...newContact,
            [name]: value
        })
    }
    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
            id: nextIdAvailable,
            publish_date: getActualDate(),
            publish_time: getActualTime()
        }
        dispatch(ContactCreateThunk(newContactToDispatch))
            .then(() => {
                ToastifySuccess(`Contact #${newContactToDispatch.id} created`, () => {
                    navigate('../')
                })
            })
            .catch((error) => {
                ToastifyError(error)
            })
    }

    const validateAllData = (): boolean => {
        const checkName = validateName(newContact.full_name)
        if (!checkName.test) {
            checkName.errorMessages.map(error => ToastifyError(error))
            return false
        }
        const checkEmail = validateEmail(newContact.email)
        if (!checkEmail.test) {
            checkEmail.errorMessages.map(error => ToastifyError(error))
            return false
        }
        const checkPhoneNumber = validatePhoneNumber(newContact.contact)
        if (!checkPhoneNumber.test) {
            checkPhoneNumber.errorMessages.map(error => ToastifyError(error))
            return false
        }
        const checkTextArea = validateTextArea(newContact.comment)
        if (!checkTextArea.test) {
            checkTextArea.errorMessages.map(error => ToastifyError(error))
            return false
        }

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
                        <InputText name="full_name" onChange={handleFullNameChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Email</LabelText>
                        <InputText name="email" onChange={handleEmailChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Phone Number</LabelText>
                        <InputText name="contact" onChange={handlePhoneNumberChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Comment</LabelText>
                        <TextAreaJobDescription name="comment" onChange={handleCommentChange} ></TextAreaJobDescription>
                    </DivCtnEntry>

                    <DivButtonCreateUser>
                        <ButtonCreate type="submit" children='+ Create Contact' fontSize='1.25em'></ButtonCreate>
                    </DivButtonCreateUser>
                </Form>
            </DivCtnForm>
        </contactCreateStyles.SectionPageContactCreate>
    </>)
}