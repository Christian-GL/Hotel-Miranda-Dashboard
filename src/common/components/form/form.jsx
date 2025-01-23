
import { useState, useEffect } from "react"
import { useRef } from "react"
import { useSelector, useDispatch } from "react-redux"

import * as formJS from "./form.js"
import { ButtonCreate } from '../buttonCreate/buttonCreate.jsx'
import { getContactAllData, getContactAllStatus } from "../../../pages/contact/features/contactSlice.js"
import { ContactFetchAllThunk } from "../../../pages/contact/features/thunks/contactFetchAllThunk.js"
import { ContactCreateThunk } from "../../../pages/contact/features/thunks/contactCreateThunk.js"


export const checkFirstIDAvailable = (list) => {
    for (let i = 0; i < list.length - 1; i++) {
        const currentId = list[i].id
        const nextId = list[i + 1].id

        if (nextId - currentId > 1) {
            return currentId + 1
        }
    }

    return list[list.length - 1].id + 1
}

export const getActualDate = () => {
    let time = new Date()
    return time.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).replace(',', '')
}

export const getActualTime = () => {
    let time = new Date()
    return time.toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }).toUpperCase()
}

export const Form = (props) => {

    const handleSubmit = e => {
        e.preventDefault();

        switch (props.formType) {
            case 'user':
                alert('creado user')
                break
            case 'room':
                alert('creada room')
                break
            case 'contact':
                alert('creado contacto')
                break
            case 'booking':
                alert('creada booking')
                break
        }
    }

    const userCreateForm = () => {
        return [
            <formJS.DivIcon>
                <formJS.DivCtnIcons>
                    <formJS.IconUser />
                    <formJS.IconPlus />
                </formJS.DivCtnIcons>
            </formJS.DivIcon>,

            <formJS.Form onSubmit={handleSubmit}>
                <formJS.DivCtnEntry>
                    <formJS.LabelText>Photo</formJS.LabelText>
                    <formJS.InputText type='file' />
                </formJS.DivCtnEntry>

                <formJS.DivCtnEntry>
                    <formJS.LabelText>Full name</formJS.LabelText>
                    <formJS.InputText />
                </formJS.DivCtnEntry>

                <formJS.DivCtnEntry>
                    <formJS.LabelText>ID Employee</formJS.LabelText>
                    <formJS.InputText />
                </formJS.DivCtnEntry>

                <formJS.DivCtnEntry>
                    <formJS.LabelText>Email</formJS.LabelText>
                    <formJS.InputText />
                </formJS.DivCtnEntry>

                <formJS.DivCtnEntry>
                    <formJS.LabelText>Start Date</formJS.LabelText>
                    <formJS.InputDate type="date" />
                </formJS.DivCtnEntry>

                <formJS.DivCtnEntry>
                    <formJS.LabelText>Job Description</formJS.LabelText>
                    <formJS.TextAreaJobDescription type='text'></formJS.TextAreaJobDescription>
                </formJS.DivCtnEntry>

                <formJS.DivCtnEntry>
                    <formJS.LabelText>Contact</formJS.LabelText>
                    <formJS.InputText />
                </formJS.DivCtnEntry>

                <formJS.DivCtnEntry>
                    <formJS.LabelText>Status</formJS.LabelText>
                    <formJS.Select>
                        <formJS.Option>Active</formJS.Option>
                        <formJS.Option>Inactive</formJS.Option>
                    </formJS.Select>
                </formJS.DivCtnEntry>

                <formJS.DivButtonCreateUser>
                    <ButtonCreate type="submit" text='+ Create User' fontsize='1.25em'></ButtonCreate>
                </formJS.DivButtonCreateUser>
            </formJS.Form>
        ]
    }

    const roomCreateForm = () => {
        return [
            <formJS.DivIcon>
                <formJS.DivCtnIcons>
                    <formJS.IconBed />
                    <formJS.IconPlus />
                </formJS.DivCtnIcons>
            </formJS.DivIcon>,

            <formJS.Form onSubmit={handleSubmit}>
                <formJS.DivCtnEntry>
                    <formJS.LabelText>Photo</formJS.LabelText>
                    <formJS.InputText type='file' />
                </formJS.DivCtnEntry>

                <formJS.DivCtnEntry>
                    <formJS.LabelText>Room Number</formJS.LabelText>
                    <formJS.InputText />
                </formJS.DivCtnEntry>

                <formJS.DivCtnEntry>
                    <formJS.LabelText>Room ID</formJS.LabelText>
                    <formJS.InputText />
                </formJS.DivCtnEntry>

                <formJS.DivCtnEntry>
                    <formJS.LabelText>Room Type</formJS.LabelText>
                    <formJS.Select>
                        <formJS.Option>Suite</formJS.Option>
                        <formJS.Option>Single Bed</formJS.Option>
                        <formJS.Option>Double Bed</formJS.Option>
                        <formJS.Option>Double Superior</formJS.Option>
                    </formJS.Select>
                </formJS.DivCtnEntry>

                <formJS.DivCtnEntry>
                    <formJS.LabelText>Amenities</formJS.LabelText>
                    <formJS.SelectAmenities multiple={true}>
                        <formJS.Option>3 Bed Space</formJS.Option>
                        <formJS.Option>24 Hours Guard</formJS.Option>
                        <formJS.Option>Free WiFi</formJS.Option>
                        <formJS.Option>2 Bathroom</formJS.Option>
                        <formJS.Option>Air conditioner</formJS.Option>
                        <formJS.Option>Television</formJS.Option>
                    </formJS.SelectAmenities>
                </formJS.DivCtnEntry>

                <formJS.DivCtnEntry>
                    <formJS.LabelText>Price</formJS.LabelText>
                    <formJS.InputText />
                </formJS.DivCtnEntry>

                <formJS.DivCtnEntry>
                    <formJS.LabelText>Offer Price</formJS.LabelText>
                    <formJS.InputText />
                </formJS.DivCtnEntry>

                <formJS.DivCtnEntry>
                    <formJS.LabelText>Status</formJS.LabelText>
                    <formJS.Select>
                        <formJS.Option>Available</formJS.Option>
                        <formJS.Option>Booked</formJS.Option>
                    </formJS.Select>
                </formJS.DivCtnEntry>

                <formJS.DivButtonCreateUser>
                    <ButtonCreate type="submit" text='+ Create Room' fontsize='1.25em'></ButtonCreate>
                </formJS.DivButtonCreateUser>
            </formJS.Form>
        ]
    }

    const contactCreateForm = () => {
        return [
            <formJS.DivIcon>
                <formJS.DivCtnIcons>
                    <formJS.IconContact />
                    <formJS.IconPlus />
                </formJS.DivCtnIcons>
            </formJS.DivIcon>,

            <formJS.Form onSubmit={handleSubmit}>
                <formJS.DivCtnEntry>
                    <formJS.LabelText>Full Name</formJS.LabelText>
                    <formJS.InputText ref={fullNameRef} />
                </formJS.DivCtnEntry>

                <formJS.DivCtnEntry>
                    <formJS.LabelText>Email</formJS.LabelText>
                    <formJS.InputText ref={emailRef} />
                </formJS.DivCtnEntry>

                <formJS.DivCtnEntry>
                    <formJS.LabelText>Phone Number</formJS.LabelText>
                    <formJS.InputText ref={phoneNumberRef} />
                </formJS.DivCtnEntry>

                <formJS.DivCtnEntry>
                    <formJS.LabelText>Comment</formJS.LabelText>
                    <formJS.TextAreaJobDescription type='text' ref={commentRef}></formJS.TextAreaJobDescription>
                </formJS.DivCtnEntry>

                <formJS.DivButtonCreateUser>
                    <ButtonCreate type="submit" text='+ Create Contact' fontsize='1.25em'></ButtonCreate>
                </formJS.DivButtonCreateUser>
            </formJS.Form>
        ]
    }

    const bookingCreateForm = () => {
        return [
            <formJS.DivIcon>
                <formJS.DivCtnIcons>
                    <formJS.IconCalendar />
                    <formJS.IconPlus />
                </formJS.DivCtnIcons>
            </formJS.DivIcon>,

            <formJS.Form onSubmit={handleSubmit}>
                <formJS.DivCtnEntry>
                    <formJS.LabelText>Booking ID</formJS.LabelText>
                    <formJS.InputText />
                </formJS.DivCtnEntry>

                <formJS.DivCtnEntry>
                    <formJS.LabelText>Guest Full Name</formJS.LabelText>
                    <formJS.InputText />
                </formJS.DivCtnEntry>

                <formJS.DivCtnEntry>
                    <formJS.LabelText>Check In</formJS.LabelText>
                    <formJS.InputDate type="date" />
                </formJS.DivCtnEntry>

                <formJS.DivCtnEntry>
                    <formJS.LabelText>Check Out</formJS.LabelText>
                    <formJS.InputDate type="date" />
                </formJS.DivCtnEntry>

                <formJS.DivCtnEntry>
                    <formJS.LabelText>Room Type</formJS.LabelText>
                    <formJS.Select>
                        <formJS.Option>Suite</formJS.Option>
                        <formJS.Option>Single Bed</formJS.Option>
                        <formJS.Option>Double Bed</formJS.Option>
                        <formJS.Option>Double Superior</formJS.Option>
                    </formJS.Select>
                </formJS.DivCtnEntry>

                <formJS.DivCtnEntry>
                    <formJS.LabelText>Status</formJS.LabelText>
                    <formJS.Select>
                        <formJS.Option>Check In</formJS.Option>
                        <formJS.Option>Check Out</formJS.Option>
                        <formJS.Option>In Progress</formJS.Option>
                    </formJS.Select>
                </formJS.DivCtnEntry>

                <formJS.DivButtonCreateUser>
                    <ButtonCreate type="submit" text='+ Create Booking' fontsize='1.25em'></ButtonCreate>
                </formJS.DivButtonCreateUser>
            </formJS.Form>
        ]
    }

    const selectFormType = (formType) => {
        switch (formType) {
            case 'user':
                return userCreateForm()
            case 'room':
                return roomCreateForm()
            case 'contact':
                return contactCreateForm()
            case 'booking':
                return bookingCreateForm()
            default:
                alert('Tipo de form introducido no valido')
        }
    }

    return (

        <formJS.DivCtnForm>
            {selectFormType(props.formType)}
        </formJS.DivCtnForm>

    );
}