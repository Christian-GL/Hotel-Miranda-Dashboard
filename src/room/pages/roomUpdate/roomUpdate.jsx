

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams } from "react-router-dom"

import * as roomUpdateJS from "./roomUpdate.js"
import * as gb from '../../../common/styles/globalVars.js'
import roomTypeData from '../../data/roomTypeData.json'
import roomAmenitiesData from '../../data/roomAmenitiesData.json'
import {
    DivCtnForm, DivIcon, DivCtnIcons, IconBed, IconUpdate, TitleForm, Form, ImgRoom, DivCtnEntry,
    LabelText, LabelTextBookingStatus, InputText, InputTextPhoto, Select, Option, SelectAmenities, DivButtonCreateUser
} from "../../../common/styles/form.js"
import { ButtonCreate } from '../../../common/components/buttonCreate/buttonCreate.jsx'
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
        type: '',
        amenities: [],
        price: 0,
        discount: 0,
        booking_status: false
    })

    const dispatch = useDispatch()
    useEffect(() => {
        if (roomByIdLoading === "idle") { dispatch(RoomFetchByIDThunk(parseInt(id))) }
        else if (roomByIdLoading === "fulfilled" && Object.keys(roomById).length !== 0) {
            setRoomUpdated({
                id: roomById.id,
                photo: roomById.photo || '',
                type: roomById.type || '',
                amenities: roomById.amenities || [],
                price: roomById.price || 0,
                discount: roomById.discount || 0,
                booking_status: roomById.booking_status || false
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
                        <LabelText>Photo</LabelText>
                        <InputTextPhoto name="photo" type='file' onChange={handlePhotoChange} />
                        <ImgRoom src={roomUpdated.photo} />
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
                        <LabelText>Discount</LabelText>
                        <InputText name="discount" value={roomUpdated.discount} onChange={handleDiscountChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Booking Status</LabelText>
                        <LabelTextBookingStatus color={roomUpdated.booking_status ? gb.colorRed : gb.colorLightGreenButton}>
                            {roomUpdated.booking_status ? 'Booking' : 'Available'}
                        </LabelTextBookingStatus>
                    </DivCtnEntry>

                    <DivButtonCreateUser>
                        <ButtonCreate type="submit" text='⮂ Update Room' fontsize='1.25em'></ButtonCreate>
                    </DivButtonCreateUser>
                </Form>
            </DivCtnForm>
        </roomUpdateJS.SectionPageRoomUpdate>

    )
}