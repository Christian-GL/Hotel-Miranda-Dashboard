
import React from "react"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

import * as userCreateStyles from "./userCreateStyles"
import { ToastContainer } from 'react-toastify'
import { ToastifySuccess } from "../../../common/components/toastify/successPopup/toastifySuccess"
import { ToastifyError } from "../../../common/components/toastify/errorPopup/toastifyError"
import { AppDispatch } from "../../../common/redux/store"
import { ApiStatus } from "../../../common/enums/ApiStatus"
import { JobPosition } from "../../enums/jobPosition"
import { Role } from "../../enums/role"
import { OptionYesNo } from "../../../common/enums/optionYesNo"
import { UserInterface } from "../../interfaces/userInterface"
import { ApiErrorResponseInterface } from "common/interfaces/apiResponses/apiErrorResponseInterface"
import { capitalizeFirstLetter } from "../../../common/utils/capitalizeFirstLetter"
import { createFormHandlers } from '../../../common/utils/formHandlers'
import {
    validatePhoto, validateFullName, validateEmail, validatePhoneNumber, validateDateRelativeToAnother,
    validateTextArea, validateRole, validateNewPassword, validateOptionYesNo
} from '../../../common/utils/commonValidator'
import {
    GlobalDateTimeStyles, CtnForm, CtnPrimaryIcon, CtnSecondaryIcon, IconUser, IconPlus, TitleForm, Form, InputTextPhoto, ImgUser, CtnEntry,
    Text, InputText, TextAreaJobDescription, SelectSingle, Option, InputDate, DivButtonCreateUser, DivButtonHidePassword, EyeOpen, EyeClose
} from "../../../common/styles/form"
import { ButtonCreate } from '../../../common/components/buttonCreate/buttonCreate'
import { getUserAllData, getUserAllStatus, getUserApiError } from "../../features/userSlice"
import { UserFetchAllThunk } from "../../features/thunks/userFetchAllThunk"
import { UserCreateThunk } from "../../features/thunks/userCreateThunk"


