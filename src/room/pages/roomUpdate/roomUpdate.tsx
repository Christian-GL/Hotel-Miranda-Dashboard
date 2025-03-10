
import React from "react"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"

import * as roomUpdateStyles from "./roomUpdateStyles.ts"
import { ToastContainer } from 'react-toastify'
import { ToastifySuccess } from "../../../common/components/toastify/successPopup/toastifySuccess.tsx"
import { ToastifyError } from "../../../common/components/toastify/errorPopup/toastifyError.tsx"
import { AppDispatch } from "../../../common/redux/store.ts"
import { ApiStatus } from "../../../common/enums/ApiStatus.ts"
import { RoomInterface } from "../../interfaces/roomInterface.ts"
import { RoomAmenities } from "../../data/roomAmenities.ts"
import { RoomType } from "../../data/roomType.ts"
import {
    validatePhotos, validateRoomType, validateAmenities,
    validateNumberBetween, validateBookingList, validateExistingRoomNumber
} from '../../../common/utils/validators.ts'
import {
    DivCtnForm, DivIcon, DivCtnIcons, IconBed, IconUpdate, TitleForm, Form,
    ImgRoom, DivCtnEntry, LabelText, DivCtnEntryBookings, LabelBookings, LabelTextBookingStatus,
    LabelTextInfoBooking, InputText, InputTextPhoto, Select, Option, SelectAmenities, DivButtonCreateUser
} from "../../../common/styles/form.ts"
import { formatDateForPrint } from '../../../common/utils/dateUtils.ts'
import { ButtonCreate } from '../../../common/components/buttonCreate/buttonCreate.tsx'
import { getRoomAllData, getRoomAllStatus, getRoomIdData, getRoomIdStatus } from "../../features/roomSlice.ts"
import { RoomFetchAllThunk } from "../../features/thunks/roomFetchAllThunk.ts"
import { RoomFetchByIDThunk } from "../../features/thunks/roomFetchByIDThunk.ts"
import { RoomUpdateThunk } from '../../features/thunks/roomUpdateThunk.ts'

import { getBookingAllData, getBookingAllStatus } from "../../../booking/features/bookingSlice.ts"
import { BookingFetchAllThunk } from "../../../booking/features/thunks/bookingFetchAllThunk.ts"


