
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ButtonCreate } from 'common/components/buttonCreate/buttonCreate'


// describe('ButtonCreate', () => {

//     it("renders buttonCreate component", async () => {
//         render(<ButtonCreate children="testinButtonCreate" fontSize="2em" />)
//         const buttonElement = screen.getByText('testinButtonCreate')
//         expect(buttonElement).toHaveStyle('font-size: 2em')
//     })

// })

describe('ButtonCreate component (userEvent)', () => {

    it('renders children text', () => {
        render(<ButtonCreate fontSize="1rem">Create Booking</ButtonCreate>)
        expect(screen.getByRole('button', { name: /Create Booking/i })).toBeInTheDocument()
    })

    it('calls onClick when clicked', async () => {
        const user = userEvent.setup()
        const handleClick = jest.fn()
        render(<ButtonCreate onClick={handleClick}>Click me</ButtonCreate>)
        await user.click(screen.getByRole('button', { name: /Click me/i }))
        expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('does not call onClick when disabled', async () => {
        const user = userEvent.setup()
        const handleClick = jest.fn()
        render(
            <ButtonCreate isClickDisabled onClick={handleClick}>
                Disabled
            </ButtonCreate>
        )
        await user.click(screen.getByRole('button', { name: /Disabled/i }))
        expect(handleClick).not.toHaveBeenCalled()
    })

    it('applies dynamic fontSize style', () => {
        render(<ButtonCreate fontSize="2em">Styled button</ButtonCreate>)
        expect(screen.getByRole('button', { name: /Styled button/i })).toHaveStyle('font-size: 2em')
    })

})