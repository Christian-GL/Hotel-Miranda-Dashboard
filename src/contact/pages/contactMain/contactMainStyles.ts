
import { styled } from 'styled-components'


export const SectionPageContact = styled.section`
    padding: 2em;
    height: 100%;
    overflow-y: auto;
    background-color: ${props => props.theme.backgroundPage};
`

export const SectionReviews = styled.section`
    padding: 1em 0;
`

export const DivCtnReviews = styled.div`
    display: flex;
`

export const DivCtnFuncionality = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 2em;
    min-width: 50rem;
`

export const DivCtnTableDisplayFilter = styled.div`
    display: flex;
    padding-bottom: 1em;
    width: 30%;
`

export const DivCtnSearch = styled.div`
    position: relative;
    padding: 1em;
    width: 40%;
`

export const DivCtnButton = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`