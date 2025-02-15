
import React from "react"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

import * as userCreateStyles from "./userCreate.ts"
import { ToastContainer } from 'react-toastify'
import { ToastifySuccess } from "../../../common/components/toastify/successPopup/toastifySuccess.tsx"
import { ToastifyError } from "../../../common/components/toastify/errorPopup/toastifyError.tsx"
import { AppDispatch } from "../../../common/redux/store.ts"
import { ApiStatus } from "../../../common/enums/ApiStatus.ts"
import { UserInterface } from "../../interfaces/userInterface.ts"
import {
    checkFirstIDAvailable, validatePhoto, validateName, validateEmail,
    validateDateAndTime, validateTextArea, validatePhoneNumber, validatePassword
} from '../../../common/utils/formUtils.ts'
import {
    GlobalDateTimeStyles, DivCtnForm, DivIcon, DivCtnIcons, IconUser, IconPlus, TitleForm, Form, InputTextPhoto, ImgUser, DivCtnEntry,
    LabelText, InputText, TextAreaJobDescription, Select, Option, InputDate, DivButtonCreateUser, DivButtonHidePassword, EyeOpen, EyeClose
} from "../../../common/styles/form.ts"
import { ButtonCreate } from '../../../common/components/buttonCreate/buttonCreate.tsx'
import { getUserAllData, getUserAllStatus } from "../../features/userSlice.ts"
import { UserFetchAllThunk } from "../../features/thunks/userFetchAllThunk.ts"
import { UserCreateThunk } from "../../features/thunks/userCreateThunk.ts"


export const UserCreate = () => {

    const navigate = useNavigate()
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
        status_active: false,
        password: ''
    })
    const [nextIdAvailable, setNextIdAvailable] = useState<number>(0)
    const [passwordVisible, setPasswordVisible] = useState<boolean>(true)

    useEffect(() => {
        if (userAllLoading === ApiStatus.idle) { dispatch(UserFetchAllThunk()) }
        else if (userAllLoading === ApiStatus.fulfilled) {
            if (userAll.length > 0) {
                const id = checkFirstIDAvailable(userAll.map(item => item.id))
                setNextIdAvailable(id)
            }
            else { setNextIdAvailable(1) }
        }
        else if (userAllLoading === ApiStatus.rejected) { alert("Error en la api de user create") }
    }, [userAllLoading, userAll])

    const switchPasswordVisibility = () => {
        setPasswordVisible(!passwordVisible)
    }
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
    const handleStringChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setNewUser({
            ...newUser,
            [name]: value
        })
    }
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        const [year, month, day] = value.split("-")
        const dateFormatted = `${day}-${month}-${year}`
        setNewUser({
            ...newUser,
            [name]: dateFormatted
        })
    }
    const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setNewUser({
            ...newUser,
            [name]: value
        })
    }
    const handleBooleanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        setNewUser({
            ...newUser,
            [name]: value === 'false' ? false : true
        })
    }
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!validateAllData()) { return }

        const newUserToDispatch = {
            ...newUser,
            id: nextIdAvailable
        }
        dispatch(UserCreateThunk(newUserToDispatch))
            .then(() => {
                ToastifySuccess(`User #${newUserToDispatch.id} created`, () => {
                    navigate('../')
                })
            })
            .catch((error) => {
                ToastifyError(error)
            })
    }

    const validateAllData = (): boolean => {
        // const checkPhoto = validatePhoto(newUser.photo)
        // if (!checkPhoto.test) {
        //     checkPhoto.errorMessages.map(error => ToastifyError(error))
        //     return false
        // }
        const checkName = validateName(newUser.full_name)
        if (!checkName.test) {
            checkName.errorMessages.map(error => ToastifyError(error))
            return false
        }
        const checkEmail = validateEmail(newUser.email)
        if (!checkEmail.test) {
            checkEmail.errorMessages.map(error => ToastifyError(error))
            return false
        }
        const checkStartDate = validateDateAndTime(newUser.start_date)
        if (!checkStartDate.test) {
            checkStartDate.errorMessages.map(error => ToastifyError(error))
            return false
        }
        const checkTextArea = validateTextArea(newUser.description)
        if (!checkTextArea.test) {
            checkTextArea.errorMessages.map(error => ToastifyError(error))
            return false
        }
        const checkPhoneNumber = validatePhoneNumber(newUser.phone_number)
        if (!checkPhoneNumber.test) {
            checkPhoneNumber.errorMessages.map(error => ToastifyError(error))
            return false
        }
        const checkPassword = validatePassword(newUser.password)
        if (!checkPassword.test) {
            checkPassword.errorMessages.map(error => ToastifyError(error))
            return false
        }

        return true
    }


    return (<>
        <ToastContainer />

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
                        <InputText name="full_name" onChange={handleStringChange} />

                        <LabelText minWidth="7.5rem" margin="0 0 0 5rem">Email</LabelText>
                        <InputText name="email" onChange={handleStringChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Contact</LabelText>
                        <InputText name="phone_number" onChange={handleStringChange} />

                        <LabelText minWidth="7.5rem" margin="0 0 0 5rem">Start Date</LabelText>
                        <InputDate name="start_date" type="date" onChange={handleDateChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Password</LabelText>
                        {passwordVisible ?
                            <InputText name="password" type="password" onChange={handleStringChange} /> :
                            <InputText name="password" onChange={handleStringChange} />
                        }
                        <DivButtonHidePassword>
                            {passwordVisible ?
                                <EyeClose onClick={switchPasswordVisibility} /> :
                                <EyeOpen onClick={switchPasswordVisibility} />
                            }
                        </DivButtonHidePassword>
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Job Description</LabelText>
                        <TextAreaJobDescription name="description" onChange={handleTextAreaChange}></TextAreaJobDescription>
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Status</LabelText>
                        <Select name="status_active" onChange={handleBooleanChange}>
                            <Option value="true">Active</Option>
                            <Option value="false" selected>Inactive</Option>
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