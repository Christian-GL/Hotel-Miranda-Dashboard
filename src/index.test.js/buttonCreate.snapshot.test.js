
import { ButtonCreate } from 'common/components/buttonCreate/buttonCreate'
import renderer from "react-test-renderer"


test("renders learn react link", () => {
  const button = renderer.create(<ButtonCreate />).toJSON()
  expect(button).toMatchInlineSnapshot(`
<button
  className="sc-KXCwU iyqVcG"
/>
`)
})