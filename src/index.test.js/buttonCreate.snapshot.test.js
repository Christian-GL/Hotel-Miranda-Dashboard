import React from 'react'
import renderer from "react-test-renderer"
import { ButtonCreate } from '../common/components/buttonCreate/buttonCreate'

test("renders learn react link", () => {
    const button = renderer.create(<ButtonCreate />).toJSON()
    expect(button).toMatchInlineSnapshot(`
<button
  className="sc-KXCwU iyqVcG"
/>
`)
  })