export const UserCreate = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const userAll = useSelector(getUserAllData)
    const userAllLoading = useSelector(getUserAllStatus)
    const userErrorMessage = useSelector(getUserApiError)
    const [newUser, setNewUser] = useState<UserInterface>({
        photo: null,
        full_name: '',
        email: '',
        phone_number: '',
        start_date: new Date(),
        end_date: new Date(),
        job_position: JobPosition.receptionist,
        role: Role.user,
        password: '',
        isArchived: OptionYesNo.yes
    })
    const { handleStringChange,
        handleDateChange,
        handlePhotoChange,
        handleTextAreaChange,
        handleSelectChange
    } = createFormHandlers(setNewUser)
    const [passwordVisible, setPasswordVisible] = useState<boolean>(true)

    useEffect(() => {
        if (userAllLoading === ApiStatus.idle) { dispatch(UserFetchAllThunk()) }
    }, [userAllLoading, userAll, userErrorMessage])

    const validateAllData = (): string[] => {
        // !!! CREAR FUNCIÓN COMÚN PARA VALIDAR USUARIOS NUEVOS Y USUARIOS ACTUALIZADOS SIMILAR A COMO ES EN LA API
        const allErrorMessages: string[] = []

        validatePhoto(newUser.photo, 'Photo').map(
            error => allErrorMessages.push(error)
        )
        validateFullName(newUser.full_name, 'Full name').map(
            error => allErrorMessages.push(error)
        )
        validateEmail(newUser.email, 'Email').map(
            error => allErrorMessages.push(error)
        )
        validatePhoneNumber(newUser.phone_number, 'Phone number').map(
            error => allErrorMessages.push(error)
        )
        validateDateRelativeToAnother(new Date(newUser.start_date), true, new Date(newUser.end_date), 'Dates').map(
            error => allErrorMessages.push(error)
        )
        validateTextArea(newUser.job_position, 'Job position').map(
            error => allErrorMessages.push(error)
        )
        validateRole(newUser.role, 'Role').map(
            error => allErrorMessages.push(error)
        )
        validateNewPassword(newUser.password).map(
            error => allErrorMessages.push(error)
        )
        validateOptionYesNo(newUser.isArchived, 'User isArchived').map(
            error => allErrorMessages.push(error)
        )

        return allErrorMessages
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const errors = validateAllData()
        if (errors.length > 0) {
            errors.forEach(error => ToastifyError(error))
            return
        }

        try {
            await dispatch(UserCreateThunk(newUser))
                .unwrap()
                .then(() => ToastifySuccess('User created', () => navigate('../')))
        }
        catch (error) {
            const apiError = error as ApiErrorResponseInterface
            apiError.message
                ? ToastifyError(apiError.message)
                : ToastifyError('Unexpected API Error')
        }
    }


    return (<>
        <ToastContainer />

        <GlobalDateTimeStyles />

        <userCreateStyles.SectionPageUserCreate>
            <CtnForm>
                <CtnPrimaryIcon>
                    <CtnSecondaryIcon>
                        <IconUser />
                        <IconPlus />
                    </CtnSecondaryIcon>
                </CtnPrimaryIcon>
                <TitleForm>Create User</TitleForm>

                <Form onSubmit={handleSubmit}>
                    <CtnEntry>
                        <Text>Photo</Text>
                        <InputTextPhoto name="photo" type='file' onChange={handlePhotoChange} />
                        <ImgUser src={newUser.photo ? newUser.photo : ''} />
                    </CtnEntry>

                    <CtnEntry>
                        <Text>Full name</Text>
                        <InputText name="full_name" onChange={handleStringChange} />

                        <Text minWidth="7.5rem" margin="0 0 0 5rem">Email</Text>
                        <InputText name="email" onChange={handleStringChange} />
                    </CtnEntry>

                    <CtnEntry>
                        <Text>Phone number</Text>
                        <InputText name="phone_number" onChange={handleStringChange} />

                        <Text minWidth="7.5rem" margin="0 0 0 5rem">Role</Text>
                        <SelectSingle name="role" onChange={handleSelectChange}>
                            <Option value={Role.admin}>{capitalizeFirstLetter(Role.admin)}</Option>
                            <Option value={Role.user}>{capitalizeFirstLetter(Role.user)}</Option>
                        </SelectSingle>
                    </CtnEntry>

                    <CtnEntry>
                        <Text>Start Date</Text>
                        <InputDate name="start_date" type="datetime-local" onChange={handleDateChange} />

                        <Text minWidth="7.5rem" margin="0 0 0 5rem">End Date</Text>
                        <InputDate name="end_date" type="datetime-local" onChange={handleDateChange} />
                    </CtnEntry>

                    <CtnEntry>
                        <Text>Password</Text>
                        {passwordVisible ?
                            <InputText name="password" type="password" onChange={handleStringChange} /> :
                            <InputText name="password" onChange={handleStringChange} />
                        }
                        <DivButtonHidePassword>
                            {passwordVisible ?
                                <EyeClose onClick={() => setPasswordVisible(!passwordVisible)} /> :
                                <EyeOpen onClick={() => setPasswordVisible(!passwordVisible)} />
                            }
                        </DivButtonHidePassword>
                    </CtnEntry>

                    <CtnEntry>
                        <Text>Job Position</Text>
                        <TextAreaJobDescription name="job_position" onChange={handleTextAreaChange}></TextAreaJobDescription>
                    </CtnEntry>

                    <DivButtonCreateUser>
                        <ButtonCreate type="submit" children='+ Create User' fontSize='1.25em'></ButtonCreate>
                    </DivButtonCreateUser>
                </Form>
            </CtnForm>
        </userCreateStyles.SectionPageUserCreate>
    </>)
}