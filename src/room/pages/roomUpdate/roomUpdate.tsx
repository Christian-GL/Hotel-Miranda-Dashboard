
import React from "react"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams } from "react-router-dom"

import * as roomUpdateStyles from "./roomUpdateStyles.ts"
import * as gb from '../../../common/styles/globalVars.ts'
import { AppDispatch } from "../../../common/redux/store.ts"
import { ApiStatus } from "../../../common/enums/ApiStatus.ts"
import { RoomInterface } from "../../interfaces/roomInterface.ts"
import { RoomAmenities } from "../../data/roomAmenities.ts"
import { RoomType } from "../../data/roomType.ts"
import {
    DivCtnForm, DivIcon, DivCtnIcons, IconBed, IconUpdate, TitleForm, Form,
    ImgRoom, DivCtnEntry, LabelText, DivCtnEntryBookings, LabelBookings, LabelTextBookingStatus,
    InputText, InputTextPhoto, Select, Option, SelectAmenities, DivButtonCreateUser
} from "../../../common/styles/form.ts"
import { ButtonCreate } from '../../../common/components/buttonCreate/buttonCreate.tsx'
import { getRoomIdData, getRoomIdStatus } from "../../features/roomSlice.ts"
import { RoomFetchByIDThunk } from "../../features/thunks/roomFetchByIDThunk.ts"
import { RoomUpdateThunk } from '../../features/thunks/roomUpdateThunk.ts'

import { getBookingAllData, getBookingAllStatus } from "../../../booking/features/bookingSlice.ts"
import { BookingFetchAllThunk } from "../../../booking/features/thunks/bookingFetchAllThunk.ts"
// import { getBookingIdData, getBookingIdStatus, getBookingError } from "../../../booking/features/bookingSlice.ts"
// import { BookingFetchByIDThunk } from "../../../booking/features/thunks/bookingFetchByIDThunk.ts"
// import { resetIdStatus } from "../../../booking/features/bookingSlice.ts"


