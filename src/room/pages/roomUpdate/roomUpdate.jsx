

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams } from "react-router-dom"

import * as roomUpdateJS from "./roomUpdate.js"
import * as gb from '../../../common/styles/globalVars.js'
import roomTypeData from '../../data/roomTypeData.json'
import roomAmenitiesData from '../../data/roomAmenitiesData.json'
import {
    DivCtnForm, DivIcon, DivCtnIcons, IconBed, IconUpdate, TitleForm, Form, ImgRoom, DivCtnEntry,
    LabelText, DivCtnEntryBookings, LabelBookings, LabelTextBookingStatus, InputText, InputTextPhoto, Select, Option, SelectAmenities, DivButtonCreateUser
} from "../../../common/styles/form.js"
import { ButtonCreate } from '../../../common/components/buttonCreate/buttonCreate.jsx'
import { getRoomIdData, getRoomIdStatus, getRoomError } from "../../features/roomSlice.js"
import { RoomFetchByIDThunk } from "../../features/thunks/roomFetchByIDThunk.js"
import { RoomUpdateByIdThunk } from '../../features/thunks/roomUpdateByIdThunk.js'

import { getBookingAllData, getBookingAllStatus, getBookingError } from "../../../booking/features/bookingSlice.js"
import { BookingFetchAllThunk } from "../../../booking/features/thunks/bookingFetchAllThunk.js"
// import { getBookingIdData, getBookingIdStatus, getBookingError } from "../../../booking/features/bookingSlice.js"
// import { BookingFetchByIDThunk } from "../../../booking/features/thunks/bookingFetchByIDThunk.js"
// import { resetIdStatus } from "../../../booking/features/bookingSlice.js"


export const RoomUpdate = () => {

    const { id } = useParams()
    const dispatch = useDispatch()
    const roomById = useSelector(getRoomIdData)
    const roomByIdLoading = useSelector(getRoomIdStatus)
    const bookingAll = useSelector(getBookingAllData)
    const bookingAllLoading = useSelector(getBookingAllStatus)
    // const bookingById = useSelector(getBookingIdData)
    // const bookingByIdLoading = useSelector(getBookingIdStatus)
    // const [index, setIndex] = useState(0)
    // const [bookingListIds, setBookingListIds] = useState([])
    const [roomUpdated, setRoomUpdated] = useState({
        id: 0,
        photos: [],
        type: '',
        amenities: [],
        price: 0,
        discount: 0,
        booking_list: []
    })

    useEffect(() => {
        dispatch(RoomFetchByIDThunk(parseInt(id)))
    }, [id, dispatch])
    useEffect(() => {
        if (roomByIdLoading === "idle") { dispatch(RoomFetchByIDThunk(parseInt(id))) }
        else if (roomByIdLoading === "fulfilled") {
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
        else if (roomByIdLoading === "rejected") { alert("Error en la api de rooms") }
    }, [roomByIdLoading, roomById])
    useEffect(() => {
        if (bookingAllLoading === "idle") { dispatch(BookingFetchAllThunk()) }
        else if (bookingAllLoading === "fulfilled") { }
        else if (bookingAllLoading === "rejected") { alert("Error en la api de bookings") }
    }, [bookingAllLoading, bookingAll])
    // useEffect(() => {
    //     if (bookingByIdLoading === "idle" && roomByIdLoading === "fulfilled" && index < roomById.booking_list.length) {
    //         console.log('B.List--> ', roomById.booking_list.length)
    //         console.log('index--> ', index)
    //         console.log('idle')
    //         dispatch(BookingFetchByIDThunk(roomById.booking_list[index]))
    //         setIndex(index + 1)
    //         console.log('INDEX+1')
    //     }
    //     else if (bookingByIdLoading === "fulfilled") {
    //         console.log('fulfilled')
    //         setBookingListIds([...bookingListIds, bookingById])
    //         dispatch(resetIdStatus())
    //     }
    //     else if (bookingByIdLoading === "rejected") { alert("Error en la api de bookings") }
    //     console.log('==============')
    // }, [roomByIdLoading, bookingByIdLoading, index])
    useEffect(() => {
        dispatch(RoomFetchByIDThunk(parseInt(id)))
    }, [id, dispatch])

    const handlePhotoChange = (index, e) => {
        const { files } = e.target
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
    const handleTypeChange = (e) => {
        const { name, value } = e.target
        setRoomUpdated({
            ...roomUpdated,
            [name]: value
        })
    }
    const handleAmenitiesChange = (e) => {
        const { name, options } = e.target
        const selectedAmenities = []
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
    const handlePriceChange = (e) => {
        const { name, value } = e.target
        setRoomUpdated({
            ...roomUpdated,
            [name]: parseInt(value)
        })
    }
    const handleDiscountChange = (e) => {
        const { name, value } = e.target
        setRoomUpdated({
            ...roomUpdated,
            [name]: parseInt(value)
        })
    }
    const handleSubmit = e => {
        e.preventDefault()
        dispatch(RoomUpdateByIdThunk(roomUpdated))
            .then(() => {
                alert(`Room #${roomUpdated.id} updated`)
            })
            .catch((error) => {
                alert(`Error updating the room #${roomUpdated.id}: `, error)
            })
    }

    return (

        <roomUpdateJS.SectionPageRoomUpdate>
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
                            {roomTypeData.type.map((type, index) => (
                                <Option key={index} value={type}>{type}</Option>
                            ))}
                        </Select>
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Amenities</LabelText>
                        <SelectAmenities name="amenities" value={roomUpdated.amenities} onChange={handleAmenitiesChange} multiple={true}>
                            {roomAmenitiesData.amenities.map((amenity, index) => (
                                <Option key={index} value={amenity}>{amenity}</Option>
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
                                                <b>Booking #{booking.id} -</b> {booking.check_in_date} {booking.check_in_time} ⭢ {booking.check_out_date} {booking.check_out_time}
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
        </roomUpdateJS.SectionPageRoomUpdate>

    )
}