
import React from "react"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

import * as roomCreateStyles from "./roomCreateStyles.ts"
import { ToastContainer } from 'react-toastify'
import { ToastifySuccess } from "../../../common/components/toastify/successPopup/toastifySuccess.tsx"
import { ToastifyError } from "../../../common/components/toastify/errorPopup/toastifyError.tsx"
import { AppDispatch } from "../../../common/redux/store.ts"
import { ApiStatus } from "../../../common/enums/ApiStatus.ts"
import { RoomInterface } from "../../interfaces/roomInterface.ts"
import { RoomAmenities } from "../../data/roomAmenities.ts"
import { RoomType } from "../../data/roomType.ts"
import {
    checkFirstIDAvailable, validateRoomPhotoArray, validateRoomType,
    validateRoomPrice, validateRoomDiscount
} from '../../../common/utils/formUtils.ts'
import {
    DivCtnForm, DivIcon, DivCtnIcons, IconBed, IconPlus, TitleForm, Form, ImgRoom, DivCtnEntry,
    LabelText, InputText, InputTextPhoto, Select, Option, SelectAmenities, DivButtonCreateUser
} from "../../../common/styles/form.ts"
import { ButtonCreate } from '../../../common/components/buttonCreate/buttonCreate.tsx'
import { getRoomAllData, getRoomAllStatus } from "../../features/roomSlice.ts"
import { RoomFetchAllThunk } from "../../features/thunks/roomFetchAllThunk.ts"
import { RoomCreateThunk } from "../../features/thunks/roomCreateThunk.ts"


export const RoomCreate = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const roomAll = useSelector(getRoomAllData)
    const roomAllLoading = useSelector(getRoomAllStatus)
    const [newRoom, setNewRoom] = useState<RoomInterface>({
        id: 0,
        photos: [],
        type: '',
        amenities: [],
        price: 0,
        discount: 0,
        booking_list: []
    })
    const [nextIdAvailable, setNextIdAvailable] = useState<number>(0)

    useEffect(() => {
        if (roomAllLoading === ApiStatus.idle) { dispatch(RoomFetchAllThunk()) }
        else if (roomAllLoading === ApiStatus.fulfilled) {
            if (roomAll.length > 0) {
                const id = checkFirstIDAvailable(roomAll.map(item => item.id))
                setNextIdAvailable(id)
            }
            else { setNextIdAvailable(1) }
        }
        else if (roomAllLoading === ApiStatus.rejected) { alert("Error en la api de room create") }
    }, [roomAllLoading, roomAll])

    const handlePhotoChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target
        if (files && files[0]) {
            const photoUrl = URL.createObjectURL(files[0])
            setNewRoom(prevState => {
                const updatedPhotos = [...prevState.photos]
                updatedPhotos[index] = photoUrl
                return {
                    ...prevState,
                    photos: updatedPhotos
                }
            })
        }
    }
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        setNewRoom({
            ...newRoom,
            [name]: value
        })
    }
    const handleAmenitiesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, options } = e.target
        const selectedAmenities: string[] = []
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selectedAmenities.push(options[i].value)
            }
        }
        setNewRoom({
            ...newRoom,
            [name]: selectedAmenities
        })
    }
    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setNewRoom({
            ...newRoom,
            [name]: value === "" ? 0 : parseFloat(value)
        })
    }
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!validateAllData()) { return }

        const newRoomToDispatch = {
            ...newRoom,
            id: nextIdAvailable
        }
        dispatch(RoomCreateThunk(newRoomToDispatch))
            .then(() => {
                ToastifySuccess(`Room #${newRoomToDispatch.id} created`, () => {
                    navigate('../')
                })
            })
            .catch((error) => {
                ToastifyError(error)
            })
    }

    const validateAllData = (): boolean => {
        // const checkPhotos = validateRoomPhotoArray(newRoom.photos)
        // if (!checkPhotos.test) {
        //     checkPhotos.errorMessages.map(error => ToastifyError(error))
        //     return false
        // }
        const checkRoomType = validateRoomType(newRoom.type)
        if (!checkRoomType.test) {
            checkRoomType.errorMessages.map(error => ToastifyError(error))
            return false
        }
        const checkRoomPrice = validateRoomPrice(newRoom.price)
        if (!checkRoomPrice.test) {
            checkRoomPrice.errorMessages.map(error => ToastifyError(error))
            return false
        }
        const checkRoomDiscount = validateRoomDiscount(newRoom.discount)
        if (!checkRoomDiscount.test) {
            checkRoomDiscount.errorMessages.map(error => ToastifyError(error))
            return false
        }

        return true
    }


    return (<>
        <ToastContainer />

        <roomCreateStyles.SectionPageRoomCreate>
            <DivCtnForm>
                <DivIcon>
                    <DivCtnIcons>
                        <IconBed />
                        <IconPlus />
                    </DivCtnIcons>
                </DivIcon>
                <TitleForm>Create Room</TitleForm>

                <Form onSubmit={handleSubmit}>
                    <DivCtnEntry>
                        <LabelText>Photo 1 (Main)</LabelText>
                        <InputTextPhoto name="photos" type='file' onChange={(e) => handlePhotoChange(0, e)} />
                        <ImgRoom src={newRoom.photos[0]} />
                    </DivCtnEntry>
                    <DivCtnEntry>
                        <LabelText>Photo 2</LabelText>
                        <InputTextPhoto name="photos" type='file' onChange={(e) => handlePhotoChange(1, e)} />
                        <ImgRoom src={newRoom.photos[1]} />
                    </DivCtnEntry>
                    <DivCtnEntry>
                        <LabelText>Photo 3</LabelText>
                        <InputTextPhoto name="photos" type='file' onChange={(e) => handlePhotoChange(2, e)} />
                        <ImgRoom src={newRoom.photos[2]} />
                    </DivCtnEntry>
                    <DivCtnEntry>
                        <LabelText>Photo 4</LabelText>
                        <InputTextPhoto name="photos" type='file' onChange={(e) => handlePhotoChange(3, e)} />
                        <ImgRoom src={newRoom.photos[3]} />
                    </DivCtnEntry>
                    <DivCtnEntry>
                        <LabelText>Photo 5</LabelText>
                        <InputTextPhoto name="photos" type='file' onChange={(e) => handlePhotoChange(4, e)} />
                        <ImgRoom src={newRoom.photos[4]} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Amenities</LabelText>
                        <SelectAmenities name="amenities" onChange={handleAmenitiesChange} multiple={true}>
                            {Object.values(RoomAmenities).map((amenity, index) => (
                                <option key={index} value={amenity}>
                                    {amenity}
                                </option>
                            ))}
                        </SelectAmenities>
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Price</LabelText>
                        <InputText name="price" onChange={handleNumberChange} />

                        <LabelText minWidth="7.5rem" margin="0 0 0 5rem">Discount (%)</LabelText>
                        <InputText name="discount" value={newRoom.discount} onChange={handleNumberChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Room Type</LabelText>
                        <Select name="type" onChange={handleSelectChange}>
                            <Option value="null" selected></Option>
                            {Object.values(RoomType).map((type, index) => (
                                <option key={index} value={type}>
                                    {type}
                                </option>
                            ))}
                        </Select>
                    </DivCtnEntry>

                    <DivButtonCreateUser>
                        <ButtonCreate type="submit" children='+ Create Room' fontSize='1.25em'></ButtonCreate>
                    </DivButtonCreateUser>
                </Form>
            </DivCtnForm>
        </roomCreateStyles.SectionPageRoomCreate>
    </>)
}