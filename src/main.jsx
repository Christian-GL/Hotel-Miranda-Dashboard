
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
import { BookingDetails } from './pages/bookings/pages/bookingDetails/bookingDetails.jsx'
import { RoomList } from './pages/roomList/roomList.jsx'
import { RoomCreate } from './pages/roomList/pages/roomCreate/roomCreate.jsx'
import { Contact } from './pages/contact/contact.jsx'
import { ContactCreate } from './pages/contact/contactCreate/contactCreate.jsx'
import { Users } from './pages/users/users.jsx'
import { UserCreate } from './pages/users/pages/userCreate/userCreate.jsx'

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
                            <Route path="booking-detail" element={<BookingDetails />} />
                        </Route>
                        <Route path="/roomList" element={<Root />}>
                            <Route path="" element={<RoomList />} />
                            <Route path="room-create" element={<RoomCreate />} />
                        </Route>
                        <Route path="/contact" element={<Root />}>
                            <Route path="" element={<Contact />} />
                            <Route path="contact-create" element={<ContactCreate />} />
                        </Route>
                        <Route path="/users" element={<Root />}>
                            <Route path="" element={<Users />} />
                            <Route path="user-create" element={<UserCreate />} />
                        </Route>
                    </Route>
                </Routes>
            </Provider>
        </BrowserRouter >
    </LoginProvider>
)