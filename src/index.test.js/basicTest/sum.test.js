
import '@testing-library/jest-dom'
import { sum } from './sum'


describe('sum util', () => {
    test('suma 2 + 3 = 5', () => {
        expect(sum(2, 3)).toBe(5)
    })

    test('suma con negativos', () => {
        expect(sum(-1, 4)).toBe(3)
    })
})