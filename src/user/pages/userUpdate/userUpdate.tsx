
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
    dateFormatToYYYYMMDD, dateFormatToDDMMYYYY, validatePhoto,
    validateName, validateEmail, validateNotVoid, validateTextArea, validatePhoneNumber
} from '../../../common/utils/formUtils.ts'
import {
    GlobalDateTimeStyles, DivCtnForm, DivIcon, DivCtnIcons, IconUser, IconUpdate, TitleForm, Form, InputTextPhoto, ImgUser, DivCtnEntry,
    LabelText, InputText, TextAreaJobDescription, Select, Option, InputDate, DivButtonCreateUser
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
        status_active: false
    })

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
                status_active: userById.status_active || false
            })
        }
        else if (userByIdLoading === ApiStatus.rejected) { alert("Error en la api de user update") }
    }, [userByIdLoading, userById, id])

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
        // const checkPhoto = validatePhoto(newUser.photo)
        const checkName = validateName(userUpdated.full_name)
        const checkEmail = validateEmail(userUpdated.email)
        const checkStartDate = validateNotVoid(userUpdated.start_date)
        const checkTextArea = validateTextArea(userUpdated.description)
        const checkPhoneNumber = validatePhoneNumber(userUpdated.phone_number)

        // if (!checkPhoto.test) { ToastifyError(checkPhoto.errorMessage); return false }
        if (!checkName.test) { ToastifyError(checkName.errorMessage); return false }
        if (!checkEmail.test) { ToastifyError(checkEmail.errorMessage); return false }
        if (!checkStartDate.test) { ToastifyError(checkStartDate.errorMessage); return false }
        if (!checkTextArea.test) { ToastifyError(checkTextArea.errorMessage); return false }
        if (!checkPhoneNumber.test) { ToastifyError(checkPhoneNumber.errorMessage); return false }

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
                        <TextAreaJobDescription name="description" value={userUpdated.description} onChange={handleDescriptionChange}></TextAreaJobDescription>
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Contact</LabelText>
                        <InputText name="phone_number" value={userUpdated.phone_number} onChange={handleContactChange} />
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