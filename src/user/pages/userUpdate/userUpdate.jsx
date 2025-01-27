

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams } from "react-router-dom"

import * as userUpdateJS from "./userUpdate.js"
import { dateFormatToYYYYMMDD, dateFormatToDDMMYYYY } from '../../../common/utils/formUtils.js'
import {
    DivCtnForm, DivIcon, DivCtnIcons, IconUser, IconUpdate, TitleForm, Form, InputTextPhoto, ImgUser, DivCtnEntry,
    LabelText, InputText, TextAreaJobDescription, Select, Option, InputDate, DivButtonCreateUser
} from "../../../common/styles/form.js"
import { ButtonCreate } from '../../../common/components/buttonCreate/buttonCreate.jsx'
import { getUserIdData, getUserIdStatus, getUserError } from "../../features/userSlice.js"
import { UserFetchByIDThunk } from "../../features/thunks/userFetchByIDThunk.js"
import { UserUpdateByIdThunk } from "../../features/thunks/userUpdateByIdThunk.js"


export const UserUpdate = () => {

    const { id } = useParams()
    const userById = useSelector(getUserIdData) || []
    const userByIdLoading = useSelector(getUserIdStatus)
    const [userUpdated, setUserUpdated] = useState({
        id: 0,
        photo: '',
        full_name: '',
        email: '',
        start_date: '',
        description: '',
        phone_number: '',
        status_active: false
    })

    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(UserFetchByIDThunk(parseInt(id)))
    }, [id, dispatch])

    useEffect(() => {
        if (userByIdLoading === "idle") { dispatch(UserFetchByIDThunk(parseInt(id))) }
        else if (userByIdLoading === "fulfilled") {

            setUserUpdated({
                id: userById.id,
                photo: userById.photo || '',
                full_name: userById.full_name || '',
                email: userById.email || '',
                start_date: userById.start_date || '',
                description: userById.description || '',
                phone_number: userById.phone_number || '',
                status_active: userById.status_active || false
            })
        }
        else if (userByIdLoading === "rejected") { alert("Error en la api") }
    }, [userByIdLoading, userById])


    // QUE URL DE FOTO DEBE GUARDAR EN REDUX ???
    const handlePhotoChange = (e) => {
        const { name, files } = e.target
        if (files[0]) {
            const photoUrl = URL.createObjectURL(files[0])
            setUserUpdated({
                ...userUpdated,
                [name]: photoUrl
            })
        }
    }
    const handleFullNameChange = (e) => {
        const { name, value } = e.target
        setUserUpdated({
            ...userUpdated,
            [name]: value
        })
    }
    const handleEmailChange = (e) => {
        const { name, value } = e.target
        setUserUpdated({
            ...userUpdated,
            [name]: value
        })
    }
    const handleStartDateChange = (e) => {
        const { name, value } = e.target
        setUserUpdated({
            ...userUpdated,
            [name]: dateFormatToDDMMYYYY(value),
        })
    }
    const handleDescriptionChange = (e) => {
        const { name, value } = e.target
        setUserUpdated({
            ...userUpdated,
            [name]: value
        })
    }
    const handleContactChange = (e) => {
        const { name, value } = e.target
        setUserUpdated({
            ...userUpdated,
            [name]: value
        })
    }
    const handleStatusActiveChange = (e) => {
        const { name, value } = e.target
        setUserUpdated({
            ...userUpdated,
            [name]: value === 'false' ? false : true
        })
    }
    const handleSubmit = e => {
        e.preventDefault()
        dispatch(UserUpdateByIdThunk(userUpdated))
            .then(() => {
                alert(`User #${userUpdated.id} updated`)
            })
            .catch((error) => {
                alert(`Error updating the user #${userUpdated.id}: `, error)
            })
    }

    return (

        <userUpdateJS.SectionPageUserUpdate>
            <DivCtnForm>
                <DivIcon>
                    <DivCtnIcons>
                        <IconUser />
                        <IconUpdate />
                    </DivCtnIcons>
                </DivIcon>
                <TitleForm>Update User #{userUpdated.id}</TitleForm>

                <Form onSubmit={handleSubmit}>
                    <DivCtnEntry>
                        <LabelText>Photo</LabelText>
                        <InputTextPhoto name="photo" type='file' onChange={handlePhotoChange} />
                        <ImgUser src={userUpdated.photo} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Full name</LabelText>
                        <InputText name="full_name" value={userUpdated.full_name} onChange={handleFullNameChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Email</LabelText>
                        <InputText name="email" value={userUpdated.email} onChange={handleEmailChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Start Date</LabelText>
                        <InputDate name="start_date" type="date" value={dateFormatToYYYYMMDD(userUpdated.start_date)} onChange={handleStartDateChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Job Description</LabelText>
                        <TextAreaJobDescription name="description" type='text' value={userUpdated.description} onChange={handleDescriptionChange}></TextAreaJobDescription>
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Contact</LabelText>
                        <InputText name="phone_number" value={userUpdated.phone_number} onChange={handleContactChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Status</LabelText>
                        <Select name="status_active" value={userUpdated.status_active} onChange={handleStatusActiveChange}>
                            <Option value={true}>Active</Option>
                            <Option value={false}>Inactive</Option>
                        </Select>
                    </DivCtnEntry>

                    <DivButtonCreateUser>
                        <ButtonCreate type="submit" text='⮂ Update User' fontsize='1.25em'></ButtonCreate>
                    </DivButtonCreateUser>
                </Form>
            </DivCtnForm>
        </userUpdateJS.SectionPageUserUpdate>

    )
}