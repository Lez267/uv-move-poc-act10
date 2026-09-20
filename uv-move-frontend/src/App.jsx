import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './supabaseClient'
import Login from './pages/Login'
import Mapa from './pages/Mapa'
import Scanner from './pages/Scanner'
import ViajeActivo from './pages/ViajeActivo'

function App() {
  const [session, setSession] = useState(null)
  
  useEffect(() => {
    // revisamos si ya iniciaron sesion antes para pasarlos directo
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <div className="bg-[#E8EEF5] min-h-[100dvh] w-full flex flex-col relative overflow-hidden">
      <BrowserRouter>
        {/* si no hay sesion se quedan en login, si no, al mapa o escaner */}
        <Routes>
          <Route path="/" element={!session ? <Login /> : <Navigate to="/mapa" />} />
          <Route path="/mapa" element={session ? <Mapa session={session} /> : <Navigate to="/" />} />
          <Route path="/escaner" element={session ? <Scanner session={session} /> : <Navigate to="/" />} />
          <Route path="/viaje-activo/:idViaje" element={session ? <ViajeActivo session={session} /> : <Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
