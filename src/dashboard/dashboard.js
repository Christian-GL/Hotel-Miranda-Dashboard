
import { styled } from 'styled-components'

import { MdOutlineBedroomParent } from "react-icons/md";

import * as gb from '../common/styles/globalVars.js'


export const SectionDashboard = styled.section`
    // display: grid;
    background-color: lightblue;
`

export const SectionStats = styled.section`
    display: flex;
    flex: 1 1 0;
    padding: 2em;
`

export const ArticleStat = styled.article`
    padding: 1em;
`

export const IconBooking = styled(MdOutlineBedroomParent)`
    width: 1.5rem;
    height: auto;
    vertical-align: middle;
    cursor: pointer;
`