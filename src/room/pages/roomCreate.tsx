
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { ToastContainer } from 'react-toastify'
import { useTheme } from "styled-components"

import roomDefaultImg from 'assets/img/roomDefault.jpg'
import { ButtonCreate } from 'common/components/buttonCreate/buttonCreate'
import { ToastifyError } from "common/components/toastify/errorPopup/toastifyError"
import { ToastifySuccess } from "common/components/toastify/successPopup/toastifySuccess"
import { ApiStatus } from "common/enums/ApiStatus"
import { OptionYesNo } from "common/enums/optionYesNo"
import { ApiErrorResponseInterface } from "common/interfaces/apiResponses/apiErrorResponseInterface"
import { AppDispatch } from "common/redux/store"
import { ROUTES } from "common/router/routes"
import { reactSelectStyles } from "common/styles/externalLibrariesStyles"
import * as styles from "common/styles/form"
import { ReactSelectOption } from "common/types/reactMultiSelectOption"
import { createFormHandlers } from 'common/utils/formHandlers'
import { RoomAmenities } from "room/enums/roomAmenities"
import { RoomType } from "room/enums/roomType"
import { getRoomAllData, getRoomAllStatus } from "room/features/roomSlice"
import { RoomCreateThunk } from "room/features/thunks/roomCreateThunk"
import { RoomFetchAllThunk } from "room/features/thunks/roomFetchAllThunk"
import { RoomInterface } from "room/interfaces/roomInterface"
import { RoomValidator } from "room/validators/roomValidator"


