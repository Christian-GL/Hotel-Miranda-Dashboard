
import React from "react"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"

import * as userUpdateStyles from "./userUpdate.ts"
import { ToastContainer } from 'react-toastify'
import { ToastifySuccess } from "../../../common/components/toastify/successPopup/toastifySuccess.tsx"
import { ToastifyError } from "../../../common/components/toastify/errorPopup/toastifyError.tsx"
import { AppDispatch } from "../../../common/redux/store.ts"
import { ApiStatus } from "../../../common/enums/ApiStatus.ts"
import { UserInterface } from "../../interfaces/userInterface.ts"
import { UserStatus } from "../../data/userStatus.ts"
import { formatDateForInput } from "../../../common/utils/formUtils.ts"
import {
    validatePhoto, validateFullName, validateEmail, validateTextArea,
    validatePhoneNumber, validateDateRelativeToNow,
    validateCreatePassword
} from '../../../common/utils/validators.ts'
import { comparePasswords } from '../../../common/utils/hashPassword.ts'
import {
    GlobalDateTimeStyles, DivCtnForm, DivIcon, DivCtnIcons, IconUser, IconUpdate, TitleForm, Form, InputTextPhoto, ImgUser, DivCtnEntry,
    LabelText, InputText, TextAreaJobDescription, Select, Option, InputDate, DivButtonCreateUser, DivButtonHidePassword, EyeOpen, EyeClose
} from "../../../common/styles/form.ts"
import { ButtonCreate } from '../../../common/components/buttonCreate/buttonCreate.tsx'
import { getUserIdData, getUserIdStatus } from "../../features/userSlice.ts"
import { UserFetchByIDThunk } from "../../features/thunks/userFetchByIDThunk.ts"
import { UserUpdateThunk } from "../../features/thunks/userUpdateThunk.ts"


