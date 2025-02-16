
import { styled } from 'styled-components'

import { RiHotelFill } from "react-icons/ri"

import backgroundLogin from '../../../assets/img/backgroundLogin.png'
import * as gb from '../../styles/globalVars.ts'


export const SectionPageSignIn = styled.section`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;

    width: 100%;
    height: 100vh;
    background-image: url(${backgroundLogin});
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
`

export const IconHotel = styled(RiHotelFill)`
    padding: 0.75em;
    width: 6rem;
    height: auto;
    border-radius: 50%;
    border: 2px solid #E23428;
    color: #E23428;
    background-color: #FFFFFF;
`

export const Form = styled.form`
    margin-top: 2rem;
    width: 25rem;
`

export const LabelText = styled.label`
    font-family: ${gb.fontPoppins};
    font-size: 1.5em;
    font-weight: 700;
    color: #FFFFFF;
    text-shadow: 3px 3px #262626;
`

export const InputText = styled.input`
    display: block;
    margin: 1rem 0;
    padding: 0.75em;
    text-align: center;
    width: 100%;
    font-family: ${gb.fontPoppins};
    font-weight: 700;
    border: none;
    border-radius: 1rem;
    outline: none;
    color: #262626;

    &::placeholder {
        color: #D3D3D3;
        opacity: 1;
    }
`

export const ButtonSignIn = styled.button`
    margin-top: 2rem;
    padding: 0.5em 2em;
    font-family: ${gb.fontPoppins};
    font-size: 1.25em;
    font-weight: 400;
    border: none;
    border-radius: 1rem;
    cursor: pointer;
    transition: transform 0.25s ease;
    color: #FFFFFF;
    background-color: #E23428;

    &:hover {
        transform: scale(1.1)
    }
`