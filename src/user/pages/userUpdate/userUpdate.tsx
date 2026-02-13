
import React from "react"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"
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
import { UserInterfaceId } from "../../interfaces/userInterface"
import { ApiErrorResponseInterface } from "common/interfaces/apiResponses/apiErrorResponseInterface"
import { capitalizeFirstLetter } from "../../../common/utils/capitalizeFirstLetter"
import { createFormHandlers } from '../../../common/utils/formHandlers'
import { ReactSelectOption } from "common/types/reactMultiSelectOption"
import { formatDateForInput } from "../../../common/utils/dateUtils"
import {
    validatePhoto, validateFullName, validateEmail, validatePhoneNumber, validateDateRelativeToAnother,
    validateTextArea, validateRole, validateNewPassword, validateOptionYesNo
} from '../../../common/utils/commonValidator'
import { ButtonCreate } from '../../../common/components/buttonCreate/buttonCreate'
import { getUserIdData, getUserIdStatus } from "../../features/userSlice"
import { UserFetchByIDThunk } from "../../features/thunks/userFetchByIDThunk"
import { UserUpdateThunk } from "../../features/thunks/userUpdateThunk"


export const UserUpdate = () => {

    const { id } = useParams()
    const idParams = id!
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const theme = useTheme()
    const userById = useSelector(getUserIdData)
    const userByIdLoading = useSelector(getUserIdStatus)
    const [userUpdated, setUserUpdated] = useState<UserInterfaceId>({
        _id: '0',
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
    } = createFormHandlers(setUserUpdated)
    const [passwordVisible, setPasswordVisible] = useState<boolean>(true)
    const [oldPassword, setOldPassword] = useState<String>('')
    const roleReactOptions: ReactSelectOption<Role>[] = Object.values(Role).map(role => ({
        value: role,
        label: role
    }))

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
                phone_number: userById.phone_number || '',
                start_date: userById.start_date || new Date(),
                end_date: userById.end_date || new Date(),
                job_position: userById.job_position || JobPosition.receptionist,
                role: userById.role || Role.user,
                password: userById.password || '',
                isArchived: userById.isArchived || OptionYesNo.yes
            })
            setOldPassword(userById.password)
        }
    }, [userByIdLoading, userById, id])

    const validateAllData = (): string[] => {
        const allErrorMessages: string[] = []

        validatePhoto(userUpdated.photo, 'Photo').map(
            error => allErrorMessages.push(error)
        )
        validateFullName(userUpdated.full_name, 'Full name').map(
            error => allErrorMessages.push(error)
        )
        validateEmail(userUpdated.email, 'Email').map(
            error => allErrorMessages.push(error)
        )
        validatePhoneNumber(userUpdated.phone_number, 'Phone number').map(
            error => allErrorMessages.push(error)
        )
        validateDateRelativeToAnother(new Date(userUpdated.start_date), true, new Date(userUpdated.end_date), 'Dates').map(
            error => allErrorMessages.push(error)
        )
        validateTextArea(userUpdated.job_position, 'Job position').map(
            error => allErrorMessages.push(error)
        )
        validateRole(userUpdated.role, 'Role').map(
            error => allErrorMessages.push(error)
        )
        validateOptionYesNo(userUpdated.isArchived, 'User isArchived').map(
            error => allErrorMessages.push(error)
        )
        // !!! EXTRA: HACER FUNCION QUE PERMITA CAMBIAR UNA CONTRASEÑA SI SE CONOCE lA ANTERIOR O SI SE ES "ADMIN" SE PUEDE SIEMPRE ???
        if (oldPassword !== userUpdated.password) {
            validateNewPassword(userUpdated.password).map(
                error => allErrorMessages.push(error)
            )
        }

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
            await dispatch(UserUpdateThunk({ idUser: userUpdated._id, updatedUserData: userUpdated }))
                .unwrap()
                .then(() => ToastifySuccess('User updated', () => navigate('../')))
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
                    <styles.IconUpdate />
                </styles.CtnSecondaryIcons>
            </styles.CtnPrimaryIcons>
            <styles.TitleForm>Update User #{userUpdated._id}</styles.TitleForm>

            <styles.CtnForm>
                <styles.Form onSubmit={handleSubmit}>
                    <styles.CtnEntryVertical>
                        <styles.Text>Photo</styles.Text>
                        <styles.InputTextPhoto name="photo" type='file' onChange={handlePhotoChange} />
                        <styles.ImgUser
                            src={userUpdated.photo || userDefaultImg}
                            onError={(e) => { e.currentTarget.src = userDefaultImg }}
                        />
                    </styles.CtnEntryVertical>

                    <styles.CtnEntryVertical>
                        <styles.Text>Full name</styles.Text>
                        <styles.InputText name="full_name" value={userUpdated.full_name} onChange={handleStringChange} />
                    </styles.CtnEntryVertical>

                    <styles.CtnEntryVertical>
                        <styles.Text>Email</styles.Text>
                        <styles.InputText name="email" value={userUpdated.email} onChange={handleStringChange} />
                    </styles.CtnEntryVertical>

                    <styles.CtnEntryVertical>
                        <styles.CtnEntryHorizontal>
                            <styles.CtnEntryVertical removePaddingSeparator={true}>
                                <styles.Text>Phone number</styles.Text>
                                <styles.InputText name="phone_number" value={userUpdated.phone_number} onChange={handleStringChange} />
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
                                    value={roleReactOptions.find(option => option.value === userUpdated.role)}
                                    onChange={handleReactSingleSelectChange("role")}
                                />
                            </styles.CtnEntryVertical>
                        </styles.CtnEntryHorizontal>
                    </styles.CtnEntryVertical>

                    <styles.CtnEntryVertical>
                        <styles.CtnEntryHorizontal>
                            <styles.CtnEntryVertical removePaddingSeparator={true}>
                                <styles.Text>Start Date</styles.Text>
                                <styles.InputDate name="start_date" value={formatDateForInput(userUpdated.start_date)} type="datetime-local" onChange={handleDateChange} />
                            </styles.CtnEntryVertical>
                            <styles.CtnEntryVertical removePaddingSeparator={true}>
                                <styles.Text>End Date</styles.Text>
                                <styles.InputDate name="end_date" value={formatDateForInput(userUpdated.end_date)} type="datetime-local" onChange={handleDateChange} />
                            </styles.CtnEntryVertical>
                        </styles.CtnEntryHorizontal>
                    </styles.CtnEntryVertical>

                    <styles.CtnEntryVertical>
                        <styles.Text>Password</styles.Text>
                        <styles.CtnEntryHorizontal naturalSizes={true}>
                            {passwordVisible
                                ? <styles.InputText name="password" value={userUpdated.password} type="password" onChange={handleStringChange} />
                                : <styles.InputText name="password" value={userUpdated.password} onChange={handleStringChange} />
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
                        <styles.TextAreaJobDescription name="job_position" value={userUpdated.job_position} onChange={handleTextAreaChange}></styles.TextAreaJobDescription>
                    </styles.CtnEntryVertical>

                    <styles.CtnButtonCreateUser>
                        <ButtonCreate type="submit" children='⮂ Update User' fontSize='1.25em'></ButtonCreate>
                    </styles.CtnButtonCreateUser>
                </styles.Form>
            </styles.CtnForm>
        </styles.CtnSection >
    </>)

}