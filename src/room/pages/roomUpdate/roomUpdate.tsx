
import React from "react"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"
import { useTheme } from "styled-components"

import * as styles from "common/styles/form"
import roomDefaultImg from '../../../assets/img/roomDefault.jpg'
import { reactSelectStyles } from "common/styles/externalLibrariesStyles"
import { ToastContainer } from 'react-toastify'
import { ToastifySuccess } from "../../../common/components/toastify/successPopup/toastifySuccess"
import { ToastifyError } from "../../../common/components/toastify/errorPopup/toastifyError"
import { AppDispatch } from "../../../common/redux/store"
import { ApiStatus } from "../../../common/enums/ApiStatus"
import { OptionYesNo } from "common/enums/optionYesNo"
import { RoomInterfaceId } from "../../interfaces/roomInterface"
import { ApiErrorResponseInterface } from "common/interfaces/apiResponses/apiErrorResponseInterface"
import { RoomAmenities } from "../../enums/roomAmenities"
import { RoomType } from "../../enums/roomType"
import { createFormHandlers } from '../../../common/utils/formHandlers'
import { ReactSelectOption } from "common/types/reactMultiSelectOption"
import {
    validateRoomNumber, validateRoomPhotoList, validateRoomType,
    validateAmenities, validateRoomPrice, validateRoomDiscount,
    validateOptionYesNo, validateMongoDBObjectIdList
} from '../../../common/utils/validators'
import { ButtonCreate } from '../../../common/components/buttonCreate/buttonCreate'
import { getRoomAllData, getRoomAllStatus, getRoomIdData, getRoomIdStatus } from "../../features/roomSlice"
import { RoomFetchAllThunk } from "../../features/thunks/roomFetchAllThunk"
import { RoomFetchByIDThunk } from "../../features/thunks/roomFetchByIDThunk"
import { RoomUpdateThunk } from '../../features/thunks/roomUpdateThunk'

import { getBookingAllData, getBookingAllStatus } from "../../../booking/features/bookingSlice"
import { BookingFetchAllThunk } from "../../../booking/features/thunks/bookingFetchAllThunk"


