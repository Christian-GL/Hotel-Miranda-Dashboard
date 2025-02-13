
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
import {
    dateFormatToYYYYMMDD, dateFormatToDDMMYYYY, validatePhoto, validateName,
    validateEmail, validateDateAndTime, validateTextArea, validatePhoneNumber, validatePassword
} from '../../../common/utils/formUtils.ts'
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
    const idParams = parseInt(id!)
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const userById = useSelector(getUserIdData)
    const userByIdLoading = useSelector(getUserIdStatus)
    const [userUpdated, setUserUpdated] = useState<UserInterface>({
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
    const [passwordVisible, setPasswordVisible] = useState<boolean>(true)

    useEffect(() => {
        if (userByIdLoading === ApiStatus.idle) { dispatch(UserFetchByIDThunk(idParams)) }
        else if (userByIdLoading === ApiStatus.fulfilled) {
            if (userById?.id !== idParams) {
                dispatch(UserFetchByIDThunk(idParams))
            }
            setUserUpdated({
                id: userById.id,
                photo: userById.photo || '',
                full_name: userById.full_name || '',
                email: userById.email || '',
                start_date: userById.start_date || '',
                description: userById.description || '',
                phone_number: userById.phone_number || '',
                status_active: userById.status_active || false,
                password: userById.password || ''
            })
        }
        else if (userByIdLoading === ApiStatus.rejected) { alert("Error en la api de user update") }
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
    const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setUserUpdated({
            ...userUpdated,
            [name]: value
        })
    }
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setUserUpdated({
            ...userUpdated,
            [name]: value
        })
    }
    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setUserUpdated({
            ...userUpdated,
            [name]: dateFormatToDDMMYYYY(value),
        })
    }
    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setUserUpdated({
            ...userUpdated,
            [name]: value
        })
    }
    const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setUserUpdated({
            ...userUpdated,
            [name]: value
        })
    }
    const handleStatusActiveChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        setUserUpdated({
            ...userUpdated,
            [name]: value === 'false' ? false : true
        })
    }
    const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setUserUpdated({
            ...userUpdated,
            [name]: value
        })
    }
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!validateAllData()) { return }

        dispatch(UserUpdateThunk(userUpdated))
            .then(() => {
                ToastifySuccess(`User #${userUpdated.id} updated`, () => {
                    navigate('../')
                })
            })
            .catch((error) => {
                alert(error)
            })
    }

    const validateAllData = (): boolean => {
        // const checkPhoto = validatePhoto(userUpdated.photo)
        // if (!checkPhoto.test) {
        //     checkPhoto.errorMessages.map(error => ToastifyError(error))
        //     return false
        // }
        const checkName = validateName(userUpdated.full_name)
        if (!checkName.test) {
            checkName.errorMessages.map(error => ToastifyError(error))
            return false
        }
        const checkEmail = validateEmail(userUpdated.email)
        if (!checkEmail.test) {
            checkEmail.errorMessages.map(error => ToastifyError(error))
            return false
        }
        const checkStartDate = validateDateAndTime(userUpdated.start_date)
        if (!checkStartDate.test) {
            checkStartDate.errorMessages.map(error => ToastifyError(error))
            return false
        }
        const checkTextArea = validateTextArea(userUpdated.description)
        if (!checkTextArea.test) {
            checkTextArea.errorMessages.map(error => ToastifyError(error))
            return false
        }
        const checkPhoneNumber = validatePhoneNumber(userUpdated.phone_number)
        if (!checkPhoneNumber.test) {
            checkPhoneNumber.errorMessages.map(error => ToastifyError(error))
            return false
        }
        const checkPassword = validatePassword(userUpdated.password)
        if (!checkPassword.test) {
            checkPassword.errorMessages.map(error => ToastifyError(error))
            return false
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

                        <LabelText minWidth="7.5rem" margin="0 0 0 5rem">Email</LabelText>
                        <InputText name="email" value={userUpdated.email} onChange={handleEmailChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Contact</LabelText>
                        <InputText name="phone_number" value={userUpdated.phone_number} onChange={handleContactChange} />

                        <LabelText minWidth="7.5rem" margin="0 0 0 5rem">Start Date</LabelText>
                        <InputDate name="start_date" type="date" value={dateFormatToYYYYMMDD(userUpdated.start_date)} onChange={handleStartDateChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Password</LabelText>
                        {passwordVisible ?
                            <InputText name="password" value={userUpdated.password} type="password" onChange={handlePassword} /> :
                            <InputText name="password" value={userUpdated.password} onChange={handlePassword} />
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
                        <TextAreaJobDescription name="description" value={userUpdated.description} onChange={handleDescriptionChange}></TextAreaJobDescription>
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Status</LabelText>
                        <Select name="status_active" value={userUpdated.status_active ? "true" : "false"} onChange={handleStatusActiveChange}>
                            <Option value="true">Active</Option>
                            <Option value="false">Inactive</Option>
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