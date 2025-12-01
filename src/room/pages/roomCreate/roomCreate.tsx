
import React from "react"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

import * as roomCreateStyles from "./roomCreateStyles"
import { ToastContainer } from 'react-toastify'
import { ToastifySuccess } from "../../../common/components/toastify/successPopup/toastifySuccess"
import { ToastifyError } from "../../../common/components/toastify/errorPopup/toastifyError"
import { AppDispatch } from "../../../common/redux/store"
import { ApiStatus } from "../../../common/enums/ApiStatus"
import { RoomInterfaceNoId } from "../../interfaces/roomInterface"
import { RoomAmenities } from "../../enums/roomAmenities"
import { RoomType } from "../../enums/roomType"
import {
    validatePhotos, validateRoomType, validateAmenities,
    validateNumberBetween, validateNewRoomNumber
} from '../../../common/utils/validators'
import {
    DivCtnForm, DivIcon, DivCtnIcons, IconBed, IconPlus, TitleForm, Form, ImgRoom, DivCtnEntry,
    LabelText, InputText, InputTextPhoto, Select, Option, SelectAmenities, DivButtonCreateUser
} from "../../../common/styles/form"
import { ButtonCreate } from '../../../common/components/buttonCreate/buttonCreate'
import { getRoomAllData, getRoomAllStatus } from "../../features/roomSlice"
import { RoomFetchAllThunk } from "../../features/thunks/roomFetchAllThunk"
import { RoomCreateThunk } from "../../features/thunks/roomCreateThunk"


export const RoomCreate = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const roomAll = useSelector(getRoomAllData)
    const roomAllLoading = useSelector(getRoomAllStatus)
    const [newRoom, setNewRoom] = useState<RoomInterfaceNoId>({
        photos: [],
        number: '0',
        type: RoomType.singleBed,
        amenities: [],
        price: 0,
        discount: 0,
        booking_id_list: []
    })

    useEffect(() => {
        if (roomAllLoading === ApiStatus.idle) { dispatch(RoomFetchAllThunk()) }
        else if (roomAllLoading === ApiStatus.fulfilled) { }
        else if (roomAllLoading === ApiStatus.rejected) { alert("Error in API create user") }
    }, [roomAllLoading, roomAll])

    const handlePhotosChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
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
    const handleStringChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setNewRoom({
            ...newRoom,
            [name]: value
        })
    }
    const handleNumberFloatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            ...newRoom
        }
        dispatch(RoomCreateThunk(newRoomToDispatch))
            .then(() => {
                ToastifySuccess('Room created', () => {
                    navigate('../')
                })
            })
            .catch((error) => {
                ToastifyError(error)
            })
    }

    const validateAllData = (): boolean => {
        // const errorsPhotos = validatePhotos(newRoom.photos, 'Photos')
        // if (errorsPhotos.length > 0) { errorsPhotos.map(error => ToastifyError(error)); return false }

        const errorsRoomNumber = validateNewRoomNumber(newRoom.number, roomAll, 'Room number')
        if (errorsRoomNumber.length > 0) { errorsRoomNumber.map(error => ToastifyError(error)); return false }

        const errorsRoomType = validateRoomType(newRoom.type, 'Room type')
        if (errorsRoomType.length > 0) { errorsRoomType.map(error => ToastifyError(error)); return false }

        const errorsAmenities = validateAmenities(newRoom.amenities, 'Amenities')
        if (errorsAmenities.length > 0) { errorsAmenities.map(error => ToastifyError(error)); return false }

        const errorsPrice = validateNumberBetween(newRoom.price, 25, 100000, 'Price')
        if (errorsPrice.length > 0) { errorsPrice.map(error => ToastifyError(error)); return false }

        const errorsDiscount = validateNumberBetween(newRoom.discount, 0, 100, 'Discount')
        if (errorsDiscount.length > 0) { errorsDiscount.map(error => ToastifyError(error)); return false }

        // VALIDAR "booking_id_list"

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
                        <InputTextPhoto name="photos" type='file' onChange={(e) => handlePhotosChange(0, e)} />
                        <ImgRoom src={newRoom.photos[0]} />
                    </DivCtnEntry>
                    <DivCtnEntry>
                        <LabelText>Photo 2</LabelText>
                        <InputTextPhoto name="photos" type='file' onChange={(e) => handlePhotosChange(1, e)} />
                        <ImgRoom src={newRoom.photos[1]} />
                    </DivCtnEntry>
                    <DivCtnEntry>
                        <LabelText>Photo 3</LabelText>
                        <InputTextPhoto name="photos" type='file' onChange={(e) => handlePhotosChange(2, e)} />
                        <ImgRoom src={newRoom.photos[2]} />
                    </DivCtnEntry>
                    <DivCtnEntry>
                        <LabelText>Photo 4</LabelText>
                        <InputTextPhoto name="photos" type='file' onChange={(e) => handlePhotosChange(3, e)} />
                        <ImgRoom src={newRoom.photos[3]} />
                    </DivCtnEntry>
                    <DivCtnEntry>
                        <LabelText>Photo 5</LabelText>
                        <InputTextPhoto name="photos" type='file' onChange={(e) => handlePhotosChange(4, e)} />
                        <ImgRoom src={newRoom.photos[4]} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Number</LabelText>
                        <InputText name="number" onChange={handleStringChange} />

                        <LabelText minWidth="7.5rem" margin="0 0 0 5rem">Room Type</LabelText>
                        <Select name="type" onChange={handleSelectChange}>
                            {Object.values(RoomType).map((type, index) => (
                                index === 0 ?
                                    <Option key={index} value={type} selected>{type}</Option> :
                                    <Option key={index} value={type}>{type}</Option>
                            ))}
                        </Select>
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Price</LabelText>
                        <InputText name="price" onChange={handleNumberFloatChange} />

                        <LabelText minWidth="7.5rem" margin="0 0 0 5rem">Discount (%)</LabelText>
                        <InputText name="discount" onChange={handleNumberFloatChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Amenities</LabelText>
                        <SelectAmenities name="amenities" onChange={handleAmenitiesChange} multiple={true}>
                            {Object.values(RoomAmenities).map((amenity, index) => (
                                <Option key={index} value={amenity}>
                                    {amenity}
                                </Option>
                            ))}
                        </SelectAmenities>
                    </DivCtnEntry>

                    <DivButtonCreateUser>
                        <ButtonCreate type="submit" children='+ Create Room' fontSize='1.25em'></ButtonCreate>
                    </DivButtonCreateUser>
                </Form>
            </DivCtnForm>
        </roomCreateStyles.SectionPageRoomCreate>
    </>)
}