
import React from "react"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useTheme } from "styled-components"

import * as styles from "common/styles/form"
import { reactSelectStyles } from "common/styles/externalLibrariesStyles"
import { ToastContainer } from 'react-toastify'
import { ToastifySuccess } from "../../../common/components/toastify/successPopup/toastifySuccess"
import { ToastifyError } from "../../../common/components/toastify/errorPopup/toastifyError"
import { AppDispatch } from "../../../common/redux/store"
import { ApiStatus } from "../../../common/enums/ApiStatus"
import { OptionYesNo } from "common/enums/optionYesNo"
import { RoomInterface } from "../../interfaces/roomInterface"
import { ApiErrorResponseInterface } from "common/interfaces/apiResponses/apiErrorResponseInterface"
import { RoomAmenities } from "../../enums/roomAmenities"
import { RoomType } from "../../enums/roomType"
import { createFormHandlers } from '../../../common/utils/formHandlers'
import { ReactSelectOption } from "common/types/reactMultiSelectOption"
import {
    validateRoomNumber, validateRoomPhotoList, validateRoomType, validateAmenities,
    validateRoomPrice, validateRoomDiscount, validateOptionYesNo, validateMongoDBObjectIdList
} from '../../../common/utils/commonValidator'
import { ButtonCreate } from '../../../common/components/buttonCreate/buttonCreate'
import { getRoomAllData, getRoomAllStatus } from "../../features/roomSlice"
import { RoomFetchAllThunk } from "../../features/thunks/roomFetchAllThunk"
import { RoomCreateThunk } from "../../features/thunks/roomCreateThunk"


export const RoomCreate = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const theme = useTheme()
    const roomAll = useSelector(getRoomAllData)
    const roomAllLoading = useSelector(getRoomAllStatus)
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
    const amenityReactOptions: ReactSelectOption<RoomAmenities>[] = Object.values(RoomAmenities).map((amenity) => ({
        value: amenity,
        label: amenity
    }))
    const roomTypeReactOptions: ReactSelectOption<RoomType>[] = Object.values(RoomType).map((type) => ({
        value: type,
        label: type
    }))
    const { handleStringChange,
        handleArrayPhotosChange,
        handleReactSingleSelectChange,
        handleReactMultiSelectChange,
        handleNumberFloatChange,
    } = createFormHandlers(setNewRoom)

    useEffect(() => {
        if (roomAllLoading === ApiStatus.idle) { dispatch(RoomFetchAllThunk()) }
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
            const apiError = error as ApiErrorResponseInterface
            apiError.message
                ? ToastifyError(apiError.message)
                : ToastifyError('Unexpected API Error')
        }
    }

    return (<>
        <ToastContainer />

        <styles.CtnSection>
            <styles.CtnPrimaryIcons>
                <styles.CtnSecondaryIcons>
                    <styles.IconBed />
                    <styles.IconPlus />
                </styles.CtnSecondaryIcons>
            </styles.CtnPrimaryIcons>
            <styles.TitleForm>Create Room</styles.TitleForm>

            <styles.CtnForm>
                <styles.Form onSubmit={handleSubmit}>
                    <styles.CtnEntryVertical>
                        <styles.Text>Photo 1 (Main)</styles.Text>
                        <styles.InputTextPhoto type="file" onChange={handleArrayPhotosChange(0, "photos")} />
                        <styles.ImgRoom src={newRoom.photos[0]} />
                    </styles.CtnEntryVertical>
                    <styles.CtnEntryVertical>
                        <styles.Text>Photo 2</styles.Text>
                        <styles.InputTextPhoto type="file" onChange={handleArrayPhotosChange(1, "photos")} />
                        <styles.ImgRoom src={newRoom.photos[1]} />
                    </styles.CtnEntryVertical>
                    <styles.CtnEntryVertical>
                        <styles.Text>Photo 3</styles.Text>
                        <styles.InputTextPhoto type="file" onChange={handleArrayPhotosChange(2, "photos")} />
                        <styles.ImgRoom src={newRoom.photos[2]} />
                    </styles.CtnEntryVertical>
                    <styles.CtnEntryVertical>
                        <styles.Text>Photo 4</styles.Text>
                        <styles.InputTextPhoto type="file" onChange={handleArrayPhotosChange(3, "photos")} />
                        <styles.ImgRoom src={newRoom.photos[3]} />
                    </styles.CtnEntryVertical>
                    <styles.CtnEntryVertical>
                        <styles.Text>Photo 5</styles.Text>
                        <styles.InputTextPhoto type="file" onChange={handleArrayPhotosChange(4, "photos")} />
                        <styles.ImgRoom src={newRoom.photos[4]} />
                    </styles.CtnEntryVertical>

                    <styles.CtnEntryVertical>
                        <styles.CtnEntryHorizontal>
                            <styles.CtnEntryVertical removePaddingSeparator={true}>
                                <styles.Text>Amenities</styles.Text>
                                <styles.SelectReact
                                    name="amenities"
                                    menuPlacement="top"
                                    menuPosition="fixed"
                                    placeholder="Select amenities"
                                    isMulti={true}
                                    styles={reactSelectStyles(theme)}
                                    closeMenuOnSelect={false}
                                    options={amenityReactOptions}
                                    value={amenityReactOptions.filter(option => newRoom.amenities.includes(option.value))}
                                    onChange={handleReactMultiSelectChange("amenities")}
                                />
                            </styles.CtnEntryVertical>
                            <styles.CtnEntryVertical removePaddingSeparator={true}>
                                <styles.Text>Type</styles.Text>
                                <styles.SelectReact
                                    name="type"
                                    menuPlacement="top"
                                    menuPosition="fixed"
                                    placeholder="Select type"
                                    isMulti={false}
                                    styles={reactSelectStyles(theme)}
                                    closeMenuOnSelect={true}
                                    options={roomTypeReactOptions}
                                    value={roomTypeReactOptions.find(option => option.value === newRoom.type)}
                                    onChange={handleReactSingleSelectChange("type")}
                                />
                            </styles.CtnEntryVertical>
                        </styles.CtnEntryHorizontal>
                    </styles.CtnEntryVertical>

                    <styles.CtnEntryVertical>
                        <styles.CtnEntryHorizontal>
                            <styles.CtnEntryVertical removePaddingSeparator={true}>
                                <styles.Text>Number</styles.Text>
                                <styles.InputText name="number" onChange={handleStringChange} />
                            </styles.CtnEntryVertical>
                            <styles.CtnEntryVertical removePaddingSeparator={true}>
                                <styles.Text>Price</styles.Text>
                                <styles.InputText name="price" onChange={handleNumberFloatChange} />
                            </styles.CtnEntryVertical>
                            <styles.CtnEntryVertical removePaddingSeparator={true}>
                                <styles.Text>Discount (%)</styles.Text>
                                <styles.InputText name="discount" onChange={handleNumberFloatChange} />
                            </styles.CtnEntryVertical>
                        </styles.CtnEntryHorizontal>
                    </styles.CtnEntryVertical>

                    <styles.CtnButtonCreateUser>
                        <ButtonCreate type="submit" children='+ Create Room' fontSize='1.25em'></ButtonCreate>
                    </styles.CtnButtonCreateUser>
                </styles.Form>
            </styles.CtnForm>
        </styles.CtnSection>
    </>)

}