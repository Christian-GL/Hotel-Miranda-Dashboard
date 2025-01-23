
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"

import * as roomCreateJS from "./roomCreate.js"
import { checkFirstIDAvailable } from '../../../../common/components/form/form.jsx'
import {
    DivCtnForm, DivIcon, DivCtnIcons, IconBed, IconPlus, TitleForm, Form, ImgRoom, DivCtnEntry,
    LabelText, InputText, InputTextPhoto, Select, Option, SelectAmenities, DivButtonCreateUser
} from '../../../../common/components/form/form.js'
import { ButtonCreate } from '../../../../common/components/buttonCreate/buttonCreate.jsx'
import { getRoomAllData, getRoomAllStatus, getRoomError } from "../../features/roomSlice.js"
import { RoomFetchAllThunk } from "../../features/thunks/roomFetchAllThunk.js"
import { RoomCreateThunk } from "../../features/thunks/roomCreateThunk.js"


export const RoomCreate = () => {

    const roomAll = useSelector(getRoomAllData) || []
    const roomAllLoading = useSelector(getRoomAllStatus)
    const [newRoom, setNewRoom] = useState({
        id: 0,
        photo: '',
        number: '',
        type: '',
        amenities: [],
        price: 0,
        offer_price: 0,
        booking_status: false
    })
    const [nextIdAvailable, setNextIdAvailable] = useState(null)

    const dispatch = useDispatch()
    useEffect(() => {
        if (roomAllLoading === "idle") { dispatch(RoomFetchAllThunk()) }
        else if (roomAllLoading === "fulfilled") {
            if (roomAll.length > 0) {
                const id = checkFirstIDAvailable(roomAll)
                setNextIdAvailable(id)
            }
            else {
                setNextIdAvailable(1)
            }
        }
        else if (roomAllLoading === "rejected") { alert("Error en la api") }
    }, [roomAllLoading, roomAll])


    // QUE URL DE FOTO DEBE GUARDAR EN REDUX ???
    const handlePhotoChange = (e) => {
        const { name, files } = e.target
        if (files[0]) {
            const photoUrl = URL.createObjectURL(files[0])
            setNewRoom({
                ...newRoom,
                [name]: photoUrl
            })
        }
    }
    const handleNumberChange = (e) => {
        const { name, value } = e.target
        setNewRoom({
            ...newRoom,
            [name]: parseInt(value)
        })
    }
    const handleTypeChange = (e) => {
        const { name, value } = e.target
        setNewRoom({
            ...newRoom,
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
        setNewRoom({
            ...newRoom,
            [name]: selectedAmenities
        })
    }
    const handlePriceChange = (e) => {
        const { name, value } = e.target
        setNewRoom({
            ...newRoom,
            [name]: parseFloat(value)
        })
    }
    const handleOfferPriceChange = (e) => {
        const { name, value } = e.target
        setNewRoom({
            ...newRoom,
            [name]: parseFloat(value)
        })
    }
    const handleBookingStatusChange = (e) => {
        const { name, value } = e.target
        setNewRoom({
            ...newRoom,
            [name]: value === 'false' ? false : true
        })
    }
    const handleSubmit = e => {
        e.preventDefault()
        const newRoomToDispatch = {
            ...newRoom,
            id: nextIdAvailable
        }
        dispatch(RoomCreateThunk(newRoomToDispatch))
            .then(() => {
                alert(`Room #${newRoomToDispatch.id} created`)
            })
            .catch((error) => {
                alert('Error creating the room: ', error)
            })
    }

    return (

        <roomCreateJS.SectionPageRoomCreate>
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
                        <LabelText>Photo</LabelText>
                        <InputTextPhoto name="photo" type='file' onChange={handlePhotoChange} />
                        <ImgRoom src={newRoom.photo} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Room Number</LabelText>
                        <InputText name="number" onChange={handleNumberChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Room Type</LabelText>
                        <Select name="type" onChange={handleTypeChange} >
                            <Option value='suite'>Suite</Option>
                            <Option value='single_bed'>Single Bed</Option>
                            <Option value='double_bed'>Double Bed</Option>
                            <Option value='double_superior'>Double Superior</Option>
                        </Select>
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Amenities</LabelText>
                        <SelectAmenities name="amenities" onChange={handleAmenitiesChange} multiple={true}>
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
                        <InputText name="price" onChange={handlePriceChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Offer Price</LabelText>
                        <InputText name="offer_price" onChange={handleOfferPriceChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Booking Status</LabelText>
                        <Select name="booking_status" onChange={handleBookingStatusChange}>
                            <Option value={false}>Available</Option>
                            <Option value={true}>Booked</Option>
                        </Select>
                    </DivCtnEntry>

                    <DivButtonCreateUser>
                        <ButtonCreate type="submit" text='+ Create Room' fontsize='1.25em'></ButtonCreate>
                    </DivButtonCreateUser>
                </Form>
            </DivCtnForm>
        </roomCreateJS.SectionPageRoomCreate>

    )
}