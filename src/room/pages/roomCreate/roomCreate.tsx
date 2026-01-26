
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
import { RoomInterface } from "../../interfaces/roomInterface"
import { RoomAmenities } from "../../enums/roomAmenities"
import { RoomType } from "../../enums/roomType"
import { createFormHandlers } from '../../../common/utils/formHandlers'
import {
    validateRoomNumber, validateRoomPhotoList, validateRoomType,
    validateAmenities, validateRoomPrice, validateRoomDiscount,
    validateOptionYesNo, validateMongoDBObjectIdList
} from '../../../common/utils/commonValidator'
import {
    CtnForm, CtnPrimaryIcon, CtnSecondaryIcon, IconBed, IconPlus, TitleForm, Form, ImgRoom, CtnEntry,
    Text, InputText, InputTextPhoto, Select, Option, SelectMultipleOptions, DivButtonCreateUser
} from "../../../common/styles/form"
import { ButtonCreate } from '../../../common/components/buttonCreate/buttonCreate'
import { getRoomAllData, getRoomAllStatus, getRoomErrorMessage } from "../../features/roomSlice"
import { RoomFetchAllThunk } from "../../features/thunks/roomFetchAllThunk"
import { RoomCreateThunk } from "../../features/thunks/roomCreateThunk"


export const RoomCreate = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const roomAll = useSelector(getRoomAllData)
    const roomAllLoading = useSelector(getRoomAllStatus)
    const roomErrorMessage = useSelector(getRoomErrorMessage)
    const [newRoom, setNewRoom] = useState<RoomInterface>({
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
        else if (roomAllLoading === ApiStatus.rejected && roomErrorMessage) { ToastifyError(roomErrorMessage) }
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
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const errors = validateAllData()
        if (errors.length > 0) {
            errors.forEach(error => ToastifyError(error))
            return
        }

        try {
            await dispatch(RoomCreateThunk(newRoom))
                .unwrap()
                .then(() => ToastifySuccess('Room created', () => navigate('../')))
        }
        catch (error) {
            ToastifyError(String(error))
        }
    }


    return (<>
        <ToastContainer />

        <roomCreateStyles.SectionPageRoomCreate>
            <CtnForm>
                <CtnPrimaryIcon>
                    <CtnSecondaryIcon>
                        <IconBed />
                        <IconPlus />
                    </CtnSecondaryIcon>
                </CtnPrimaryIcon>
                <TitleForm>Create Room</TitleForm>

                <Form onSubmit={handleSubmit}>
                    <CtnEntry>
                        <Text>Photo 1 (Main)</Text>
                        <InputTextPhoto type="file" onChange={handleArrayPhotosChange(0, "photos")} />
                        <ImgRoom src={newRoom.photos[0]} />
                    </CtnEntry>
                    <CtnEntry>
                        <Text>Photo 2</Text>
                        <InputTextPhoto type="file" onChange={handleArrayPhotosChange(1, "photos")} />
                        <ImgRoom src={newRoom.photos[1]} />
                    </CtnEntry>
                    <CtnEntry>
                        <Text>Photo 3</Text>
                        <InputTextPhoto type="file" onChange={handleArrayPhotosChange(2, "photos")} />
                        <ImgRoom src={newRoom.photos[2]} />
                    </CtnEntry>
                    <CtnEntry>
                        <Text>Photo 4</Text>
                        <InputTextPhoto type="file" onChange={handleArrayPhotosChange(3, "photos")} />
                        <ImgRoom src={newRoom.photos[3]} />
                    </CtnEntry>
                    <CtnEntry>
                        <Text>Photo 5</Text>
                        <InputTextPhoto type="file" onChange={handleArrayPhotosChange(4, "photos")} />
                        <ImgRoom src={newRoom.photos[4]} />
                    </CtnEntry>

                    <CtnEntry>
                        <Text>Number</Text>
                        <InputText name="number" onChange={handleStringChange} />

                        <Text minWidth="7.5rem" margin="0 0 0 5rem">Type</Text>
                        <Select name="type" onChange={handleSelectChange}>
                            {Object.values(RoomType).map((roomType, index) => (
                                index === 0
                                    ? <Option key={index} value={roomType} selected>{roomType}</Option>
                                    : <Option key={index} value={roomType}>{roomType}</Option>
                            ))}
                        </Select>
                    </CtnEntry>

                    <CtnEntry>
                        <Text>Price</Text>
                        <InputText name="price" onChange={handleNumberFloatChange} />

                        <Text minWidth="7.5rem" margin="0 0 0 5rem">Discount (%)</Text>
                        <InputText name="discount" onChange={handleNumberFloatChange} />
                    </CtnEntry>

                    <CtnEntry>
                        <Text>Amenities</Text>
                        <SelectMultipleOptions name="amenities" width="100%" onChange={handleMultiSelectChange} multiple={true}>
                            {Object.values(RoomAmenities).map((amenity, index) => (
                                <Option key={index} value={amenity}>
                                    {amenity}
                                </Option>
                            ))}
                        </SelectMultipleOptions>
                    </CtnEntry>

                    <DivButtonCreateUser>
                        <ButtonCreate type="submit" children='+ Create Room' fontSize='1.25em'></ButtonCreate>
                    </DivButtonCreateUser>
                </Form>
            </CtnForm>
        </roomCreateStyles.SectionPageRoomCreate>
    </>)
}