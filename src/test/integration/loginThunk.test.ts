
import { configureStore } from '@reduxjs/toolkit'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

import { LoginThunk } from 'signIn/features/loginThunk'
import { LoginRequestInterface } from 'signIn/interfaces/loginRequestInterface'
import { Role } from 'user/enums/role'


const server = setupServer()
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('LoginThunk (integration with MSW)', () => {

    const setupTestStore = () =>
        configureStore({
            reducer: (state = {}) => state
        })
    const dispatchLogin = async (payload: LoginRequestInterface) => {
        const store = setupTestStore()
        return store.dispatch(LoginThunk(payload))
    }

    test('SUCCEED when user and password exist (200)', async () => {
        server.use(
            rest.post(/\/login$/, async (req, res, ctx) => {
                const body = (await req.json()) as LoginRequestInterface
                expect(body).toMatchObject({
                    email: expect.any(String),
                    password: expect.any(String)
                })

                return res(
                    ctx.status(200),
                    ctx.json({
                        token: 'tok-123',
                        loggedUserID: 'u-1',
                        role: Role.admin
                    })
                )
            })
        )

        const result = await dispatchLogin({
            email: 'exist@example.com',
            password: 'correct'
        })

        expect(LoginThunk.fulfilled.match(result)).toBe(true)
        expect(result.payload).toEqual({
            token: 'tok-123',
            loggedUserID: 'u-1',
            role: 'admin'
        })
    })

    test('FAIL when user exists but password is wrong (401)', async () => {
        server.use(
            rest.post(/\/login$/, async (req, res, ctx) => {
                return res(
                    ctx.status(401),
                    ctx.json({ message: 'Invalid credentials' })
                )
            })
        )

        const result = await dispatchLogin({
            email: 'exist@example.com',
            password: 'wrongpass'
        })

        expect(LoginThunk.rejected.match(result)).toBe(true)

        expect(result.payload).toEqual({
            status: 401,
            message: 'Invalid credentials'
        })
    })

    test('FAIL when user does not exist (404)', async () => {
        server.use(
            rest.post(/\/login$/, async (req, res, ctx) => {
                return res(
                    ctx.status(404),
                    ctx.json({ message: 'User not found' })
                )
            })
        )

        const result = await dispatchLogin({
            email: 'exist@example.com',
            password: 'whatever'
        })

        expect(LoginThunk.rejected.match(result)).toBe(true)

        expect(result.payload).toEqual({
            status: 404,
            message: 'User not found'
        })
    })

    test('FAIL when neither user nor password exist (401 or 404) - treat as invalid credentials', async () => {
        server.use(
            rest.post(/\/login$/, async (req, res, ctx) => {
                return res(
                    ctx.status(401),
                    ctx.json({ message: 'Invalid credentials' })
                )
            })
        )

        const result = await dispatchLogin({
            email: 'exist@example.com',
            password: 'badpass'
        })

        expect(LoginThunk.rejected.match(result)).toBe(true)
        expect(result.payload).toEqual({
            status: 401,
            message: 'Invalid credentials'
        })
    })

})