export const RoomCreate = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const theme = useTheme()
    const roomAll = useSelector(getRoomAllData)
    const roomAllLoading = useSelector(getRoomAllStatus)
    const [roomNew, setRoomNew] = useState<RoomInterface>({
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
    } = createFormHandlers(setRoomNew)
    const amenityReactOptions: ReactSelectOption<RoomAmenities>[] = Object.values(RoomAmenities).map(amenity => ({
        value: amenity,
        label: amenity
    }))
    const roomTypeReactOptions: ReactSelectOption<RoomType>[] = Object.values(RoomType).map(type => ({
        value: type,
        label: type
    }))
    const OptionYesNoReactOptions: ReactSelectOption<OptionYesNo>[] = Object.values(OptionYesNo).map(option => ({
        value: option,
        label: option.charAt(0).toUpperCase() + option.slice(1)
    }))

    useEffect(() => {
        if (roomAllLoading === ApiStatus.idle) { dispatch(RoomFetchAllThunk()) }
    }, [roomAllLoading, roomAll])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const roomValidator = new RoomValidator()
        const allRoomNumbersNotArchived = roomAll.filter(room => room.isArchived !== OptionYesNo.yes).map(room => room.number);
        const validationErrors = roomValidator.validateNewRoom(roomNew, allRoomNumbersNotArchived)
        if (validationErrors.length > 0) {
            validationErrors.forEach(error => ToastifyError(error))
            return
        }

        try {
            await dispatch(RoomCreateThunk(roomNew))
                .unwrap()
                .then(() => ToastifySuccess('Room created', () => navigate(ROUTES.rooms.root)))
        }
        catch (error) {
            const apiError = error as ApiErrorResponseInterface
            apiError.message
                ? ToastifyError('API Error: ' + apiError.message)
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
                        <styles.CtnEntryHorizontal>
                            <styles.CtnEntryVertical removePaddingSeparator={true}>
                                <styles.Text>Number</styles.Text>
                                <styles.InputText name="number" onChange={handleStringChange} />
                            </styles.CtnEntryVertical>
                            <styles.CtnEntryVertical removePaddingSeparator={true}>
                                <styles.Text>Price ($)</styles.Text>
                                <styles.InputText name="price" onChange={handleNumberFloatChange} />
                            </styles.CtnEntryVertical>
                            <styles.CtnEntryVertical removePaddingSeparator={true}>
                                <styles.Text>Discount (%)</styles.Text>
                                <styles.InputText name="discount" onChange={handleNumberFloatChange} />
                            </styles.CtnEntryVertical>
                        </styles.CtnEntryHorizontal>
                    </styles.CtnEntryVertical>

                    <styles.CtnEntryVertical>
                        <styles.CtnEntryHorizontal>
                            <styles.CtnEntryVertical removePaddingSeparator={true}>
                                <styles.Text>Type</styles.Text>
                                <styles.SelectReact
                                    name="type"
                                    menuPlacement="bottom"
                                    menuPosition="fixed"
                                    placeholder="Select type"
                                    isMulti={false}
                                    styles={reactSelectStyles(theme)}
                                    closeMenuOnSelect={true}
                                    options={roomTypeReactOptions}
                                    value={roomTypeReactOptions.find(option => option.value === roomNew.type)}
                                    onChange={handleReactSingleSelectChange("type")}
                                />
                            </styles.CtnEntryVertical>
                            <styles.CtnEntryVertical removePaddingSeparator={true}>
                                <styles.Text>Is active</styles.Text>
                                <styles.SelectReact
                                    name="isActive"
                                    menuPlacement="bottom"
                                    menuPosition="fixed"
                                    placeholder="Select if the room is active"
                                    isMulti={false}
                                    styles={reactSelectStyles(theme)}
                                    closeMenuOnSelect={true}
                                    options={OptionYesNoReactOptions}
                                    value={OptionYesNoReactOptions.filter(option => roomNew.isActive.includes(option.value))}
                                    onChange={handleReactSingleSelectChange("isActive")}
                                />
                            </styles.CtnEntryVertical>
                        </styles.CtnEntryHorizontal>
                    </styles.CtnEntryVertical>

                    <styles.CtnEntryVertical>
                        <styles.Text>Amenities</styles.Text>
                        <styles.SelectReact
                            name="amenities"
                            menuPlacement="bottom"
                            menuPosition="fixed"
                            placeholder="Select amenities"
                            isMulti={true}
                            styles={reactSelectStyles(theme)}
                            closeMenuOnSelect={false}
                            options={amenityReactOptions}
                            value={amenityReactOptions.filter(option => roomNew.amenities.includes(option.value))}
                            onChange={handleReactMultiSelectChange("amenities")}
                        />
                    </styles.CtnEntryVertical>

                    <styles.CtnEntryVertical>
                        <styles.Text>Photo 1 (Main)</styles.Text>
                        <styles.InputTextPhoto name="photos" type="file" onChange={handleArrayPhotosChange(0, "photos")} />
                        <styles.ImgRoom
                            src={roomNew.photos?.[0] || roomDefaultImg}
                            onError={(e) => { e.currentTarget.src = roomDefaultImg }}
                        />
                    </styles.CtnEntryVertical>

                    <styles.CtnEntryVertical>
                        <styles.CtnEntryHorizontal>
                            <styles.CtnEntryVertical removePaddingSeparator={true}>
                                <styles.Text>Photo 2</styles.Text>
                                <styles.InputTextPhoto name="photos" type="file" onChange={handleArrayPhotosChange(1, "photos")} />
                                <styles.ImgRoom
                                    src={roomNew.photos?.[1] || roomDefaultImg}
                                    onError={(e) => { e.currentTarget.src = roomDefaultImg }}
                                />
                            </styles.CtnEntryVertical>
                            <styles.CtnEntryVertical removePaddingSeparator={true}>
                                <styles.Text>Photo 3</styles.Text>
                                <styles.InputTextPhoto name="photos" type="file" onChange={handleArrayPhotosChange(2, "photos")} />
                                <styles.ImgRoom
                                    src={roomNew.photos?.[2] || roomDefaultImg}
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
                                    src={roomNew.photos?.[3] || roomDefaultImg}
                                    onError={(e) => { e.currentTarget.src = roomDefaultImg }}
                                />
                            </styles.CtnEntryVertical>
                            <styles.CtnEntryVertical removePaddingSeparator={true}>
                                <styles.Text>Photo 5</styles.Text>
                                <styles.InputTextPhoto name="photos" type="file" onChange={handleArrayPhotosChange(4, "photos")} />
                                <styles.ImgRoom
                                    src={roomNew.photos?.[4] || roomDefaultImg}
                                    onError={(e) => { e.currentTarget.src = roomDefaultImg }}
                                />
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