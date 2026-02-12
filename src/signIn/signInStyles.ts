
import { styled } from 'styled-components'

import { RiHotelFill } from "react-icons/ri"

import backgroundLogin from '../../src/assets/img/backgroundLogin.png'
import { white, graySmoothX3, red, blackSmooth } from '../common/styles/colors'
import * as globalConstStyles from '../common/styles/globalConstStyles'


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
    border: 2px solid ${red};
    color: ${red};
    background-color: ${white};
`

export const Form = styled.form`
    margin-top: 2rem;
    width: 25rem;
`

export const LabelText = styled.label`
    font-family: ${globalConstStyles.fontPoppins};
    font-size: 1.5em;
    font-weight: 700;
    color: ${white};
    text-shadow: 3px 3px #262626;
`

// !!! USAR THEME NO EL COLOR DIRECTO
export const InputText = styled.input`
    display: block;
    margin: 1rem 0;
    padding: 0.75em;
    text-align: center;
    width: 100%;
    font-family: ${globalConstStyles.fontPoppins};
    font-weight: 700;
    border: none;
    border-radius: 1rem;
    outline: none;
    color: ${blackSmooth};

    &::placeholder {
        color: ${graySmoothX3};
        opacity: 1;
    }
`

export const ButtonSignIn = styled.button`
    margin-top: 2rem;
    padding: 0.5em 2em;
    font-family: ${globalConstStyles.fontPoppins};
    font-size: 1.25em;
    font-weight: 400;
    border: none;
    border-radius: 1rem;
    cursor: pointer;
    transition: transform 0.25s ease;
    color: ${white};
    background-color: ${red};

    &:hover {
        transform: scale(1.15)
    }
`