
import { styled } from 'styled-components'

import { RiCloseCircleLine } from "react-icons/ri";

import * as globalConstStyles from '../../../common/styles/globalConstStyles'


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
    font-family: ${globalConstStyles.fontPoppins};
    font-size: 1em;
    color: ${props => props.theme.textPopup};
`

export const Text = styled.p`
    margin-top: 1rem;
    font-family: ${globalConstStyles.fontPoppins};
    font-size: 1em;
    color: ${props => props.theme.textPopup};
`

export const CtnButtonChoice = styled.div`
    margin-top: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5rem;
`

export const ButtonChoice = styled.button<{ isYes: boolean }>`
    padding: 1em 4em;
    font-family: ${globalConstStyles.fontPoppins};
    font-size: 1em;
    font-weight: 700;
    border: none;
    border-radius: 1rem;
    cursor: pointer;
    color: ${props => props.theme.buttonPopup};
    background-color: ${({ isYes, theme }) =>
        isYes
            ? theme.buttonYesBackgroundPopup
            : theme.buttonNoBackgroundPopup};
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