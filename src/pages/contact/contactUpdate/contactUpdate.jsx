

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams } from "react-router-dom"

import * as contactCreateJS from "./contactUpdate.js"
import {
    DivCtnForm, DivIcon, DivCtnIcons, IconContact, IconPlus, Form, DivCtnEntry,
    LabelText, InputText, TextAreaJobDescription, DivButtonCreateUser
} from '../../../common/styles/form.js'
import { ButtonCreate } from '../../../common/components/buttonCreate/buttonCreate.jsx'
import { getContactIdData, getContactIdStatus, getContactIdError } from "../features/contactSlice.js"
import { ContactFetchByIDThunk } from "../features/thunks/contactFetchByIDThunk.js"
import { ContactUpdateByIdThunk } from '../features/thunks/contactUpdateByIdThunk.js'


export const ContactUpdate = () => {

    const { id } = useParams()
    const contactById = useSelector(getContactIdData) || []
    const contactByIdLoading = useSelector(getContactIdStatus)
    const [contactUpdated, setContactUpdated] = useState({
        id: id || 0,
        publish_date: 'sss',
        publish_time: 'sss',
        fullname: 'sss',
        email: 'sss',
        contact: 'sss',
        comment: 'sss'
    });

    const dispatch = useDispatch()
    useEffect(() => {
        if (contactByIdLoading === "idle") { dispatch(ContactFetchByIDThunk(parseInt(id))) }
        else if (contactByIdLoading === "fulfilled" && contactById.length > 0) {
            setContactUpdated({
                id: contactById[0].id,
                publish_date: contactById[0].publish_date || '',
                publish_time: contactById[0].publish_time || '',
                fullname: contactById[0].full_name || '',
                email: contactById[0].email || '',
                contact: contactById[0].contact || '',
                comment: contactById[0].comment || ''
            })
        }
        else if (contactByIdLoading === "rejected") { alert("Error en la api") }
    }, [contactByIdLoading, contactById, id])

    const handleFullNameChange = (e) => {
        const { name, value } = e.target
        setContactUpdated({
            ...contactUpdated,
            [name]: value
        })
    }
    const handleEmailChange = (e) => {
        const { name, value } = e.target
        setContactUpdated({
            ...contactUpdated,
            [name]: value
        })
    }
    const handlePhoneNumberChange = (e) => {
        const { name, value } = e.target
        setContactUpdated({
            ...contactUpdated,
            [name]: value
        })
    }
    const handleCommentChange = (e) => {
        const { name, value } = e.target
        setContactUpdated({
            ...contactUpdated,
            [name]: value
        })
    }
    const handleSubmit = e => {
        e.preventDefault();
        dispatch(ContactUpdateByIdThunk(contactUpdated))
        alert(`Contact #${contactUpdated.id} updated`)
    }

    return (

        <contactCreateJS.SectionPageContactUpdate>
            <DivCtnForm>
                <DivIcon>
                    <DivCtnIcons>
                        <IconContact />
                        <IconPlus />
                    </DivCtnIcons>
                </DivIcon>

                <Form onSubmit={handleSubmit}>
                    <DivCtnEntry>
                        <LabelText>Full Name</LabelText>
                        <InputText name="fullname" value={contactUpdated.fullname} onChange={handleFullNameChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Email</LabelText>
                        <InputText name="email" value={contactUpdated.email} onChange={handleEmailChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Phone Number</LabelText>
                        <InputText name="contact" value={contactUpdated.contact} onChange={handlePhoneNumberChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Comment</LabelText>
                        <TextAreaJobDescription name="comment" value={contactUpdated.comment} type='text' onChange={handleCommentChange} ></TextAreaJobDescription>
                    </DivCtnEntry>

                    <DivButtonCreateUser>
                        <ButtonCreate type="submit" text='Update Contact' fontsize='1.25em'></ButtonCreate>
                    </DivButtonCreateUser>
                </Form>
            </DivCtnForm>
        </contactCreateJS.SectionPageContactUpdate>

    )
}