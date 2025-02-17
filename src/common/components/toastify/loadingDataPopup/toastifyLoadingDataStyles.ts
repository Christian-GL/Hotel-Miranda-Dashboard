
import { styled } from 'styled-components'
import { createGlobalStyle } from 'styled-components'
import { ImSpinner9 } from "react-icons/im"
import * as globalConstStyles from '../../../styles/globalConstStyles.ts'


export const GlobalToastStyles = createGlobalStyle`
    .Toastify__toast-container {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
`

export const DivMessage = styled.div`
    width: 100%;
    height: auto;
    text-align: center;
`

export const Spinner = styled(ImSpinner9)`
    display: inline-block;
    vertical-align: middle;
    margin-right: 1rem;
    width: 1.25rem;
    height: auto;

    animation: rotate 1.5s linear infinite;
    @keyframes rotate {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
`

export const PMessage = styled.p`
    display: inline-block;
    vertical-align: middle;
    font-family: ${globalConstStyles.fontPoppins};
    font-weight: 400;
`