export const RoomUpdate = () => {

    const { id } = useParams()
    const idParams = id!
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const theme = useTheme()
    const roomById = useSelector(getRoomIdData)
    const roomByIdLoading = useSelector(getRoomIdStatus)
    const roomAll = useSelector(getRoomAllData)
    const roomAllLoading: ApiStatus = useSelector(getRoomAllStatus)
    const bookingAll = useSelector(getBookingAllData)
    const bookingAllLoading = useSelector(getBookingAllStatus)
    const [roomUpdated, setRoomUpdated] = useState<RoomInterfaceId>({
        _id: '0',
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
        handleReactSingleSelectChange,
        handleReactMultiSelectChange,
        handleNumberFloatChange,
    } = createFormHandlers(setRoomUpdated)
    const amenityReactOptions: ReactSelectOption<RoomAmenities>[] = Object.values(RoomAmenities).map(amenity => ({
        value: amenity,
        label: amenity
    }))
    const roomTypeReactOptions: ReactSelectOption<RoomType>[] = Object.values(RoomType).map(type => ({
        value: type,
        label: type
    }))

    useEffect(() => {
        if (roomByIdLoading === ApiStatus.idle) { dispatch(RoomFetchByIDThunk(idParams)) }
        else if (roomByIdLoading === ApiStatus.fulfilled) {
            if (roomById._id !== idParams) {
                dispatch(RoomFetchByIDThunk(idParams))
            }
            setRoomUpdated({
                _id: roomById._id || '0',
                number: roomById.number || '0',
                photos: roomById.photos || [],
                type: roomById.type || RoomType.singleBed,
                amenities: roomById.amenities || [],
                price: roomById.price || 0,
                discount: roomById.discount || 0,
                isActive: roomById.isActive || OptionYesNo.no,
                isArchived: roomById.isArchived || OptionYesNo.yes,
                booking_id_list: roomById.booking_id_list || []
            })
        }
    }, [roomByIdLoading, roomById, bookingAllLoading, bookingAll, id])
    useEffect(() => {
        if (roomAllLoading === ApiStatus.idle) { dispatch(RoomFetchAllThunk()) }
    }, [roomAllLoading, roomAll])
    useEffect(() => {
        if (bookingAllLoading === ApiStatus.idle) { dispatch(BookingFetchAllThunk()) }
    }, [bookingAllLoading, bookingAll])

    const validateAllData = (): string[] => {
        const allErrorMessages: string[] = []

        validateRoomNumber(roomUpdated.number, 'Number').map(
            error => allErrorMessages.push(error)
        )
        validateRoomPhotoList(roomUpdated.photos, 'Photos').map(
            error => allErrorMessages.push(error)
        )
        validateRoomType(roomUpdated.type, 'Type').map(
            error => allErrorMessages.push(error)
        )
        validateAmenities(roomUpdated.amenities, 'Amenities').map(
            error => allErrorMessages.push(error)
        )
        validateRoomPrice(roomUpdated.price, 'Price').map(
            error => allErrorMessages.push(error)
        )
        validateRoomDiscount(roomUpdated.discount, 'Discount').map(
            error => allErrorMessages.push(error)
        )
        validateOptionYesNo(roomUpdated.isActive, 'Room isActive').map(
            error => allErrorMessages.push(error)
        )
        validateOptionYesNo(roomUpdated.isArchived, 'Room isArchived').map(
            error => allErrorMessages.push(error)
        )
        validateMongoDBObjectIdList(roomUpdated.booking_id_list).map(
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
            await dispatch(RoomUpdateThunk({ idRoom: roomUpdated._id, updatedRoomData: roomUpdated }))
                .unwrap()
                .then(() => ToastifySuccess('Room updated', () => navigate('../')))
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
                    <styles.IconUpdate />
                </styles.CtnSecondaryIcons>
            </styles.CtnPrimaryIcons>
            <styles.TitleForm>Update Room #{roomUpdated._id}</styles.TitleForm>

            <styles.CtnForm>
                <styles.Form onSubmit={handleSubmit}>
                    <styles.CtnEntryVertical>
                        <styles.CtnEntryHorizontal>
                            <styles.CtnEntryVertical removePaddingSeparator={true}>
                                <styles.Text>Number</styles.Text>
                                <styles.InputText name="number" value={roomUpdated.number} onChange={handleStringChange} />
                            </styles.CtnEntryVertical>
                            <styles.CtnEntryVertical removePaddingSeparator={true}>
                                <styles.Text>Price ($)</styles.Text>
                                <styles.InputText name="price" value={roomUpdated.price} onChange={handleNumberFloatChange} />
                            </styles.CtnEntryVertical>
                            <styles.CtnEntryVertical removePaddingSeparator={true}>
                                <styles.Text>Discount (%)</styles.Text>
                                <styles.InputText name="discount" value={roomUpdated.discount} onChange={handleNumberFloatChange} />
                            </styles.CtnEntryVertical>
                        </styles.CtnEntryHorizontal>
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
                                    value={amenityReactOptions.filter(option => roomUpdated.amenities.includes(option.value))}
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
                                    value={roomTypeReactOptions.find(option => option.value === roomUpdated.type)}
                                    onChange={handleReactSingleSelectChange("type")}
                                />
                            </styles.CtnEntryVertical>
                        </styles.CtnEntryHorizontal>
                    </styles.CtnEntryVertical>

                    <styles.CtnEntryVertical>
                        <styles.Text>Photo 1 (Main)</styles.Text>
                        <styles.InputTextPhoto name="photos" type="file" onChange={handleArrayPhotosChange(0, "photos")} />
                        <styles.ImgRoom
                            src={roomUpdated.photos?.[0] || roomDefaultImg}
                            onError={(e) => { e.currentTarget.src = roomDefaultImg }}
                        />
                    </styles.CtnEntryVertical>

                    <styles.CtnEntryVertical>
                        <styles.CtnEntryHorizontal>
                            <styles.CtnEntryVertical removePaddingSeparator={true}>
                                <styles.Text>Photo 2</styles.Text>
                                <styles.InputTextPhoto name="photos" type="file" onChange={handleArrayPhotosChange(1, "photos")} />
                                <styles.ImgRoom
                                    src={roomUpdated.photos?.[1] || roomDefaultImg}
                                    onError={(e) => { e.currentTarget.src = roomDefaultImg }}
                                />
                            </styles.CtnEntryVertical>
                            <styles.CtnEntryVertical removePaddingSeparator={true}>
                                <styles.Text>Photo 3</styles.Text>
                                <styles.InputTextPhoto name="photos" type="file" onChange={handleArrayPhotosChange(2, "photos")} />
                                <styles.ImgRoom
                                    src={roomUpdated.photos?.[2] || roomDefaultImg}
                                    onError={(e) => { e.currentTarget.src = roomDefaultImg }}
                                />
                            </styles.CtnEntryVertical>
                        </styles.CtnEntryHorizontal>
                    </styles.CtnEntryVertical>

                    <styles.CtnEntryVertical>
                        <styles.CtnEntryHorizontal>
                            <styles.CtnEntryVertical removePaddingSeparator={true}>
                                <styles.Text>Photo 4</styles.Text>
                                <styles.InputTextPhoto name="photos" type="file" onChange={handleArrayPhotosChange(3, "photos")} />
                                <styles.ImgRoom
                                    src={roomUpdated.photos?.[3] || roomDefaultImg}
                                    onError={(e) => { e.currentTarget.src = roomDefaultImg }}
                                />
                            </styles.CtnEntryVertical>
                            <styles.CtnEntryVertical removePaddingSeparator={true}>
                                <styles.Text>Photo 5</styles.Text>
                                <styles.InputTextPhoto name="photos" type="file" onChange={handleArrayPhotosChange(4, "photos")} />
                                <styles.ImgRoom
                                    src={roomUpdated.photos?.[4] || roomDefaultImg}
                                    onError={(e) => { e.currentTarget.src = roomDefaultImg }}
                                />
                            </styles.CtnEntryVertical>
                        </styles.CtnEntryHorizontal>
                    </styles.CtnEntryVertical>

                    <styles.CtnButtonCreateUser>
                        <ButtonCreate type="submit" children='⮂ Update Room' fontSize='1.25em'></ButtonCreate>
                    </styles.CtnButtonCreateUser>
                </styles.Form>
            </styles.CtnForm>
        </styles.CtnSection>
    </>)

}