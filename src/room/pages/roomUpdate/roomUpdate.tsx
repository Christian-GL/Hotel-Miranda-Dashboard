
import React from "react"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"

import * as roomUpdateStyles from "./roomUpdateStyles"
import { ToastContainer } from 'react-toastify'
import { ToastifySuccess } from "../../../common/components/toastify/successPopup/toastifySuccess"
import { ToastifyError } from "../../../common/components/toastify/errorPopup/toastifyError"
import { AppDispatch } from "../../../common/redux/store"
import { ApiStatus } from "../../../common/enums/ApiStatus"
import { OptionYesNo } from "common/enums/optionYesNo"
import { RoomInterface, RoomInterfaceBookings } from "../../interfaces/roomInterface"
import { RoomAmenities } from "../../enums/roomAmenities"
import { RoomType } from "../../enums/roomType"
import { createFormHandlers } from '../../../common/utils/formHandlers'
import {
    validateNumber, validateRoomPhotoList, validateRoomType,
    validateAmenities, validateRoomPrice, validateRoomDiscount,
    validateOptionYesNo, validateMongoDBObjectIdList
} from '../../../common/utils/commonValidator'
import {
    DivCtnForm, DivIcon, DivCtnIcons, IconBed, IconUpdate, TitleForm, Form,
    ImgRoom, DivCtnEntry, LabelText, DivCtnEntryBookings, LabelBookings, LabelTextBookingStatus,
    LabelTextInfoBooking, InputText, InputTextPhoto, Select, Option, SelectAmenities, DivButtonCreateUser
} from "../../../common/styles/form"
import { formatDateForPrint } from '../../../common/utils/dateUtils'
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
    const roomById = useSelector(getRoomIdData)
    const roomByIdLoading = useSelector(getRoomIdStatus)
    const roomAll = useSelector(getRoomAllData)
    const roomAllLoading: ApiStatus = useSelector(getRoomAllStatus)
    const bookingAll = useSelector(getBookingAllData)
    const bookingAllLoading = useSelector(getBookingAllStatus)
    const [roomUpdated, setRoomUpdated] = useState<RoomInterface>({
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
        handleMultiSelectChange,
        handleNumberFloatChange,
        handleSelectChange
    } = createFormHandlers(setRoomUpdated)

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
                booking_id_list: roomById.booking_data_list ? roomById.booking_data_list.map(booking => booking._id) : []
            })
        }
        else if (roomByIdLoading === ApiStatus.rejected) { alert("Error in API update rooms") }
    }, [roomByIdLoading, roomById, bookingAllLoading, bookingAll, id])
    useEffect(() => {
        if (roomAllLoading === ApiStatus.idle) { dispatch(RoomFetchAllThunk()) }
        else if (roomAllLoading === ApiStatus.fulfilled) { }
        else if (roomAllLoading === ApiStatus.rejected) { alert("Error in API update rooms") }
    }, [roomAllLoading, roomAll])
    useEffect(() => {
        if (bookingAllLoading === ApiStatus.idle) { dispatch(BookingFetchAllThunk()) }
        else if (bookingAllLoading === ApiStatus.fulfilled) { }
        else if (bookingAllLoading === ApiStatus.rejected) { alert("Error in API update rooms > booking update") }
    }, [bookingAllLoading, bookingAll])

    const validateAllData = (): string[] => {
        const allErrorMessages: string[] = []

        validateNumber(roomUpdated.number, 'Number').map(
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
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (validateAllData().length > 0) {
            validateAllData().forEach(error => ToastifyError(error))
            return
        }

        dispatch(RoomUpdateThunk({ idRoom: roomUpdated._id, updatedRoomData: roomUpdated }))
            .then(() => {
                ToastifySuccess('Room updated', () => {
                    navigate('../')
                })
            })
            .catch((error) => {
                ToastifyError(error)
            })
    }


    return (<>
        <ToastContainer />

        <roomUpdateStyles.SectionPageRoomUpdate>
            <DivCtnForm>
                <DivIcon>
                    <DivCtnIcons>
                        <IconBed />
                        <IconUpdate />
                    </DivCtnIcons>
                </DivIcon>
                <TitleForm>Update Room #{roomUpdated._id}</TitleForm>

                <Form onSubmit={handleSubmit}>
                    <DivCtnEntry>
                        <LabelText>Photo 1 (Main)</LabelText>
                        <InputTextPhoto type="file" onChange={handleArrayPhotosChange(0, "photos")} />
                        <ImgRoom src={roomUpdated.photos[0]} />
                    </DivCtnEntry>
                    <DivCtnEntry>
                        <LabelText>Photo 2</LabelText>
                        <InputTextPhoto type="file" onChange={handleArrayPhotosChange(1, "photos")} />
                        <ImgRoom src={roomUpdated.photos[1]} />
                    </DivCtnEntry>
                    <DivCtnEntry>
                        <LabelText>Photo 3</LabelText>
                        <InputTextPhoto type="file" onChange={handleArrayPhotosChange(2, "photos")} />
                        <ImgRoom src={roomUpdated.photos[2]} />
                    </DivCtnEntry>
                    <DivCtnEntry>
                        <LabelText>Photo 4</LabelText>
                        <InputTextPhoto type="file" onChange={handleArrayPhotosChange(3, "photos")} />
                        <ImgRoom src={roomUpdated.photos[3]} />
                    </DivCtnEntry>
                    <DivCtnEntry>
                        <LabelText>Photo 5</LabelText>
                        <InputTextPhoto type="file" onChange={handleArrayPhotosChange(4, "photos")} />
                        <ImgRoom src={roomUpdated.photos[4]} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Number</LabelText>
                        <InputText name="number" value={roomUpdated.number} onChange={handleStringChange} />

                        <LabelText minWidth="7.5rem" margin="0 0 0 5rem">Room Type</LabelText>
                        <Select name="type" value={roomUpdated.type} onChange={handleSelectChange}>
                            {Object.values(RoomType).map((type, index) => (
                                <option key={index} value={type}>
                                    {type}
                                </option>
                            ))}
                        </Select>
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Price</LabelText>
                        <InputText name="price" value={roomUpdated.price} onChange={handleNumberFloatChange} />

                        <LabelText minWidth="7.5rem" margin="0 0 0 5rem">Discount (%)</LabelText>
                        <InputText name="discount" value={roomUpdated.discount} onChange={handleNumberFloatChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Amenities</LabelText>
                        <SelectAmenities name="amenities" value={roomUpdated.amenities} onChange={handleMultiSelectChange} multiple={true}>
                            {Object.values(RoomAmenities).map((amenity, index) => (
                                <Option key={index} value={amenity}>
                                    {amenity}
                                </Option>
                            ))}
                        </SelectAmenities>
                    </DivCtnEntry>

                    {/* !!! ACTUALIZAR */}
                    <DivCtnEntry>
                        <LabelText>Booking Status</LabelText>
                        <DivCtnEntryBookings>
                            {
                                roomById?.booking_data_list ? (
                                    roomById.booking_data_list.length === 0 ?
                                        <LabelTextBookingStatus>Available</LabelTextBookingStatus> :
                                        roomById.booking_data_list.map((booking, index) => (
                                            <LabelBookings key={index}>
                                                <LabelTextInfoBooking><b>#{booking._id}</b></LabelTextInfoBooking>
                                                <LabelTextInfoBooking>-</LabelTextInfoBooking>
                                                <LabelTextInfoBooking>{formatDateForPrint(booking.check_in_date)}</LabelTextInfoBooking>
                                                <LabelTextInfoBooking>➞</LabelTextInfoBooking>
                                                <LabelTextInfoBooking>{formatDateForPrint(booking.check_out_date)}</LabelTextInfoBooking>
                                            </LabelBookings>
                                        ))
                                ) : ""
                            }
                        </DivCtnEntryBookings>
                    </DivCtnEntry>

                    <DivButtonCreateUser>
                        <ButtonCreate type="submit" children='⮂ Update Room' fontSize='1.25em'></ButtonCreate>
                    </DivButtonCreateUser>
                </Form>
            </DivCtnForm>
        </roomUpdateStyles.SectionPageRoomUpdate>
    </>)
}