
// import { Provider } from 'react-redux'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { createRoot } from 'react-dom/client'

// import { store } from './common/components/store'
// import { SignUp } from './common/components/pruebasLogin/signUp'
import { Layout } from './common/pages/layout/layout.jsx'
import { Dashboard } from './dashboard/dashboard.jsx'



createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        {/* <Provider store={store}> */}
            <Routes>
                {/* <Route path='/' element={<SignUp />}> */}
                    <Route element={<Layout />}>
                        <Route path='' element={<Dashboard />} />
                    </Route>
                {/* </Route> */}
            </Routes>
        {/* </Provider> */}
    </BrowserRouter >
)
