
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"

import * as roomCreateJS from "./roomCreate.js"
import roomTypeData from '../../data/roomTypeData.json'
import roomAmenitiesData from '../../data/roomAmenitiesData.json'
import { checkFirstIDAvailable } from '../../../common/utils/formUtils.js'
import {
    DivCtnForm, DivIcon, DivCtnIcons, IconBed, IconPlus, TitleForm, Form, ImgRoom, DivCtnEntry,
    LabelText, InputText, InputTextPhoto, Select, Option, SelectAmenities, DivButtonCreateUser
} from "../../../common/styles/form.js"
import { ButtonCreate } from '../../../common/components/buttonCreate/buttonCreate.jsx'
import { getRoomAllData, getRoomAllStatus, getRoomError } from "../../features/roomSlice.js"
import { RoomFetchAllThunk } from "../../features/thunks/roomFetchAllThunk.js"
import { RoomCreateThunk } from "../../features/thunks/roomCreateThunk.js"


export const RoomCreate = () => {

    const roomAll = useSelector(getRoomAllData) || []
    const roomAllLoading = useSelector(getRoomAllStatus)
    const [newRoom, setNewRoom] = useState({
        id: 0,
        photos: [],
        type: '',
        amenities: [],
        price: 0,
        discount: 0,
        booking_list: []
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
    const handlePhotoChange = (index, e) => {
        const { files } = e.target
        if (files[0]) {
            const photoUrl = URL.createObjectURL(files[0])
            setNewRoom(prevState => {
                const updatedPhotos = [...prevState.photos]
                updatedPhotos[index] = photoUrl
                return {
                    ...prevState,
                    photos: updatedPhotos
                }
            })
        }
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
    const handleDiscountChange = (e) => {
        const { name, value } = e.target
        setNewRoom({
            ...newRoom,
            [name]: parseFloat(value)
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
                        <LabelText>Photo 1</LabelText>
                        <InputTextPhoto name="photos" type='file' onChange={(e) => handlePhotoChange(0, e)} />
                        <ImgRoom src={newRoom.photos[0]} />
                    </DivCtnEntry>
                    <DivCtnEntry>
                        <LabelText>Photo 2</LabelText>
                        <InputTextPhoto name="photos" type='file' onChange={(e) => handlePhotoChange(1, e)} />
                        <ImgRoom src={newRoom.photos[1]} />
                    </DivCtnEntry>
                    <DivCtnEntry>
                        <LabelText>Photo 3</LabelText>
                        <InputTextPhoto name="photos" type='file' onChange={(e) => handlePhotoChange(2, e)} />
                        <ImgRoom src={newRoom.photos[2]} />
                    </DivCtnEntry>
                    <DivCtnEntry>
                        <LabelText>Photo 4</LabelText>
                        <InputTextPhoto name="photos" type='file' onChange={(e) => handlePhotoChange(3, e)} />
                        <ImgRoom src={newRoom.photos[3]} />
                    </DivCtnEntry>
                    <DivCtnEntry>
                        <LabelText>Photo 5</LabelText>
                        <InputTextPhoto name="photos" type='file' onChange={(e) => handlePhotoChange(4, e)} />
                        <ImgRoom src={newRoom.photos[4]} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Room Type</LabelText>
                        <Select name="type" onChange={handleTypeChange}>
                            <Option value="null" selected></Option>
                            {roomTypeData.type.map((type, index) => (
                                <Option key={index} value={type}>{type}</Option>
                            ))}
                        </Select>
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Amenities</LabelText>
                        <SelectAmenities name="amenities" onChange={handleAmenitiesChange} multiple={true}>
                            {roomAmenitiesData.amenities.map((amenity, index) => (
                                <Option key={index} value={amenity}>{amenity}</Option>
                            ))}
                        </SelectAmenities>
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Price</LabelText>
                        <InputText name="price" onChange={handlePriceChange} />
                    </DivCtnEntry>

                    <DivCtnEntry>
                        <LabelText>Discount</LabelText>
                        <InputText name="discount" onChange={handleDiscountChange} />
                    </DivCtnEntry>

                    <DivButtonCreateUser>
                        <ButtonCreate type="submit" children='+ Create Room' fontSize='1.25em'></ButtonCreate>
                    </DivButtonCreateUser>
                </Form>
            </DivCtnForm>
        </roomCreateJS.SectionPageRoomCreate>

    )
}