
import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { createRoot } from 'react-dom/client'

import { LoginProvider } from './signIn/features/loginProvider.tsx'
import { DarkModeProvider } from './common/context/darkModeContext.tsx'
import { store } from './common/redux/store.ts'
import { Outlet } from 'react-router-dom'
import { SignIn } from './signIn/signIn.tsx'
import { Layout } from './common/components/layout/layout.tsx'
import { DashboardMain } from './dashboard/dashboardMain.tsx'
import { BookingMain } from './booking/pages/bookingMain/bookingMain.tsx'
import { BookingCreate } from './booking/pages/bookingCreate/bookingCreate.tsx'
import { BookingUpdate } from './booking/pages/bookingUpdate/bookingUpdate.tsx'
import { BookingDetails } from './booking/pages/bookingDetails/bookingDetails.tsx'
import { RoomMain } from './room/pages/roomMain/roomMain.tsx'
import { RoomCreate } from './room/pages/roomCreate/roomCreate.tsx'
import { RoomUpdate } from './room/pages/roomUpdate/roomUpdate.tsx'
import { ContactMain } from './contact/pages/contactMain/contactMain.tsx'
import { ContactCreate } from './contact/pages/contactCreate/contactCreate.tsx'
import { ContactUpdate } from './contact/pages/contactUpdate/contactUpdate.tsx'
import { UserMain } from './user/pages/userMain/userMain.tsx'
import { UserCreate } from './user/pages/userCreate/userCreate.tsx'
import { UserUpdate } from './user/pages/userUpdate/userUpdate.tsx'


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
                            <Route path="/contacts" element={<Outlet />}>
                                <Route path="" element={<ContactMain />} />
                                <Route path="contact-create" element={<ContactCreate />} />
                                <Route path="contact-update/:id" element={<ContactUpdate />} />
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