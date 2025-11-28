
import React from "react"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

import * as userCreateStyles from "./userCreateStyles.ts"
import { ToastContainer } from 'react-toastify'
import { ToastifySuccess } from "../../../common/components/toastify/successPopup/toastifySuccess.tsx"
import { ToastifyError } from "../../../common/components/toastify/errorPopup/toastifyError.tsx"
import { AppDispatch } from "../../../common/redux/store.ts"
import { ApiStatus } from "../../../common/enums/ApiStatus.ts"
import { JobPosition } from "../../enums/jobPosition.ts"
import { Role } from "../../enums/role.ts"
import { OptionYesNo } from "../../../common/enums/optionYesNo.ts"
import { UserInterfaceNoId } from "../../interfaces/userInterface.ts"
import userDefault from '../../../assets/img/userDefault.png'
import { capitalizeFirstLetter } from "../../../common/utils/capitalizeFirstLetter.ts"
import {
    validatePhoto, validateFullName, validateEmail, validatePhoneNumber, validateDateRelativeToAnother,
    validateTextArea, validateRole, validateNewPassword, validateOptionYesNo
} from '../../../common/utils/commonValidator.ts'
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
    const [passwordVisible, setPasswordVisible] = useState<boolean>(true)

    useEffect(() => {
        if (userAllLoading === ApiStatus.idle) { dispatch(UserFetchAllThunk()) }
        else if (userAllLoading === ApiStatus.fulfilled) { }
        else if (userAllLoading === ApiStatus.rejected) { alert("Error in API create of User") }
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

        if (!value) return
        const date = new Date(value)

        setNewUser({
            ...newUser,
            [name]: date
        })
    }
    const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setNewUser({
            ...newUser,
            [name]: value
        })
    }
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        setNewUser({
            ...newUser,
            [name]: value
        })
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

    // const validateAllData = (): boolean => {
    //     // const errorsPhoto = validatePhoto(newUser.photo, 'Photo')
    //     // if (errorsPhoto.length > 0) { errorsPhoto.map(error => ToastifyError(error)); return false }

    //     const errorsFullName = validateFullName(newUser.full_name, 'Full Name')
    //     if (errorsFullName.length > 0) { errorsFullName.map(error => ToastifyError(error)); return false }

    //     const errorsEmail = validateEmail(newUser.email, 'Email')
    //     if (errorsEmail.length > 0) { errorsEmail.map(error => ToastifyError(error)); return false }

    //     const errorsStartDate = validateDateRelativeToNow(new Date(newUser.start_date), false, 'Start Date')
    //     if (errorsStartDate.length > 0) { errorsStartDate.map(error => ToastifyError(error)); return false }

    //     const errorsTextArea = validateTextArea(newUser.description, 'Description')
    //     if (errorsTextArea.length > 0) { errorsTextArea.map(error => ToastifyError(error)); return false }

    //     const errorsPhoneNumber = validatePhoneNumber(newUser.phone_number, 'Phone Number')
    //     if (errorsPhoneNumber.length > 0) { errorsPhoneNumber.map(error => ToastifyError(error)); return false }

    //     const errorsPassword = validateCreatePassword(newUser.password, 'Password')
    //     if (errorsPassword.length > 0) { errorsPassword.map(error => ToastifyError(error)); return false }

    //     return true
    // }

    const validateAllData = (): string[] => {
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
        validateDateRelativeToAnother(newUser.start_date, true, newUser.end_date, 'Start date').map(
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

                    {/* // ROLE */}

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
                        <TextAreaJobDescription name="job_position" onChange={handleTextAreaChange}></TextAreaJobDescription>
                    </DivCtnEntry>

                    {/* <DivCtnEntry>
                        <LabelText>Status</LabelText>
                        <Select name="status" onChange={handleSelectChange}>
                            <Option value={UserStatus.active}>Active</Option>
                            <Option value={UserStatus.inactive} selected>Inactive</Option>
                        </Select>
                    </DivCtnEntry> */}

                    <DivButtonCreateUser>
                        <ButtonCreate type="submit" children='+ Create User' fontSize='1.25em'></ButtonCreate>
                    </DivButtonCreateUser>
                </Form>
            </DivCtnForm>
        </userCreateStyles.SectionPageUserCreate>
    </>)
}