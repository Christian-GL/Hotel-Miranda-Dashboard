
import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { createRoot } from 'react-dom/client'

import { LoginProvider } from './common/components/signIn/features/loginProvider.tsx'
import { DarkModeProvider } from './common/context/darkModeContext.tsx'
import { store } from './common/redux/store.ts'
import { Root } from './common/components/signIn/root/root.tsx'
import { SignIn } from './common/components/signIn/signIn.tsx'
import { Layout } from './common/components/layout/layout.tsx'
import { Dashboard } from './dashboard/dashboard.tsx'
import { Bookings } from './booking/booking.tsx'
import { BookingCreate } from './booking/pages/bookingCreate/bookingCreate.tsx'
import { BookingUpdate } from './booking/pages/bookingUpdate/bookingUpdate.tsx'
import { BookingDetails } from './booking/pages/bookingDetails/bookingDetails.tsx'
import { Room } from './room/room.tsx'
import { RoomCreate } from './room/pages/roomCreate/roomCreate.tsx'
import { RoomUpdate } from './room/pages/roomUpdate/roomUpdate.tsx'
import { Contact } from './contact/contact.tsx'
import { ContactCreate } from './contact/pages/contactCreate/contactCreate.tsx'
import { ContactUpdate } from './contact/pages/contactUpdate/contactUpdate.tsx'
import { User } from './user/user.tsx'
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
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/bookings" element={<Root />}>
                                <Route path="" element={<Bookings />} />
                                <Route path="booking-create" element={<BookingCreate />} />
                                <Route path="booking-update/:id" element={<BookingUpdate />} />
                                <Route path="booking-details/:id" element={<BookingDetails />} />
                            </Route>
                            <Route path="/rooms" element={<Root />}>
                                <Route path="" element={<Room />} />
                                <Route path="room-create" element={<RoomCreate />} />
                                <Route path="room-update/:id" element={<RoomUpdate />} />
                            </Route>
                            <Route path="/contacts" element={<Root />}>
                                <Route path="" element={<Contact />} />
                                <Route path="contact-create" element={<ContactCreate />} />
                                <Route path="contact-update/:id" element={<ContactUpdate />} />
                            </Route>
                            <Route path="/users" element={<Root />}>
                                <Route path="" element={<User />} />
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