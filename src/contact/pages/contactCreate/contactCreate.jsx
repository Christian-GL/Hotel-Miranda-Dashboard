

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"

import * as contactCreateJS from "./contactCreate.js"
import { checkFirstIDAvailable, getActualDate, getActualTime } from '../../../common/utils/formUtils.jsx'
import {
    DivCtnForm, DivIcon, DivCtnIcons, IconContact, IconPlus, TitleForm, Form, DivCtnEntry,
    LabelText, InputText, TextAreaJobDescription, DivButtonCreateUser
} from "../../../common/styles/form.js"
import { ButtonCreate } from '../../../common/components/buttonCreate/buttonCreate.jsx'
import { getContactAllData, getContactAllStatus, getContactError } from "../../../contact/features/contactSlice.js"
import { ContactFetchAllThunk } from "../../../contact/features/thunks/contactFetchAllThunk.js"
import { ContactCreateThunk } from "../../../contact/features/thunks/contactCreateThunk.js"


export const ContactCreate = () => {

    const contactAll = useSelector(getContactAllData) || []
    const contactAllLoading = useSelector(getContactAllStatus)
    const [newContact, setNewContact] = useState({
        id: 0,
        publish_date: '',
        publish_time: '',
        full_name: '',
        email: '',
        contact: '',
        comment: ''
    })
    const [nextIdAvailable, setNextIdAvailable] = useState(null)

    const dispatch = useDispatch()
    useEffect(() => {
        if (contactAllLoading === "idle") { dispatch(ContactFetchAllThunk()) }
        else if (contactAllLoading === "fulfilled") {
            if (contactAll.length > 0) {
                const id = checkFirstIDAvailable(contactAll)
                setNextIdAvailable(id)
            }
            else {
                setNextIdAvailable(1)
            }
        }
        else if (contactAllLoading === "rejected") { alert("Error en la api") }
    }, [contactAllLoading, contactAll])


    const handleFullNameChange = (e) => {
        const { name, value } = e.target
        setNewContact({
            ...newContact,
            [name]: value
        })
    }
    const handleEmailChange = (e) => {
        const { name, value } = e.target
        setNewContact({
            ...newContact,
            [name]: value
        })
    }
    const handlePhoneNumberChange = (e) => {
        const { name, value } = e.target
        setNewContact({
            ...newContact,
            [name]: value
        })
    }
    const handleCommentChange = (e) => {
        const { name, value } = e.target
        setNewContact({
            ...newContact,
            [name]: value
        })
    }
    const handleSubmit = e => {
        e.preventDefault()
        const newContactToDispatch = {
            ...newContact,
            id: nextIdAvailable,
            publish_date: getActualDate(),
            publish_time: getActualTime()
        }
        dispatch(ContactCreateThunk(newContactToDispatch))
            .then(() => {
                alert(`Contact #${newContactToDispatch.id} created`)
            })
            .catch((error) => {
                alert('Error creating the contact: ', error)
            })
    }


    return (

        <contactCreateJS.SectionPageContactCreate>
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
                        <TextAreaJobDescription name="comment" type='text' onChange={handleCommentChange} ></TextAreaJobDescription>
                    </DivCtnEntry>

                    <DivButtonCreateUser>
                        <ButtonCreate type="submit" text='+ Create Contact' fontsize='1.25em'></ButtonCreate>
                    </DivButtonCreateUser>
                </Form>
            </DivCtnForm>
        </contactCreateJS.SectionPageContactCreate>

    )
}