export const RoomUpdate = () => {

    const { id } = useParams()
    const idParams = parseInt(id!)
    const dispatch = useDispatch<AppDispatch>()
    const roomById = useSelector(getRoomIdData)
    const roomByIdLoading = useSelector(getRoomIdStatus)
    const bookingAll = useSelector(getBookingAllData)
    const bookingAllLoading = useSelector(getBookingAllStatus)
    // const bookingById = useSelector(getBookingIdData)
    // const bookingByIdLoading = useSelector(getBookingIdStatus)
    // const [index, setIndex] = useState(0)
    // const [bookingListIds, setBookingListIds] = useState([])
    const [roomUpdated, setRoomUpdated] = useState<RoomInterface>({
        id: 0,
        photos: [],
        type: '',
        amenities: [],
        price: 0,
        discount: 0,
        booking_list: []
    })

    useEffect(() => {
        if (roomByIdLoading === ApiStatus.idle) { dispatch(RoomFetchByIDThunk(idParams)) }
        else if (roomByIdLoading === ApiStatus.fulfilled) {
            if (roomById?.id !== idParams) {
                dispatch(RoomFetchByIDThunk(idParams))
            }
            setRoomUpdated({
                id: roomById.id || 0,
                photos: roomById.photos || [],
                type: roomById.type || '',
                amenities: roomById.amenities || [],
                price: roomById.price || 0,
                discount: roomById.discount || 0,
                booking_list: roomById.booking_list || []
            })
        }
        else if (roomByIdLoading === ApiStatus.rejected) { alert("Error en la api de room update") }
    }, [roomByIdLoading, roomById, bookingAllLoading, bookingAll, id])
    useEffect(() => {
        if (bookingAllLoading === ApiStatus.idle) { dispatch(BookingFetchAllThunk()) }
        else if (bookingAllLoading === ApiStatus.fulfilled) { }
        else if (bookingAllLoading === ApiStatus.rejected) { alert("Error en la api de room update > booking update") }
    }, [bookingAllLoading, bookingAll])
    // useEffect(() => {
    //     if (bookingByIdLoading === ApiStatus.idle && roomByIdLoading === ApiStatus.fulfilled && index < roomById.booking_list.length) {
    //         console.log('B.List--> ', roomById.booking_list.length)
    //         console.log('index--> ', index)
    //         console.log('idle')
    //         dispatch(BookingFetchByIDThunk(roomById.booking_list[index]))
    //         setIndex(index + 1)
    //         console.log('INDEX+1')
    //     }
    //     else if (bookingByIdLoading === ApiStatus.fulfilled) {
    //         console.log('fulfilled')
    //         setBookingListIds([...bookingListIds, bookingById])
    //         dispatch(resetIdStatus())
    //     }
    //     else if (bookingByIdLoading === ApiStatus.rejected) { alert("Error en la api de bookings") }
    //     console.log('==============')
    // }, [roomByIdLoading, bookingByIdLoading, index])

    const handlePhotoChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
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
    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setRoomUpdated({
            ...roomUpdated,
            [name]: parseInt(value)
        })
    }
    const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setRoomUpdated({
            ...roomUpdated,
            [name]: parseInt(value)
        })
    }
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        dispatch(RoomUpdateThunk(roomUpdated))
            .then(() => {
                alert(`Room #${roomUpdated.id} updated`)
            })
            .catch((error) => {
                alert(error)
            })
    }

    return (

        <roomUpdateStyles.SectionPageRoomUpdate>
            <DivCtnForm>
                <DivIcon>
                    <DivCtnIcons>
                        <IconBed />
                        <IconUpdate />
                    </DivCtnIcons>
                </DivIcon>
                <TitleForm>Update Room #{roomUpdated.id}</TitleForm>

                <Form onSubmit={handleSubmit}>
                    <DivCtnEntry>
                        <LabelText>Photo 1 (Main)</LabelText>
                        <InputTextPhoto name="photos" type='file' onChange={(e) => handlePhotoChange(0, e)} />
                        <ImgRoom src={roomUpdated.photos[0]} />
                    </DivCtnEntry>
                    <DivCtnEntry>
                        <LabelText>Photo 2</LabelText>
                        <InputTextPhoto name="photos" type='file' onChange={(e) => handlePhotoChange(1, e)} />
                        <ImgRoom src={roomUpdated.photos[1]} />
                    </DivCtnEntry>
                    <DivCtnEntry>
                        <LabelText>Photo 3</LabelText>
                        <InputTextPhoto name="photos" type='file' onChange={(e) => handlePhotoChange(2, e)} />
                        <ImgRoom src={roomUpdated.photos[2]} />
                    </DivCtnEntry>
                    <DivCtnEntry>
                        <LabelText>Photo 4</LabelText>
                        <InputTextPhoto name="photos" type='file' onChange={(e) => handlePhotoChange(3, e)} />
                        <ImgRoom src={roomUpdated.photos[3]} />
                    </DivCtnEntry>
                    <DivCtnEntry>
                        <LabelText>Photo 5</LabelText>
                        <InputTextPhoto name="photos" type='file' onChange={(e) => handlePhotoChange(4, e)} />
                        <ImgRoom src={roomUpdated.photos[4]} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Room Type</LabelText>
                        <Select name="type" value={roomUpdated.type} onChange={handleTypeChange}>
                            {Object.values(RoomType).map((type, index) => (
                                <option key={index} value={type}>
                                    {type}
                                </option>
                            ))}
                        </Select>
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Amenities</LabelText>
                        <SelectAmenities name="amenities" value={roomUpdated.amenities} onChange={handleAmenitiesChange} multiple={true}>
                            {Object.values(RoomAmenities).map((amenity, index) => (
                                <option key={index} value={amenity}>
                                    {amenity}
                                </option>
                            ))}
                        </SelectAmenities>
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Price</LabelText>
                        <InputText name="price" value={roomUpdated.price} onChange={handlePriceChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Discount (%)</LabelText>
                        <InputText name="discount" value={roomUpdated.discount} onChange={handleDiscountChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Booking Status</LabelText>
                        <DivCtnEntryBookings>
                            {
                                // bookingListIds.length === 0 ?
                                //     <LabelTextBookingStatus color={gb.colorLightGreenButton}>Available</LabelTextBookingStatus> :
                                //     (bookingListIds.map((booking, index) => (
                                //         <LabelBookings key={index}>
                                //             <b>Booking #{booking.id} -</b> {booking.check_in_date} {booking.check_in_time} ⭢ {booking.check_out_date} {booking.check_out_time}
                                //         </LabelBookings>
                                //     )))
                                bookingAll.filter((booking) => roomUpdated.booking_list.includes(booking.id)).length === 0 ?
                                    <LabelTextBookingStatus color={gb.colorLightGreenButton}>Available</LabelTextBookingStatus> :
                                    (bookingAll.filter(booking => roomUpdated.booking_list.includes(booking.id))
                                        .map((booking, index) => (
                                            <LabelBookings key={index}>
                                                <b>Booking #{booking.id}
                                                    &nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;&nbsp;</b>
                                                {booking.check_in_date} {booking.check_in_time}
                                                &nbsp;&nbsp;⭢&nbsp;&nbsp;
                                                {booking.check_out_date} {booking.check_out_time}
                                                <b>&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;&nbsp;</b>
                                                {booking.room_booking_status}
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

    )
}