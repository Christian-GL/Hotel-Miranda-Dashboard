
import { styled } from 'styled-components'
import { InputHTMLAttributes } from "react"

import { HiMiniMagnifyingGlass } from "react-icons/hi2"

import * as globalConstStyles from '../../styles/globalConstStyles.ts'


export const InputSearch = styled.input<InputHTMLAttributes<HTMLInputElement>>`
    padding: 1em 1em 1em 4em;
    text-align: center;
    width: 100%;
    font-family: ${globalConstStyles.fontPoppins};
    font-weight: 400;
    border: none;
    // border: 1px solid black;
    border-radius: 1.5rem;
    outline: none;
    color: ${props => props.theme.textSearchTerm};
`

export const IconMagnifyingGlass = styled(HiMiniMagnifyingGlass)`
    position: absolute;
    top: 50%;
    left: 3rem;
    transform: translate(-50%, -50%);
    width: 1.5rem;
    height: auto;
`