
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { createRoot } from 'react-dom/client'

import { SignUp } from './common/pages/signUp/signUp.jsx'
import { CheckAutentication } from './common/pages/signUp/checkAutentication.jsx'
import { Layout } from './common/pages/layout/layout.jsx'
import { Dashboard } from './pages/dashboard/dashboard.jsx'
import { Bookings } from './pages/bookings/booking.jsx'
import { RoomList } from './pages/roomList/roomList.jsx'
import { Contact } from './pages/contact/contact.jsx'
import { Users } from './pages/users/users.jsx'



createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <Routes>
            <Route path='' element={<SignUp />} />
            <Route element={<Layout />}>
                <Route path="/dashboard" element={<CheckAutentication element={<Dashboard />} />} />
                <Route path="/bookings" element={<CheckAutentication element={<Bookings />} />} />
                <Route path="/roomList" element={<CheckAutentication element={<RoomList />} />} />
                <Route path="/contact" element={<CheckAutentication element={<Contact />} />} />
                <Route path="/users" element={<CheckAutentication element={<Users />} />} />
            </Route>
        </Routes>
    </BrowserRouter >
)
