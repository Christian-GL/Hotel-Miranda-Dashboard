
import React from "react"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"

import * as userUpdateStyles from "./userUpdateStyles"
import { ToastContainer } from 'react-toastify'
import { ToastifySuccess } from "../../../common/components/toastify/successPopup/toastifySuccess"
import { ToastifyError } from "../../../common/components/toastify/errorPopup/toastifyError"
import { AppDispatch } from "../../../common/redux/store"
import { ApiStatus } from "../../../common/enums/ApiStatus"
import { JobPosition } from "../../enums/jobPosition"
import { Role } from "../../enums/role"
import { OptionYesNo } from "../../../common/enums/optionYesNo"
import { UserInterface } from "../../interfaces/userInterface"
import userDefault from '../../../assets/img/userDefault.png'
import { capitalizeFirstLetter } from "../../../common/utils/capitalizeFirstLetter"
import { createFormHandlers } from '../../../common/utils/formHandlers'
import { formatDateForInput } from "../../../common/utils/dateUtils"
import {
    validatePhoto, validateFullName, validateEmail, validatePhoneNumber, validateDateRelativeToAnother,
    validateTextArea, validateRole, validateNewPassword, validateOptionYesNo
} from '../../../common/utils/commonValidator'
import {
    GlobalDateTimeStyles, DivCtnForm, DivIcon, DivCtnIcons, IconUser, IconUpdate, TitleForm, Form, InputTextPhoto, ImgUser, DivCtnEntry,
    LabelText, InputText, TextAreaJobDescription, Select, Option, InputDate, DivButtonCreateUser, DivButtonHidePassword, EyeOpen, EyeClose
} from "../../../common/styles/form"
import { ButtonCreate } from '../../../common/components/buttonCreate/buttonCreate'
import { getUserIdData, getUserIdStatus } from "../../features/userSlice"
import { UserFetchByIDThunk } from "../../features/thunks/userFetchByIDThunk"
import { UserUpdateThunk } from "../../features/thunks/userUpdateThunk"


export const UserUpdate = () => {

    const { id } = useParams()
    const idParams = id!
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const userById = useSelector(getUserIdData)
    const userByIdLoading = useSelector(getUserIdStatus)
    const [userUpdated, setUserUpdated] = useState<UserInterface>({
        _id: "0",
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
    } = createFormHandlers(setUserUpdated)
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
        else if (userByIdLoading === ApiStatus.rejected) { alert("Error in API update users") }
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
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (validateAllData().length > 0) {
            validateAllData().forEach(error => ToastifyError(error))
            return
        }

        dispatch(UserUpdateThunk({ idUser: userUpdated._id, updatedUserData: userUpdated }))
            .then(() => {
                ToastifySuccess('User updated', () => {
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

        {console.log(userUpdated)}

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
                        <ImgUser src={
                            userUpdated.photo ?
                                userUpdated.photo :
                                userDefault
                        } />
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

                        <LabelText minWidth="7.5rem" margin="0 0 0 5rem">Role</LabelText>
                        <Select name="role" value={userUpdated.role} onChange={handleSelectChange}>
                            <Option value={Role.admin}>{capitalizeFirstLetter(Role.admin)}</Option>
                            <Option value={Role.user}>{capitalizeFirstLetter(Role.user)}</Option>
                        </Select>
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Start Date</LabelText>
                        <InputDate name="start_date" type="datetime-local" value={formatDateForInput(userUpdated.start_date)} onChange={handleDateChange} />

                        <LabelText minWidth="7.5rem" margin="0 0 0 5rem">End Date</LabelText>
                        <InputDate name="end_date" type="datetime-local" value={formatDateForInput(userUpdated.end_date)} onChange={handleDateChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Password</LabelText>
                        {passwordVisible ?
                            <InputText name="password" value={userUpdated.password} type="password" onChange={handleStringChange} /> :
                            <InputText name="password" value={userUpdated.password} onChange={handleStringChange} />
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
                        <TextAreaJobDescription name="job_position" value={userUpdated.job_position} onChange={handleTextAreaChange}></TextAreaJobDescription>
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Archived</LabelText>
                        <Select name="isArchived" value={userUpdated.isArchived} onChange={handleSelectChange}>
                            <Option value={OptionYesNo.no}>No</Option>
                            <Option value={OptionYesNo.yes}>Yes</Option>
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