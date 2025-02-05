
import React from "react"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams } from "react-router-dom"

import * as contactCreateJS from "./contactUpdateStyles.ts"
import { AppDispatch } from "../../../common/redux/store.ts"
import { ApiStatus } from "../../../common/enums/ApiStatus.ts"
import { ContactInterface } from "../../interfaces/contactInterface.ts"
import {
    DivCtnForm, DivIcon, DivCtnIcons, IconContact, IconUpdate, TitleForm, Form, DivCtnEntry,
    LabelText, InputText, TextAreaJobDescription, DivButtonCreateUser
} from "../../../common/styles/form.ts"
import { ButtonCreate } from '../../../common/components/buttonCreate/buttonCreate.tsx'
import { getContactIdData, getContactIdStatus, getContactError } from "../../../contact/features/contactSlice.ts"
import { ContactFetchByIDThunk } from "../../../contact/features/thunks/contactFetchByIDThunk.ts"
import { ContactUpdateThunk } from '../../../contact/features/thunks/contactUpdateThunk.ts'


export const ContactUpdate = () => {

    const { id } = useParams()
    const idParams = parseInt(id!)
    const dispatch = useDispatch<AppDispatch>()
    const contactById = useSelector(getContactIdData)
    const contactByIdLoading = useSelector(getContactIdStatus)
    const [contactUpdated, setContactUpdated] = useState<ContactInterface>({
        id: 0,
        publish_date: '',
        publish_time: '',
        full_name: '',
        email: '',
        contact: '',
        comment: ''
    })

    useEffect(() => {
        dispatch(ContactFetchByIDThunk(idParams))
    }, [id, dispatch])
    useEffect(() => {
        if (contactByIdLoading === ApiStatus.idle) { dispatch(ContactFetchByIDThunk(idParams)) }
        else if (contactByIdLoading === ApiStatus.fulfilled) {
            if (contactById) {
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
        }
        else if (contactByIdLoading === ApiStatus.rejected) { alert("Error en la api de contact update") }
    }, [contactByIdLoading, contactById])

    const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setContactUpdated({
            ...contactUpdated,
            [name]: value
        })
    }
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setContactUpdated({
            ...contactUpdated,
            [name]: value
        })
    }
    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setContactUpdated({
            ...contactUpdated,
            [name]: value
        })
    }
    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setContactUpdated({
            ...contactUpdated,
            [name]: value
        })
    }
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(ContactUpdateThunk(contactUpdated))
            .then(() => {
                alert(`Contact #${contactUpdated.id} updated`)
            })
            .catch((error) => {
                alert(error)
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
                        <TextAreaJobDescription name="comment" value={contactUpdated.comment} onChange={handleCommentChange} ></TextAreaJobDescription>
                    </DivCtnEntry>

                    <DivButtonCreateUser>
                        <ButtonCreate type="submit" children='⮂ Update Contact' fontSize='1.25em'></ButtonCreate>
                    </DivButtonCreateUser>
                </Form>
            </DivCtnForm>
        </contactCreateJS.SectionPageContactUpdate>

    )
}