
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
import { UserInterfaceNoId } from "../../interfaces/userInterface"
import userDefault from '../../../assets/img/userDefault.png'
import { capitalizeFirstLetter } from "../../../common/utils/capitalizeFirstLetter"
import { createFormHandlers } from '../../../common/utils/formHandlers'
import {
    validatePhoto, validateFullName, validateEmail, validatePhoneNumber, validateDateRelativeToAnother,
    validateTextArea, validateRole, validateNewPassword, validateOptionYesNo
} from '../../../common/utils/commonValidator'
import {
    GlobalDateTimeStyles, DivCtnForm, DivIcon, DivCtnIcons, IconUser, IconPlus, TitleForm, Form, InputTextPhoto, ImgUser, DivCtnEntry,
    LabelText, InputText, TextAreaJobDescription, Select, Option, InputDate, DivButtonCreateUser, DivButtonHidePassword, EyeOpen, EyeClose
} from "../../../common/styles/form"
import { ButtonCreate } from '../../../common/components/buttonCreate/buttonCreate'
import { getUserAllData, getUserAllStatus } from "../../features/userSlice"
import { UserFetchAllThunk } from "../../features/thunks/userFetchAllThunk"
import { UserCreateThunk } from "../../features/thunks/userCreateThunk"


export const UserCreate = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const userAll = useSelector(getUserAllData)
    const userAllLoading = useSelector(getUserAllStatus)
    const [newUser, setNewUser] = useState<UserInterfaceNoId>({
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
        else if (userAllLoading === ApiStatus.fulfilled) { }
        else if (userAllLoading === ApiStatus.rejected) { alert("Error in API create of User") }
    }, [userAllLoading, userAll])

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

        if (validateAllData().length > 0) {
            validateAllData().forEach(error => ToastifyError(error))
            return
        }

        dispatch(UserCreateThunk(newUser))
            .then(() => {
                ToastifySuccess('User created', () => {
                    navigate('../')
                })
            })
            .catch((error) => {
                ToastifyError(error)
            })
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
                        <ImgUser src={
                            newUser.photo ?
                                newUser.photo :
                                userDefault
                        } />
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

                        <LabelText minWidth="7.5rem" margin="0 0 0 5rem">Role</LabelText>
                        <Select name="role" onChange={handleSelectChange}>
                            <Option value={Role.admin}>{capitalizeFirstLetter(Role.admin)}</Option>
                            <Option value={Role.user}>{capitalizeFirstLetter(Role.user)}</Option>
                        </Select>
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Start Date</LabelText>
                        <InputDate name="start_date" type="datetime-local" onChange={handleDateChange} />

                        <LabelText minWidth="7.5rem" margin="0 0 0 5rem">End Date</LabelText>
                        <InputDate name="end_date" type="datetime-local" onChange={handleDateChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Password</LabelText>
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
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Job Position</LabelText>
                        <TextAreaJobDescription name="job_position" onChange={handleTextAreaChange}></TextAreaJobDescription>
                    </DivCtnEntry>

                    <DivButtonCreateUser>
                        <ButtonCreate type="submit" children='+ Create User' fontSize='1.25em'></ButtonCreate>
                    </DivButtonCreateUser>
                </Form>
            </DivCtnForm>
        </userCreateStyles.SectionPageUserCreate>
    </>)
}