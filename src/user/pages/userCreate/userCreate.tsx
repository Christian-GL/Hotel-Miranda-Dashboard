
import React from "react"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useTheme } from "styled-components"

import * as styles from "common/styles/form"
import userDefaultImg from '../../../assets/img/userDefault.png'
import { reactSelectStyles } from "common/styles/externalLibrariesStyles"
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
import { ReactSelectOption } from "common/types/reactMultiSelectOption"
import {
    validatePhoto, validateFullName, validateEmail, validatePhoneNumber, validateDateRelativeToAnother,
    validateTextArea, validateRole, validateNewPassword, validateOptionYesNo
} from '../../../common/utils/validators'
import { ButtonCreate } from '../../../common/components/buttonCreate/buttonCreate'
import { getUserAllData, getUserAllStatus, getUserApiError } from "../../features/userSlice"
import { UserFetchAllThunk } from "../../features/thunks/userFetchAllThunk"
import { UserCreateThunk } from "../../features/thunks/userCreateThunk"


export const UserCreate = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const theme = useTheme()
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
        handleReactSingleSelectChange
    } = createFormHandlers(setNewUser)
    const [passwordVisible, setPasswordVisible] = useState<boolean>(true)
    const roleReactOptions: ReactSelectOption<Role>[] = Object.values(Role).map(role => ({
        value: role,
        label: role
    }))

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
        <styles.GlobalDateTimeStyles />

        <styles.CtnSection>
            <styles.CtnPrimaryIcons>
                <styles.CtnSecondaryIcons>
                    <styles.IconUser />
                    <styles.IconPlus />
                </styles.CtnSecondaryIcons>
            </styles.CtnPrimaryIcons>
            <styles.TitleForm>Create User</styles.TitleForm>

            <styles.CtnForm>
                <styles.Form onSubmit={handleSubmit}>
                    <styles.CtnEntryVertical>
                        <styles.Text>Photo</styles.Text>
                        <styles.InputTextPhoto name="photo" type='file' onChange={handlePhotoChange} />
                        <styles.ImgUser
                            src={newUser.photo || userDefaultImg}
                            onError={(e) => { e.currentTarget.src = userDefaultImg }}
                        />
                    </styles.CtnEntryVertical>

                    <styles.CtnEntryVertical>
                        <styles.Text>Full name</styles.Text>
                        <styles.InputText name="full_name" onChange={handleStringChange} />
                    </styles.CtnEntryVertical>

                    <styles.CtnEntryVertical>
                        <styles.Text>Email</styles.Text>
                        <styles.InputText name="email" onChange={handleStringChange} />
                    </styles.CtnEntryVertical>

                    <styles.CtnEntryVertical>
                        <styles.CtnEntryHorizontal>
                            <styles.CtnEntryVertical removePaddingSeparator={true}>
                                <styles.Text>Phone number</styles.Text>
                                <styles.InputText name="phone_number" onChange={handleStringChange} />
                            </styles.CtnEntryVertical>
                            <styles.CtnEntryVertical removePaddingSeparator={true}>
                                <styles.Text>Role</styles.Text>
                                <styles.SelectReact
                                    name="type"
                                    menuPlacement="top"
                                    menuPosition="fixed"
                                    placeholder="Select type"
                                    isMulti={false}
                                    styles={reactSelectStyles(theme)}
                                    closeMenuOnSelect={true}
                                    options={roleReactOptions}
                                    value={roleReactOptions.find(option => option.value === newUser.role)}
                                    onChange={handleReactSingleSelectChange("role")}
                                />
                            </styles.CtnEntryVertical>
                        </styles.CtnEntryHorizontal>
                    </styles.CtnEntryVertical>

                    <styles.CtnEntryVertical>
                        <styles.CtnEntryHorizontal>
                            <styles.CtnEntryVertical removePaddingSeparator={true}>
                                <styles.Text>Start Date</styles.Text>
                                <styles.InputDate name="start_date" type="datetime-local" onChange={handleDateChange} />
                            </styles.CtnEntryVertical>
                            <styles.CtnEntryVertical removePaddingSeparator={true}>
                                <styles.Text>End Date</styles.Text>
                                <styles.InputDate name="end_date" type="datetime-local" onChange={handleDateChange} />
                            </styles.CtnEntryVertical>
                        </styles.CtnEntryHorizontal>
                    </styles.CtnEntryVertical>

                    <styles.CtnEntryVertical>
                        <styles.Text>Password</styles.Text>
                        <styles.CtnEntryHorizontal naturalSizes={true}>
                            {passwordVisible
                                ? <styles.InputText name="password" type="password" onChange={handleStringChange} />
                                : <styles.InputText name="password" onChange={handleStringChange} />
                            }
                            <styles.CtnButtonHidePassword>
                                {passwordVisible
                                    ? <styles.EyeClose onClick={() => setPasswordVisible(!passwordVisible)} />
                                    : <styles.EyeOpen onClick={() => setPasswordVisible(!passwordVisible)} />
                                }
                            </styles.CtnButtonHidePassword>
                        </styles.CtnEntryHorizontal>
                    </styles.CtnEntryVertical>

                    <styles.CtnEntryVertical>
                        <styles.Text>Job Position</styles.Text>
                        <styles.TextAreaJobDescription name="job_position" onChange={handleTextAreaChange}></styles.TextAreaJobDescription>
                    </styles.CtnEntryVertical>

                    <styles.CtnButtonCreateUser>
                        <ButtonCreate type="submit" children='+ Create User' fontSize='1.25em'></ButtonCreate>
                    </styles.CtnButtonCreateUser>
                </styles.Form>
            </styles.CtnForm>
        </styles.CtnSection>
    </>)

}