export const UserUpdate = () => {

    const { id } = useParams()
    const idParams = id!
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const userById = useSelector(getUserIdData)
    const userByIdLoading = useSelector(getUserIdStatus)
    const [userUpdated, setUserUpdated] = useState<UserInterface>({
        _id: '0',
        photo: '',
        full_name: '',
        email: '',
        password: '',
        start_date: '',
        description: '',
        phone_number: '',
        status: UserStatus.inactive
    })
    const [passwordVisible, setPasswordVisible] = useState<boolean>(true)
    const [oldPassword, setOldPassword] = useState<String>('')

    useEffect(() => {
        if (userByIdLoading === ApiStatus.idle) { dispatch(UserFetchByIDThunk(idParams)) }
        else if (userByIdLoading === ApiStatus.fulfilled) {
            if (userById._id !== idParams) {
                dispatch(UserFetchByIDThunk(idParams))
            }
            setUserUpdated({
                _id: userById._id,
                photo: userById.photo || '',
                full_name: userById.full_name || '',
                email: userById.email || '',
                password: userById.password || '',
                start_date: userById.start_date || '',
                description: userById.description || '',
                phone_number: userById.phone_number || '',
                status: userById.status || UserStatus.inactive
            })
            setOldPassword(userById.password)
        }
        else if (userByIdLoading === ApiStatus.rejected) { alert("Error in API update users") }
    }, [userByIdLoading, userById, id])

    const switchPasswordVisibility = () => {
        setPasswordVisible(!passwordVisible)
    }
    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target
        if (files && files[0]) {
            const photoUrl = URL.createObjectURL(files[0])
            setUserUpdated({
                ...userUpdated,
                [name]: photoUrl
            })
        }
    }
    const handleStringChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setUserUpdated({
            ...userUpdated,
            [name]: value
        })
    }
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        if (!value) return
        const date = new Date(value)
        const dateISO = date.toISOString()

        setUserUpdated({
            ...userUpdated,
            [name]: dateISO
        })
    }
    const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setUserUpdated({
            ...userUpdated,
            [name]: value
        })
    }
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        setUserUpdated({
            ...userUpdated,
            [name]: value
        })
    }
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!validateAllData()) { return }

        // if (oldPassword === userUpdated.password) {
        //     const errorsPassword = validateCreatePassword(userUpdated.password, 'Password')
        //     if (errorsPassword.length > 0) { errorsPassword.map(error => ToastifyError(error)); return false }
        // }

        dispatch(UserUpdateThunk({ idUser: userUpdated._id, updatedUserData: userUpdated }))
            .then(() => {
                ToastifySuccess('User updated', () => {
                    navigate('../')
                })
            })
            .catch((error) => {
                alert(error)
            })
    }

    const validateAllData = (): boolean => {

        // const errorsPhoto = validatePhoto(userUpdated.photo, 'Photo')
        // if (errorsPhoto.length > 0) { errorsPhoto.map(error => ToastifyError(error)); return false }

        const errorsFullName = validateFullName(userUpdated.full_name, 'Full Name')
        if (errorsFullName.length > 0) { errorsFullName.map(error => ToastifyError(error)); return false }

        const errorsEmail = validateEmail(userUpdated.email, 'Email')
        if (errorsEmail.length > 0) { errorsEmail.map(error => ToastifyError(error)); return false }

        const errorsStartDate = validateDateRelativeToNow(new Date(userUpdated.start_date), false, 'Start Date')
        if (errorsStartDate.length > 0) { errorsStartDate.map(error => ToastifyError(error)); return false }

        const errorsTextArea = validateTextArea(userUpdated.description, 'Description')
        if (errorsTextArea.length > 0) { errorsTextArea.map(error => ToastifyError(error)); return false }

        const errorsPhoneNumber = validatePhoneNumber(userUpdated.phone_number, 'Phone Number')
        if (errorsPhoneNumber.length > 0) { errorsPhoneNumber.map(error => ToastifyError(error)); return false }

        // HACER FUNCION QUE PERMITA CAMBIAR UNA CONTRASEÑA SI SE CONOCE lA ANTERIOR?...
        // ...O SI SE ES "ADMIN" SE PUEDE SIEMPRE ?
        // await comparePasswords(blablabla)
        if (oldPassword !== userUpdated.password) {
            const errorsPassword = validateCreatePassword(userUpdated.password, 'Password')
            if (errorsPassword.length > 0) { errorsPassword.map(error => ToastifyError(error)); return false }
        }


        return true
    }

    return (<>
        <ToastContainer />

        <GlobalDateTimeStyles />

        <userUpdateStyles.SectionPageUserUpdate>
            <DivCtnForm>
                <DivIcon>
                    <DivCtnIcons>
                        <IconUser />
                        <IconUpdate />
                    </DivCtnIcons>
                </DivIcon>
                <TitleForm>Update User #{userUpdated._id}</TitleForm>

                <Form onSubmit={handleSubmit}>
                    <DivCtnEntry>
                        <LabelText>Photo</LabelText>
                        <InputTextPhoto name="photo" type='file' onChange={handlePhotoChange} />
                        <ImgUser src={userUpdated.photo} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Full name</LabelText>
                        <InputText name="full_name" value={userUpdated.full_name} onChange={handleStringChange} />

                        <LabelText minWidth="7.5rem" margin="0 0 0 5rem">Email</LabelText>
                        <InputText name="email" value={userUpdated.email} onChange={handleStringChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Contact</LabelText>
                        <InputText name="phone_number" value={userUpdated.phone_number} onChange={handleStringChange} />

                        <LabelText minWidth="7.5rem" margin="0 0 0 5rem">Start Date</LabelText>
                        <InputDate name="start_date" type="datetime-local" value={formatDateForInput(userUpdated.start_date)} onChange={handleDateChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Password</LabelText>
                        {passwordVisible ?
                            <InputText name="password" value={userUpdated.password} type="password" onChange={handleStringChange} /> :
                            <InputText name="password" value={userUpdated.password} onChange={handleStringChange} />
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
                        <TextAreaJobDescription name="description" value={userUpdated.description} onChange={handleTextAreaChange}></TextAreaJobDescription>
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Status</LabelText>
                        <Select name="status" value={userUpdated.status} onChange={handleSelectChange}>
                            <Option value={UserStatus.active}>Active</Option>
                            <Option value={UserStatus.inactive}>Inactive</Option>
                        </Select>
                    </DivCtnEntry>

                    <DivButtonCreateUser>
                        <ButtonCreate type="submit" children='⮂ Update User' fontSize='1.25em'></ButtonCreate>
                    </DivButtonCreateUser>
                </Form>
            </DivCtnForm>
        </userUpdateStyles.SectionPageUserUpdate>

    </>)
}