
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { ButtonCreate } from 'common/components/buttonCreate/buttonCreate'


const setupCreateButton = (props = {}, children = 'Example test') => {
    render(<ButtonCreate {...props}>{children}</ButtonCreate>)
    return {
        button: screen.getByRole('button', { name: children })
    }
}

describe('ButtonCreate', () => {

    test('renders with children text', () => {
        const { button } = setupCreateButton({}, 'Create Booking')

        expect(button).toBeInTheDocument()
    })

    test('calls onClick when clicked', async () => {
        const user = userEvent.setup()
        const handleClick = vi.fn()
        const { button } = setupCreateButton({ onClick: handleClick }, 'Click me')

        await user.click(button)

        expect(handleClick).toHaveBeenCalledTimes(1)
    })

    test('is disabled when isClickDisabled is true', async () => {
        const user = userEvent.setup()
        const handleClick = vi.fn()
        const { button } = setupCreateButton(
            { isClickDisabled: true, onClick: handleClick },
            'Disabled button'
        )

        expect(button).toBeDisabled()

        await user.click(button)

        expect(handleClick).not.toHaveBeenCalled()
    })

    test('applies dynamic fontSize style', () => {
        const { button } = setupCreateButton({ fontSize: '2em' }, 'Styled button')

        expect(button).toHaveStyle({ fontSize: '2em' })
    })

})