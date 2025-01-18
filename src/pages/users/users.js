
import { styled } from 'styled-components'

import { HiMiniMagnifyingGlass } from "react-icons/hi2";

import * as gb from '../../common/styles/globalVars.js'


export const SectionPageUsers = styled.section`
    padding: 2em;
    height: 100%;
    overflow-y: auto;
    border: 5px solid blue;
    background-color: ${gb.colorGrayBackgroundPage};
`

export const DivCtnFuncionality = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0 1em 1em;
    min-width: 50rem;
`

export const DivCtnTableDisplayFilter = styled.div`
    display: flex;
    padding-bottom: 1em;
    width: 40%;
`

export const DivCtnSearch = styled.div`
    position: relative;
    padding: 1em;
    width: 40%;
`

export const InputSearchEmployee = styled.input`
    padding: 1em 1em 1em 4em;
    text-align: center;
    width: 100%;
    font-family: ${gb.fontPoppins};
    font-weight: 400;
    border: none;
    // border: 1px solid black;
    border-radius: 1.5rem;
    outline: none;
    color: ${gb.colorBlack26};
`

export const IconMagnifyingGlass = styled(HiMiniMagnifyingGlass)`
    position: absolute;
    top: 50%;
    left: 3rem;
    transform: translate(-50%, -50%);
    width: 1.5rem;
    height: auto;
`

export const DivCtnButton = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`