
import { Provider } from 'react-redux'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { createRoot } from 'react-dom/client'

import { store } from './common/js/store.js'
import { Root } from './common/pages/root/root.jsx'
import { SignUp } from './common/pages/signUp/signUp.jsx'
import { Layout } from './common/pages/layout/layout.jsx'
import { Dashboard } from './pages/dashboard/dashboard.jsx'
import { Bookings } from './pages/bookings/booking.jsx'
import { BookingCreate } from './pages/bookings/pages/bookingCreate/bookingCreate.jsx'
import { BookingUpdate } from './pages/bookings/pages/bookingUpdate/bookingUpdate.jsx'
import { BookingDetails } from './pages/bookings/pages/bookingDetails/bookingDetails.jsx'
import { Room } from './pages/room/room.jsx'
import { RoomCreate } from './pages/room/pages/roomCreate/roomCreate.jsx'
import { RoomUpdate } from './pages/room/pages/roomUpdate/roomUpdate.jsx'
import { Contact } from './pages/contact/contact.jsx'
import { ContactCreate } from './pages/contact/pages/contactCreate/contactCreate.jsx'
import { ContactUpdate } from './pages/contact/pages/contactUpdate/contactUpdate.jsx'
import { User } from './pages/user/user.jsx'
import { UserCreate } from './pages/user/pages/userCreate/userCreate.jsx'
import { UserUpdate } from './pages/user/pages/userUpdate/userUpdate.jsx'

import { LoginProvider } from './common/pages/signUp/features/loginProvider.jsx'



createRoot(document.getElementById('root')).render(
    <LoginProvider>
        <BrowserRouter>
            <Provider store={store}>
                <Routes>
                    <Route path='' element={<SignUp />} />
                    <Route element={<Layout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/bookings" element={<Root />}>
                            <Route path="" element={<Bookings />} />
                            <Route path="booking-create" element={<BookingCreate />} />
                            <Route path="booking-update/:id" element={<BookingUpdate />} />
                            <Route path="booking-detail" element={<BookingDetails />} />
                        </Route>
                        <Route path="/room" element={<Root />}>
                            <Route path="" element={<Room />} />
                            <Route path="room-create" element={<RoomCreate />} />
                            <Route path="room-update/:id" element={<RoomUpdate />} />
                        </Route>
                        <Route path="/contact" element={<Root />}>
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
            </Provider>
        </BrowserRouter >
    </LoginProvider>
)