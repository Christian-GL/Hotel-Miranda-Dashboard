

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams } from "react-router-dom"

import * as roomCreateJS from "./roomUpdate.js"
import {
    DivCtnForm, DivIcon, DivCtnIcons, IconBed, IconUpdate, TitleForm, Form, ImgRoom, DivCtnEntry,
    LabelText, InputText, InputTextPhoto, Select, Option, SelectAmenities, DivButtonCreateUser
} from '../../../../common/components/form/form.js'
import { ButtonCreate } from '../../../../common/components/buttonCreate/buttonCreate.jsx'
import { getRoomIdData, getRoomIdStatus, getRoomError } from "../../features/roomSlice.js"
import { RoomFetchByIDThunk } from "../../features/thunks/roomFetchByIDThunk.js"
import { RoomUpdateByIdThunk } from '../../features/thunks/roomUpdateByIdThunk.js'


export const RoomUpdate = () => {

    const { id } = useParams()
    const roomById = useSelector(getRoomIdData)
    const roomByIdLoading = useSelector(getRoomIdStatus)
    const [roomUpdated, setRoomUpdated] = useState({
        id: 0,
        photo: '',
        number: '',
        type: '',
        amenities: [],
        price: 0,
        offer_price: 0,
        booking_status: false
    })

    const dispatch = useDispatch()
    useEffect(() => {
        if (roomByIdLoading === "idle") { dispatch(RoomFetchByIDThunk(parseInt(id))) }
        else if (roomByIdLoading === "fulfilled" && Object.keys(roomById).length !== 0) {
            setRoomUpdated({
                id: roomById.id,
                photo: roomById.photo || '',
                number: roomById.number || '',
                type: roomById.type || '',
                amenities: roomById.amenities || [],
                price: roomById.price || 0,
                offer_price: roomById.offer_price || 0,
                booking_status: roomById.booking_status || ''
            })
        }
        else if (roomByIdLoading === "rejected") { alert("Error en la api") }
    }, [roomByIdLoading, roomById])


    // QUE URL DE FOTO DEBE GUARDAR EN REDUX ???
    const handlePhotoChange = (e) => {
        const { name, files } = e.target
        if (files[0]) {
            const photoUrl = URL.createObjectURL(files[0])
            setRoomUpdated({
                ...roomUpdated,
                [name]: photoUrl
            })
        }
    }
    const handleNumberChange = (e) => {
        const { name, value } = e.target
        setRoomUpdated({
            ...roomUpdated,
            [name]: parseInt(value)
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
    const handleOfferPriceChange = (e) => {
        const { name, value } = e.target
        setRoomUpdated({
            ...roomUpdated,
            [name]: parseInt(value)
        })
    }
    const handleBookingStatusChange = (e) => {
        const { name, value } = e.target
        setRoomUpdated({
            ...roomUpdated,
            [name]: value === 'false' ? false : true
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

        <roomCreateJS.SectionPageRoomUpdate>
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
                        <LabelText>Photo</LabelText>
                        <InputTextPhoto name="photo" type='file' onChange={handlePhotoChange} />
                        <ImgRoom src={roomUpdated.photo} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Room Number</LabelText>
                        <InputText name="number" value={roomUpdated.number} onChange={handleNumberChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Room Type</LabelText>
                        <Select name="type" value={roomUpdated.type} onChange={handleTypeChange}>
                            <Option value='suite'>Suite</Option>
                            <Option value='single_bed'>Single Bed</Option>
                            <Option value='double_bed'>Double Bed</Option>
                            <Option value='double_superior'>Double Superior</Option>
                        </Select>
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Amenities</LabelText>
                        <SelectAmenities name="amenities" value={roomUpdated.amenities} onChange={handleAmenitiesChange} multiple={true}>
                            <Option value='3 Bed Space'>3 Bed Space</Option>
                            <Option value='24 Hours Guard'>24 Hours Guard</Option>
                            <Option value='Free WiFi'>Free WiFi</Option>
                            <Option value='2 Bathroom'>2 Bathroom</Option>
                            <Option value='Air Conditioner'>Air Conditioner</Option>
                            <Option value='Television'>Television</Option>
                        </SelectAmenities>
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Price</LabelText>
                        <InputText name="price" value={roomUpdated.price} onChange={handlePriceChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Offer Price</LabelText>
                        <InputText name="offer_price" value={roomUpdated.offer_price} onChange={handleOfferPriceChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Booking Status</LabelText>
                        <Select name="booking_status" value={roomUpdated.booking_status} onChange={handleBookingStatusChange}>
                            <Option value={false}>Available</Option>
                            <Option value={true}>Booked</Option>
                        </Select>
                    </DivCtnEntry>

                    <DivButtonCreateUser>
                        <ButtonCreate type="submit" text='⮂ Update Room' fontsize='1.25em'></ButtonCreate>
                    </DivButtonCreateUser>
                </Form>
            </DivCtnForm>
        </roomCreateJS.SectionPageRoomUpdate>

    )
}