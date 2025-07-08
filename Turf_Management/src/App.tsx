import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Home from './Pages/Home/Home.tsx';
import Login from './Pages/Login/Login.tsx';
import Signup from './Pages/SignUo/signup.tsx';
import Turf from './Components/Turf Slot/turf.tsx';
import BookTurf from './Pages/BookTurf/BookTurf.tsx';
import Cslot from './Components/CreateSlotDetails/cslot.tsx';
import Create from './Pages/Create Turf/create.tsx';
import NavBar from './Components/NavBar/NavBar.tsx';
import History from './Pages/History/History.tsx';
import Booking from './Components/Booking/Booking.tsx';
import Users from './Components/Users/Users.tsx';
import ViewUser from './Components/Admin - User/viewuser.tsx';
import ViewDelete from './Pages/Admin/ViewDelete.tsx';
import Histurf from './Pages/HisTurf/histurf.tsx';
import Logout from './Pages/Logout/logout.tsx';
import Profile from './Pages/Profile/profile.tsx';
import Delete from './Pages/DeleteTurf/Delete.tsx';
import Update from './Pages/Update/update.tsx';
import Imager from './Components/Image/image.tsx';
import Payment from './Components/Payment/payment.tsx';

const App = () => {
  return (
    <>
    <BrowserRouter>
        <Routes>
            <Route path='/login' element={<Login/>}/>
            <Route path='/logout' element={<Logout/>}/>
            <Route path='/' element={<Home/>}/>
            <Route path='/signup' element={<Signup/>}/>
            <Route path='/book' element={<BookTurf/>}/>
            <Route path='/create' element={<Histurf/>}/>
            <Route path='/history' element={<History/>}/>
            <Route path="/booking" element={<Booking />} />
            <Route path="/users" element={<ViewDelete />} />
            <Route path="/viewuser" element={<Create />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/delete" element={<Delete />} />
            <Route path="/update" element={<Update />} />
            <Route path="/dummy" element={<Imager />}/>
            <Route path="/qrcode" element={<Payment/>}/>
        </Routes>
    </BrowserRouter>
    </>
  )
}

export default App