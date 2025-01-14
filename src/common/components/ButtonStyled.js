import styled from 'styled-components'

export const ButtonStyled = styled.button
    `
    background-color: ${props => props.type === "primary" ? "#BF4F74" : "white"};
    color: ${props => props.type === "primary" ? "white" : "black"};
    padding: 10px 20px;
    border-radius: 5px;
`