
import { Provider } from 'react-redux'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { createRoot } from 'react-dom/client'

import { store } from './common/redux/store.js'
import { Root } from './common/components/signUp/root/root.jsx'
import { SignUp } from './common/components/signUp/signUp.jsx'
import { Layout } from './common/components/layout/layout.jsx'
import { Dashboard } from './dashboard/dashboard.jsx'
import { Bookings } from './booking/booking.jsx'
import { BookingCreate } from './booking/pages/bookingCreate/bookingCreate.jsx'
import { BookingUpdate } from './booking/pages/bookingUpdate/bookingUpdate.jsx'
import { BookingDetails } from './booking/pages/bookingDetails/bookingDetails.jsx'
import { Room } from './room/room.jsx'
import { RoomCreate } from './room/pages/roomCreate/roomCreate.jsx'
import { RoomUpdate } from './room/pages/roomUpdate/roomUpdate.jsx'
import { Contact } from './contact/contact.jsx'
import { ContactCreate } from './contact/pages/contactCreate/contactCreate.jsx'
import { ContactUpdate } from './contact/pages/contactUpdate/contactUpdate.jsx'
import { User } from './user/user.jsx'
import { UserCreate } from './user/pages/userCreate/userCreate.jsx'
import { UserUpdate } from './user/pages/userUpdate/userUpdate.jsx'

import { LoginProvider } from './common/components/signUp/features/loginProvider.jsx'



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
                            <Route path="booking-detail/:id" element={<BookingDetails />} />
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
            </Provider>
        </BrowserRouter >
    </LoginProvider>
)