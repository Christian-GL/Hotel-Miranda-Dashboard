
import { styled } from 'styled-components'

import { RiCloseCircleLine } from "react-icons/ri";

import * as gb from '../../../common/styles/globalVars.ts'


export const DialogPopup = styled.dialog<{ isSlider?: boolean }>`
    position: ${({ isSlider }) => (isSlider ? 'absolute' : 'fixed')};
    display: block;
    z-index: 1;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    overflow: auto;
    padding: 2em;
    width: ${({ isSlider }) => (isSlider ? '75%' : '100%')};
    max-width: 40rem;
    height: ${({ isSlider }) => (isSlider ? '75%' : 'auto')};
    max-height: 30rem;
    border: none;
    border-radius: 1rem;
    box-shadow: ${props => props.theme.boxShadowCustom};
    background-color: ${props => props.theme.backgroundPopup};

    &:hover {
        box-shadow: ${props => props.theme.boxShadowCustomWithHover};
    }
`

export const TitleH2 = styled.h2`
    max-width: 95%;
    font-family: ${gb.fontPoppins};
    font-size: 1em;
    color: ${props => props.theme.textPopup};
`

export const PText = styled.p`
    margin-top: 1rem;
    font-family: ${gb.fontPoppins};
    font-size: 1em;
    color: ${props => props.theme.textPopup};
`

export const IconClose = styled(RiCloseCircleLine)`
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    width: 2rem;
    height: auto;
    border-radius: 50%;
    cursor: pointer;
    color: ${props => props.theme.iconPopup};
`