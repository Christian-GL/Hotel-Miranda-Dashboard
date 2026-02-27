
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'

import { BookingCreate } from 'booking/pages/bookingCreate'
import { BookingDetails } from 'booking/pages/bookingDetails/bookingDetails'
import { BookingMain } from 'booking/pages/bookingMain'
import { BookingUpdate } from 'booking/pages/bookingUpdate'
import { ClientCreate } from 'client/pages/clientCreate'
import { ClientMain } from 'client/pages/clientMain'
import { ClientUpdate } from 'client/pages/clientUpdate'
import { Layout } from 'common/components/layout/layout'
import { DarkModeProvider } from 'common/context/darkModeContext'
import { store } from 'common/redux/store'
import { PATHS } from 'common/router/paths'
import { ROUTES } from 'common/router/routes'
import { DashboardMain } from 'dashboard/dashboardMain'
import { RoomCreate } from 'room/pages/roomCreate'
import { RoomMain } from 'room/pages/roomMain'
import { RoomUpdate } from 'room/pages/roomUpdate'
import { LoginProvider } from 'signIn/features/loginProvider'
import { SignIn } from 'signIn/signIn'
import { UserCreate } from 'user/pages/userCreate'
import { UserMain } from 'user/pages/userMain'
import { UserUpdate } from 'user/pages/userUpdate'


createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <BrowserRouter>
            <LoginProvider>
                <DarkModeProvider>

                    <Routes>
                        <Route path={PATHS.root} element={<SignIn />} />
                        <Route element={<Layout />}>

                            <Route path={PATHS.dashboard} element={<DashboardMain />} />

                            <Route path={PATHS.bookings.root} element={<Outlet />}>
                                <Route index element={<BookingMain />} />
                                <Route path={PATHS.bookings.create} element={<BookingCreate />} />
                                <Route path={PATHS.bookings.update} element={<BookingUpdate />} />
                                <Route path={PATHS.bookings.details} element={<BookingDetails />} />
                            </Route>

                            <Route path={PATHS.rooms.root} element={<Outlet />}>
                                <Route index element={<RoomMain />} />
                                <Route path={PATHS.rooms.create} element={<RoomCreate />} />
                                <Route path={PATHS.rooms.update} element={<RoomUpdate />} />
                            </Route>

                            <Route path={PATHS.clients.root} element={<Outlet />}>
                                <Route index element={<ClientMain />} />
                                <Route path={PATHS.clients.create} element={<ClientCreate />} />
                                <Route path={PATHS.clients.update} element={<ClientUpdate />} />
                            </Route>

                            <Route path={PATHS.users.root} element={<Outlet />}>
                                <Route index element={<UserMain />} />
                                <Route path={PATHS.users.create} element={<UserCreate />} />
                                <Route path={PATHS.users.update} element={<UserUpdate />} />
                            </Route>

                        </Route>
                        <Route path="*" element={<Navigate to={ROUTES.root} />} />
                    </Routes>

                </DarkModeProvider>
            </LoginProvider>
        </BrowserRouter >
    </Provider>
)