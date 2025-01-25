
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"

import * as userCreateJS from "./userCreate.js"
import { checkFirstIDAvailable } from '../../../common/utils/formutils.js'
import {
    DivCtnForm, DivIcon, DivCtnIcons, IconUser, IconPlus, TitleForm, Form, InputTextPhoto, ImgUser, DivCtnEntry,
    LabelText, InputText, TextAreaJobDescription, Select, Option, InputDate, DivButtonCreateUser
} from "../../../common/styles/form.js"
import { ButtonCreate } from '../../../common/components/buttonCreate/buttonCreate.jsx'
import { getUserAllData, getUserAllStatus, getUserError } from "../../features/userSlice.js"
import { UserFetchAllThunk } from "../../features/thunks/userFetchAllThunk.js"
import { UserCreateThunk } from "../../features/thunks/userCreateThunk.js"


export const UserCreate = () => {

    const userAll = useSelector(getUserAllData) || []
    const userAllLoading = useSelector(getUserAllStatus)
    const [newUser, setNewUser] = useState({
        id: 0,
        photo: '',
        full_name: '',
        email: '',
        start_date: '',
        description: '',
        phone_number: '',
        status_active: false
    })
    const [nextIdAvailable, setNextIdAvailable] = useState(null)

    const dispatch = useDispatch()
    useEffect(() => {
        if (userAllLoading === "idle") { dispatch(UserFetchAllThunk()) }
        else if (userAllLoading === "fulfilled") {
            if (userAll.length > 0) {
                const id = checkFirstIDAvailable(userAll)
                setNextIdAvailable(id)
            }
            else {
                setNextIdAvailable(1)
            }
        }
        else if (userAllLoading === "rejected") { alert("Error en la api") }
    }, [userAllLoading, userAll])


    // QUE URL DE FOTO DEBE GUARDAR EN REDUX ???
    const handlePhotoChange = (e) => {
        const { name, files } = e.target
        if (files[0]) {
            const photoUrl = URL.createObjectURL(files[0])
            setNewUser({
                ...newUser,
                [name]: photoUrl
            })
        }
    }
    const handleFullNameChange = (e) => {
        const { name, value } = e.target
        setNewUser({
            ...newUser,
            [name]: value
        })
    }
    const handleEmailChange = (e) => {
        const { name, value } = e.target
        setNewUser({
            ...newUser,
            [name]: value
        })
    }
    const handleStartDateChange = (e) => {
        const { name, value } = e.target
        const [year, month, day] = value.split("-")
        const dateFormatted = `${day}-${month}-${year}`
        setNewUser({
            ...newUser,
            [name]: dateFormatted
        })
    }
    const handleDescriptionChange = (e) => {
        const { name, value } = e.target
        setNewUser({
            ...newUser,
            [name]: value
        })
    }
    const handleContactChange = (e) => {
        const { name, value } = e.target
        setNewUser({
            ...newUser,
            [name]: value
        })
    }
    const handleStatusActiveChange = (e) => {
        const { name, value } = e.target
        setNewUser({
            ...newUser,
            [name]: value === 'false' ? false : true
        })
    }
    const handleSubmit = e => {
        e.preventDefault()
        const newUserToDispatch = {
            ...newUser,
            id: nextIdAvailable
        }
        dispatch(UserCreateThunk(newUserToDispatch))
            .then(() => {
                alert(`User #${newUserToDispatch.id} created`)
            })
            .catch((error) => {
                alert('Error creating the user: ', error)
            })
    }

    return (

        <userCreateJS.SectionPageUserCreate>
            <DivCtnForm>
                <DivIcon>
                    <DivCtnIcons>
                        <IconUser />
                        <IconPlus />
                    </DivCtnIcons>
                </DivIcon>
                <TitleForm>Create User</TitleForm>

                <Form onSubmit={handleSubmit}>
                    <DivCtnEntry>
                        <LabelText>Photo</LabelText>
                        <InputTextPhoto name="photo" type='file' onChange={handlePhotoChange} />
                        <ImgUser src={newUser.photo} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Full name</LabelText>
                        <InputText name="full_name" onChange={handleFullNameChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Email</LabelText>
                        <InputText name="email" onChange={handleEmailChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Start Date</LabelText>
                        <InputDate name="start_date" type="date" onChange={handleStartDateChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Job Description</LabelText>
                        <TextAreaJobDescription name="description" type='text' onChange={handleDescriptionChange}></TextAreaJobDescription>
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Contact</LabelText>
                        <InputText name="phone_number" onChange={handleContactChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Status</LabelText>
                        <Select name="status_active" onChange={handleStatusActiveChange}>
                            <Option value={true}>Active</Option>
                            <Option value={false}>Inactive</Option>
                        </Select>
                    </DivCtnEntry>

                    <DivButtonCreateUser>
                        <ButtonCreate type="submit" text='+ Create User' fontsize='1.25em'></ButtonCreate>
                    </DivButtonCreateUser>
                </Form>
            </DivCtnForm>
        </userCreateJS.SectionPageUserCreate>

    )
}