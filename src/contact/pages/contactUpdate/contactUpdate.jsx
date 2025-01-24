
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams } from "react-router-dom"

import * as contactCreateJS from "./contactUpdate.js"
import {
    DivCtnForm, DivIcon, DivCtnIcons, IconContact, IconUpdate, TitleForm, Form, DivCtnEntry,
    LabelText, InputText, TextAreaJobDescription, DivButtonCreateUser
} from "../../../common/components/form/form.js"
import { ButtonCreate } from '../../../common/components/buttonCreate/buttonCreate.jsx'
import { getContactIdData, getContactIdStatus, getContactError } from "../../../contact/features/contactSlice.js"
import { ContactFetchByIDThunk } from "../../../contact/features/thunks/contactFetchByIDThunk.js"
import { ContactUpdateByIdThunk } from '../../../contact/features/thunks/contactUpdateByIdThunk.js'


export const ContactUpdate = () => {

    const { id } = useParams()
    const contactById = useSelector(getContactIdData) || {}
    const contactByIdLoading = useSelector(getContactIdStatus)
    const [contactUpdated, setContactUpdated] = useState({
        id: 0,
        publish_date: '',
        publish_time: '',
        fullname: '',
        email: '',
        contact: '',
        comment: ''
    });

    const dispatch = useDispatch()
    useEffect(() => {
        if (contactByIdLoading === "idle") { dispatch(ContactFetchByIDThunk(parseInt(id))) }
        else if (contactByIdLoading === "fulfilled" && Object.keys(contactById).length !== 0) {
            setContactUpdated({
                id: contactById.id,
                publish_date: contactById.publish_date || '',
                publish_time: contactById.publish_time || '',
                full_name: contactById.full_name || '',
                email: contactById.email || '',
                contact: contactById.contact || '',
                comment: contactById.comment || ''
            })
        }
        else if (contactByIdLoading === "rejected") { alert("Error en la api") }
    }, [contactByIdLoading, contactById])

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

            .then(() => {
                alert(`Contact #${contactUpdated.id} updated`)
            })
            .catch((error) => {
                alert(`Error updating the contact #${contactUpdated.id}: `, error)
            })
    }

    return (

        <contactCreateJS.SectionPageContactUpdate>
            <DivCtnForm>
                <DivIcon>
                    <DivCtnIcons>
                        <IconContact />
                        <IconUpdate />
                    </DivCtnIcons>
                </DivIcon>
                <TitleForm>Update Contact #{contactUpdated.id}</TitleForm>

                <Form onSubmit={handleSubmit}>
                    <DivCtnEntry>
                        <LabelText>Full Name</LabelText>
                        <InputText name="full_name" value={contactUpdated.full_name} onChange={handleFullNameChange} />
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
                        <ButtonCreate type="submit" text='⮂ Update Contact' fontsize='1.25em'></ButtonCreate>
                    </DivButtonCreateUser>
                </Form>
            </DivCtnForm>
        </contactCreateJS.SectionPageContactUpdate>

    )
}