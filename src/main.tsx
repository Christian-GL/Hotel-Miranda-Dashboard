
import { Provider } from 'react-redux'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { createRoot } from 'react-dom/client'

import { LoginProvider } from './signIn/features/loginProvider'
import { DarkModeProvider } from './common/context/darkModeContext'
import { store } from './common/redux/store'
import { Outlet } from 'react-router-dom'
import { SignIn } from './signIn/signIn'
import { Layout } from './common/components/layout/layout'
import { DashboardMain } from './dashboard/dashboardMain'
import { BookingMain } from './booking/pages/bookingMain/bookingMain'
import { BookingCreate } from './booking/pages/bookingCreate/bookingCreate'
import { BookingUpdate } from './booking/pages/bookingUpdate/bookingUpdate'
import { BookingDetails } from './booking/pages/bookingDetails/bookingDetails'
import { RoomMain } from './room/pages/roomMain/roomMain'
import { RoomCreate } from './room/pages/roomCreate/roomCreate'
import { RoomUpdate } from './room/pages/roomUpdate/roomUpdate'
import { ClientMain } from './client/pages/clientMain/clientMain'
import { ClientCreate } from './client/pages/clientCreate/clientCreate'
import { ClientUpdate } from './client/pages/clientMain/clientUpdate'
import { UserMain } from './user/pages/userMain/userMain'
import { UserCreate } from './user/pages/userCreate/userCreate'
import { UserUpdate } from './user/pages/userUpdate/userUpdate'


createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <BrowserRouter>
            <LoginProvider>
                <DarkModeProvider>
                    <Routes>
                        <Route path='' element={<SignIn />} />
                        <Route element={<Layout />}>
                            <Route path="/dashboard" element={<DashboardMain />} />
                            <Route path="/bookings" element={<Outlet />}>
                                <Route path="" element={<BookingMain />} />
                                <Route path="booking-create" element={<BookingCreate />} />
                                <Route path="booking-update/:id" element={<BookingUpdate />} />
                                <Route path="booking-details/:id" element={<BookingDetails />} />
                            </Route>
                            <Route path="/rooms" element={<Outlet />}>
                                <Route path="" element={<RoomMain />} />
                                <Route path="room-create" element={<RoomCreate />} />
                                <Route path="room-update/:id" element={<RoomUpdate />} />
                            </Route>
                            <Route path="/clients" element={<Outlet />}>
                                <Route path="" element={<ClientMain />} />
                                <Route path="client-create" element={<ClientCreate />} />
                                <Route path="client-update/:id" element={<ClientUpdate />} />
                            </Route>
                            <Route path="/users" element={<Outlet />}>
                                <Route path="" element={<UserMain />} />
                                <Route path="user-create" element={<UserCreate />} />
                                <Route path="user-update/:id" element={<UserUpdate />} />
                            </Route>
                        </Route>
                    </Routes>
                </DarkModeProvider>
            </LoginProvider>
        </BrowserRouter >
    </Provider>
)