export const RoomUpdate = () => {

    const { id } = useParams()
    const idParams = parseInt(id!)
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const roomById = useSelector(getRoomIdData)
    const roomByIdLoading = useSelector(getRoomIdStatus)
    const roomAll = useSelector(getRoomAllData)
    const roomAllLoading: ApiStatus = useSelector(getRoomAllStatus)
    const bookingAll = useSelector(getBookingAllData)
    const bookingAllLoading = useSelector(getBookingAllStatus)
    const [roomUpdated, setRoomUpdated] = useState<RoomInterface>({
        _id: 0,
        photos: [],
        number: '0',
        type: RoomType.singleBed,
        amenities: [],
        price: 0,
        discount: 0,
        booking_id_list: []
    })

    useEffect(() => {
        if (roomByIdLoading === ApiStatus.idle) { dispatch(RoomFetchByIDThunk(idParams)) }
        else if (roomByIdLoading === ApiStatus.fulfilled) {
            if (roomById._id !== idParams) {
                dispatch(RoomFetchByIDThunk(idParams))
            }
            setRoomUpdated({
                _id: roomById._id || 0,
                photos: roomById.photos || [],
                number: roomById.number || '0',
                type: roomById.type || RoomType.singleBed,
                amenities: roomById.amenities || [],
                price: roomById.price || 0,
                discount: roomById.discount || 0,
                booking_id_list: roomById.booking_data_list ? roomById.booking_data_list.map(booking => Number(booking._id)) : []
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

    const handlePhotosChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target
        if (files && files[0]) {
            const photoUrl = URL.createObjectURL(files[0])
            setRoomUpdated(prevState => {
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
        setRoomUpdated({
            ...roomUpdated,
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
        setRoomUpdated({
            ...roomUpdated,
            [name]: selectedAmenities
        })
    }
    const handleStringChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setRoomUpdated({
            ...roomUpdated,
            [name]: value
        })
    }
    const handleNumberFloatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setRoomUpdated({
            ...roomUpdated,
            [name]: value === "" ? 0 : parseFloat(value)
        })
    }
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!validateAllData()) { return }

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

    const validateAllData = (): boolean => {
        // const errorsPhotos = validatePhotos(roomUpdated.photos, 'Photos')
        // if (errorsPhotos.length > 0) { errorsPhotos.map(error => ToastifyError(error)); return false }

        const errorsRoomNumber = validateExistingRoomNumber(roomUpdated.number, roomUpdated.number, roomAll, 'Room number')
        if (errorsRoomNumber.length > 0) { errorsRoomNumber.map(error => ToastifyError(error)); return false }

        const errorsRoomType = validateRoomType(roomUpdated.type, 'Room type')
        if (errorsRoomType.length > 0) { errorsRoomType.map(error => ToastifyError(error)); return false }

        const errorsAmenities = validateAmenities(roomUpdated.amenities, 'Amenities')
        if (errorsAmenities.length > 0) { errorsAmenities.map(error => ToastifyError(error)); return false }

        const errorsPrice = validateNumberBetween(roomUpdated.price, 25, 100000, 'Price')
        if (errorsPrice.length > 0) { errorsPrice.map(error => ToastifyError(error)); return false }

        const errorsDiscount = validateNumberBetween(roomUpdated.discount, 0, 100, 'Discount')
        if (errorsDiscount.length > 0) { errorsDiscount.map(error => ToastifyError(error)); return false }

        const errorsBookingList = validateBookingList(roomUpdated.booking_id_list, 'Booking list')
        if (errorsBookingList.length > 0) { errorsBookingList.map(error => ToastifyError(error)); return false }

        return true
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
                        <InputTextPhoto name="photos" type='file' onChange={(e) => handlePhotosChange(0, e)} />
                        <ImgRoom src={roomUpdated.photos[0]} />
                    </DivCtnEntry>
                    <DivCtnEntry>
                        <LabelText>Photo 2</LabelText>
                        <InputTextPhoto name="photos" type='file' onChange={(e) => handlePhotosChange(1, e)} />
                        <ImgRoom src={roomUpdated.photos[1]} />
                    </DivCtnEntry>
                    <DivCtnEntry>
                        <LabelText>Photo 3</LabelText>
                        <InputTextPhoto name="photos" type='file' onChange={(e) => handlePhotosChange(2, e)} />
                        <ImgRoom src={roomUpdated.photos[2]} />
                    </DivCtnEntry>
                    <DivCtnEntry>
                        <LabelText>Photo 4</LabelText>
                        <InputTextPhoto name="photos" type='file' onChange={(e) => handlePhotosChange(3, e)} />
                        <ImgRoom src={roomUpdated.photos[3]} />
                    </DivCtnEntry>
                    <DivCtnEntry>
                        <LabelText>Photo 5</LabelText>
                        <InputTextPhoto name="photos" type='file' onChange={(e) => handlePhotosChange(4, e)} />
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
                        <SelectAmenities name="amenities" value={roomUpdated.amenities} onChange={handleAmenitiesChange} multiple={true}>
                            {Object.values(RoomAmenities).map((amenity, index) => (
                                <Option key={index} value={amenity}>
                                    {amenity}
                                </Option>
                            ))}
                        </SelectAmenities>
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Booking Status</LabelText>
                        <DivCtnEntryBookings>
                            {
                                // FUNCIONA EL LISTADO DE BOOKING POR ROOM?
                                bookingAll.filter(booking => roomUpdated.booking_id_list.includes(booking._id)).length === 0 ?
                                    <LabelTextBookingStatus>Available</LabelTextBookingStatus> :
                                    (bookingAll.filter(booking => roomUpdated.booking_id_list.includes(booking._id))
                                        .map((booking, index) => (
                                            <LabelBookings key={index}>
                                                <LabelTextInfoBooking><b>#{booking._id}</b></LabelTextInfoBooking>
                                                <LabelTextInfoBooking>-</LabelTextInfoBooking>
                                                <LabelTextInfoBooking>{formatDateForPrint(booking.check_in_date)}</LabelTextInfoBooking>
                                                <LabelTextInfoBooking>➞</LabelTextInfoBooking>
                                                <LabelTextInfoBooking>{formatDateForPrint(booking.check_out_date)}</LabelTextInfoBooking>
                                            </LabelBookings>
                                        )))
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