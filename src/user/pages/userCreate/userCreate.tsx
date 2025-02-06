
import React from "react"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"

import * as userCreateStyles from "./userCreate.ts"
import { AppDispatch } from "../../../common/redux/store.ts"
import { ApiStatus } from "../../../common/enums/ApiStatus.ts"
import { UserInterface } from "../../interfaces/userInterface.ts"
import { checkFirstIDAvailable } from '../../../common/utils/formUtils.ts'
import {
    GlobalDateTimeStyles, DivCtnForm, DivIcon, DivCtnIcons, IconUser, IconPlus, TitleForm, Form, InputTextPhoto, ImgUser, DivCtnEntry,
    LabelText, InputText, TextAreaJobDescription, Select, Option, InputDate, DivButtonCreateUser
} from "../../../common/styles/form.ts"
import { ButtonCreate } from '../../../common/components/buttonCreate/buttonCreate.tsx'
import { getUserAllData, getUserAllStatus } from "../../features/userSlice.ts"
import { UserFetchAllThunk } from "../../features/thunks/userFetchAllThunk.ts"
import { UserCreateThunk } from "../../features/thunks/userCreateThunk.ts"


export const UserCreate = () => {

    const dispatch = useDispatch<AppDispatch>()
    const userAll = useSelector(getUserAllData)
    const userAllLoading = useSelector(getUserAllStatus)
    const [newUser, setNewUser] = useState<UserInterface>({
        id: 0,
        photo: '',
        full_name: '',
        email: '',
        start_date: '',
        description: '',
        phone_number: '',
        status_active: false
    })
    const [nextIdAvailable, setNextIdAvailable] = useState<number>(0)

    useEffect(() => {
        if (userAllLoading === ApiStatus.idle) { dispatch(UserFetchAllThunk()) }
        else if (userAllLoading === ApiStatus.fulfilled) {
            if (userAll.length > 0) {
                const id = checkFirstIDAvailable(userAll)
                setNextIdAvailable(id)
            }
            else { setNextIdAvailable(1) }
        }
        else if (userAllLoading === ApiStatus.rejected) { alert("Error en la api de user create") }
    }, [userAllLoading, userAll])

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target
        if (files && files[0]) {
            const photoUrl = URL.createObjectURL(files[0])
            setNewUser({
                ...newUser,
                [name]: photoUrl
            })
        }
    }
    const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setNewUser({
            ...newUser,
            [name]: value
        })
    }
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setNewUser({
            ...newUser,
            [name]: value
        })
    }
    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        const [year, month, day] = value.split("-")
        const dateFormatted = `${day}-${month}-${year}`
        setNewUser({
            ...newUser,
            [name]: dateFormatted
        })
    }
    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setNewUser({
            ...newUser,
            [name]: value
        })
    }
    const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setNewUser({
            ...newUser,
            [name]: value
        })
    }
    const handleStatusActiveChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        setNewUser({
            ...newUser,
            [name]: value === 'false' ? false : true
        })
    }
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
                alert(error)
            })
    }


    return (<>

        <GlobalDateTimeStyles />

        <userCreateStyles.SectionPageUserCreate>
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
                        <TextAreaJobDescription name="description" onChange={handleDescriptionChange}></TextAreaJobDescription>
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Contact</LabelText>
                        <InputText name="phone_number" onChange={handleContactChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Status</LabelText>
                        <Select name="status_active" onChange={handleStatusActiveChange}>
                            <Option value="null" selected></Option>
                            <Option value="true">Active</Option>
                            <Option value="false">Inactive</Option>
                        </Select>
                    </DivCtnEntry>

                    <DivButtonCreateUser>
                        <ButtonCreate type="submit" children='+ Create User' fontSize='1.25em'></ButtonCreate>
                    </DivButtonCreateUser>
                </Form>
            </DivCtnForm>
        </userCreateStyles.SectionPageUserCreate>

    </>)
}