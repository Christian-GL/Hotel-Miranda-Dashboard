
import { styled } from 'styled-components'


export const SectionPage = styled.section`
    padding: 2em;
    height: 100%;
    overflow-y: auto;
    background-color: ${props => props.theme.backgroundPage};
`

export const CtnFuncionality = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0 2em 2em;
    min-width: 50rem;
`

export const CtnAllDisplayFilter = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 40%;
`

export const CtnTableDisplayFilter = styled.div`
    display: flex;
    margin-bottom: 1em;
`

export const CtnSearch = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    padding: 1em;
    width: 40%;
`

export const CtnButton = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`