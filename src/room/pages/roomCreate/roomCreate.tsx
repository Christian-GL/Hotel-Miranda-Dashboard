
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
import { OptionYesNo } from "common/enums/optionYesNo"
import { RoomInterfaceNoId } from "../../interfaces/roomInterface"
import { RoomAmenities } from "../../enums/roomAmenities"
import { RoomType } from "../../enums/roomType"
import { createFormHandlers } from '../../../common/utils/formHandlers'
import {
    validateRoomNumber, validateRoomPhotoList, validateRoomType,
    validateAmenities, validateRoomPrice, validateRoomDiscount,
    validateOptionYesNo, validateMongoDBObjectIdList
} from '../../../common/utils/commonValidator'
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
        number: '0',
        photos: [],
        type: RoomType.singleBed,
        amenities: [],
        price: 0,
        discount: 0,
        isActive: OptionYesNo.yes,
        isArchived: OptionYesNo.no,
        booking_id_list: []
    })
    const { handleStringChange,
        handleArrayPhotosChange,
        handleMultiSelectChange,
        handleNumberFloatChange,
        handleSelectChange
    } = createFormHandlers(setNewRoom)

    useEffect(() => {
        if (roomAllLoading === ApiStatus.idle) { dispatch(RoomFetchAllThunk()) }
        else if (roomAllLoading === ApiStatus.fulfilled) { }
        else if (roomAllLoading === ApiStatus.rejected) { alert("Error in API create user") }
    }, [roomAllLoading, roomAll])

    const validateAllData = (): string[] => {
        const allErrorMessages: string[] = []
        
        validateRoomNumber(newRoom.number, 'Number').map(
            error => allErrorMessages.push(error)
        )
        validateRoomPhotoList(newRoom.photos, 'Photos').map(
            error => allErrorMessages.push(error)
        )
        validateRoomType(newRoom.type, 'Type').map(
            error => allErrorMessages.push(error)
        )
        validateAmenities(newRoom.amenities, 'Amenities').map(
            error => allErrorMessages.push(error)
        )
        validateRoomPrice(newRoom.price, 'Price').map(
            error => allErrorMessages.push(error)
        )
        validateRoomDiscount(newRoom.discount, 'Discount').map(
            error => allErrorMessages.push(error)
        )
        validateOptionYesNo(newRoom.isActive, 'Room isActive').map(
            error => allErrorMessages.push(error)
        )
        validateOptionYesNo(newRoom.isArchived, 'Room isArchived').map(
            error => allErrorMessages.push(error)
        )
        validateMongoDBObjectIdList(newRoom.booking_id_list).map(
            error => allErrorMessages.push(error)
        )

        return allErrorMessages
    }
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (validateAllData().length > 0) {
            validateAllData().forEach(error => ToastifyError(error))
            return
        }

        dispatch(RoomCreateThunk(newRoom))
            .then(() => {
                ToastifySuccess('Room created', () => {
                    navigate('../')
                })
            })
            .catch((error) => {
                ToastifyError(error)
            })
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
                        <InputTextPhoto type="file" onChange={handleArrayPhotosChange(0, "photos")} />
                        <ImgRoom src={newRoom.photos[0]} />
                    </DivCtnEntry>
                    <DivCtnEntry>
                        <LabelText>Photo 2</LabelText>
                        <InputTextPhoto type="file" onChange={handleArrayPhotosChange(1, "photos")} />
                        <ImgRoom src={newRoom.photos[1]} />
                    </DivCtnEntry>
                    <DivCtnEntry>
                        <LabelText>Photo 3</LabelText>
                        <InputTextPhoto type="file" onChange={handleArrayPhotosChange(2, "photos")} />
                        <ImgRoom src={newRoom.photos[2]} />
                    </DivCtnEntry>
                    <DivCtnEntry>
                        <LabelText>Photo 4</LabelText>
                        <InputTextPhoto type="file" onChange={handleArrayPhotosChange(3, "photos")} />
                        <ImgRoom src={newRoom.photos[3]} />
                    </DivCtnEntry>
                    <DivCtnEntry>
                        <LabelText>Photo 5</LabelText>
                        <InputTextPhoto type="file" onChange={handleArrayPhotosChange(4, "photos")} />
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
                        <SelectAmenities name="amenities" onChange={handleMultiSelectChange} multiple={true}>
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