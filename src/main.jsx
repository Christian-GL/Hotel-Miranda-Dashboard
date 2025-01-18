
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { createRoot } from 'react-dom/client'

import { SignUp } from './common/pages/signUp/signUp.jsx'
import { CheckAutentication } from './common/pages/signUp/checkAutentication.jsx'
import { Layout } from './common/pages/layout/layout.jsx'
import { Dashboard } from './pages/dashboard/dashboard.jsx'
import { Bookings } from './pages/bookings/booking.jsx'
import { BookingDetails } from './pages/bookings/pages/bookingDetails/bookingDetails.jsx'
import { RoomList } from './pages/roomList/roomList.jsx'
import { Contact } from './pages/contact/contact.jsx'
import { Users } from './pages/users/users.jsx'
import { UserCreate } from './pages/users/pages/userCreate/userCreate.jsx'



createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <Routes>
            <Route path='' element={<SignUp />} />
            <Route element={<CheckAutentication element={<Layout />} />}>
                <Route path="/dashboard" element={<Dashboard />} />
                {/* <Route path="/bookings" element={<Bookings />} /> */}
                <Route path="/bookings" element={<BookingDetails />} />
                <Route path="/roomList" element={<RoomList />} />
                <Route path="/contact" element={<Contact />} />
                {/* <Route path="/users" element={<Users />} /> */}
                <Route path="/users" element={<UserCreate />} />
            </Route>
        </Routes>
    </BrowserRouter >
)
