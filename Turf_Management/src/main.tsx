import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import LoginPage from './Pages/Home/Home.tsx'
import Home from './Pages/Home/Home.tsx'
import NavBar from './Components/NavBar/NavBar.tsx'
createRoot(document.getElementById('root')!).render(
  <>
    <App/>
  </>
)
