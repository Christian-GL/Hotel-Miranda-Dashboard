
import { styled } from 'styled-components'


export const CtnSwiperCustom = styled.div<{ margin?: string }>`
    position: relative;
    margin: ${props => props.margin || '0'};

    .swiper {
        margin: 0 5rem;
    }

    .swiper-button-disabled {
        opacity: 0.5;
        pointer-events: none;
    }
`

const ButtonSwiperCustom = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 45%;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(0,0,0,0.25);
    transition: 0.25s ease;
    color: ${props => props.theme.textHoverSidebar};
    background: ${props => props.theme.backgroundTable};
    

    &:hover {
        color: ${props => props.theme.iconSidebar};
        transform: scale(1.15);
    }
`
export const ButtonPrev = styled(ButtonSwiperCustom).attrs({
    className: 'swiper-button-prev-custom'
})`
  left: 1rem;
`
export const ButtonNext = styled(ButtonSwiperCustom).attrs({
    className: 'swiper-button-next-custom'
})`
  right: 1rem;
`