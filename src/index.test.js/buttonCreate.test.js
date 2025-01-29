
import React from 'react'
import { render, screen } from '@testing-library/react'
import { ButtonCreate } from '../common/components/buttonCreate/buttonCreate'
import '@testing-library/jest-dom';


describe('ButtonCreate', () => {


    it("renders buttonCreate component", async () => {

        render(<ButtonCreate children="testinButtonCreate" fontSize="2em" />)
        const buttonElement = screen.getByText('testinButtonCreate')
        expect(buttonElement).toHaveStyle('font-size: 2em')
    })

})