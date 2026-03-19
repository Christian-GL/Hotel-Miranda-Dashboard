
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { ToastContainer } from 'react-toastify'
import { useTheme } from "styled-components"

import userDefaultImg from 'assets/img/userDefault.png'
import { ButtonCreate } from 'common/components/buttonCreate/buttonCreate'
import { ToastifyError } from "common/components/toastify/errorPopup/toastifyError"
import { ToastifySuccess } from "common/components/toastify/successPopup/toastifySuccess"
import { ApiStatus } from "common/enums/ApiStatus"
import { OptionYesNo } from "common/enums/optionYesNo"
import { ApiErrorResponseInterface } from "common/interfaces/apiResponses/apiErrorResponseInterface"
import { AppDispatch } from "common/redux/store"
import { ROUTES } from "common/router/routes"
import { reactSelectStyles } from "common/styles/externalLibrariesStyles"
import * as styles from "common/styles/form"
import { ReactSelectOption } from "common/types/reactMultiSelectOption"
import { createFormHandlers } from 'common/utils/formHandlers'
import { JobPosition } from "user/enums/jobPosition"
import { Role } from "user/enums/role"
import { UserCreateThunk } from "user/features/thunks/userCreateThunk"
import { UserFetchAllThunk } from "user/features/thunks/userFetchAllThunk"
import { getUserAllData, getUserAllStatus, getUserApiError } from "user/features/userSlice"
import { UserInterface } from "user/interfaces/userInterface"
import { UserValidator } from "user/validators/userValidator"


export const UserCreate = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const theme = useTheme()
    const userAll = useSelector(getUserAllData)
    const userAllLoading = useSelector(getUserAllStatus)
    const userErrorMessage = useSelector(getUserApiError)
    const [userNew, setUserNew] = useState<UserInterface>({
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
    } = createFormHandlers(setUserNew)
    const [passwordVisible, setPasswordVisible] = useState<boolean>(true)
    const roleReactOptions: ReactSelectOption<Role>[] = Object.values(Role).map(role => ({
        value: role,
        label: role
    }))

    useEffect(() => {
        if (userAllLoading === ApiStatus.idle) { dispatch(UserFetchAllThunk()) }
    }, [userAllLoading, userAll, userErrorMessage])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const userValidator = new UserValidator()
        const validationErrors = userValidator.validateNewUser(userNew)
        if (validationErrors.length > 0) {
            validationErrors.forEach(error => ToastifyError(error))
            return
        }

        try {
            await dispatch(UserCreateThunk(userNew))
                .unwrap()
                .then(() => ToastifySuccess('User created', () => navigate(ROUTES.users.root)))
        }
        catch (error) {
            const apiError = error as ApiErrorResponseInterface
            apiError.message
                ? ToastifyError('API Error: ' + apiError.message)
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
                            src={userNew.photo || userDefaultImg}
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
                                    value={roleReactOptions.find(option => option.value === userNew.role)}
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