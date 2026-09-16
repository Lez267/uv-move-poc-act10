import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    // Inicio de sesión con contraseña nativa de Supabase
    const { error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    })
    
    if (error) {
      setMessage('Correo o contraseña incorrectos.')
    }
    setLoading(false)
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-neuro-base">
      <div className="w-16 h-16 rounded-2xl bg-neuro-base shadow-neuro flex items-center justify-center text-uv-azul mb-8">
        <span className="text-3xl font-bold">UV</span>
      </div>
      <h1 className="text-2xl font-bold text-uv-azul mb-2">UV Move PoC</h1>
      <p className="text-text-muted text-center text-sm mb-10">Ingresa tus credenciales para acceder al sistema.</p>
      
      <form onSubmit={handleLogin} className="w-full flex flex-col gap-6">
        <input
          type="email"
          placeholder="matricula@estudiantes.uv.mx"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-neuro-base shadow-neuro-inset rounded-2xl px-6 py-4 text-text-main outline-none placeholder:text-gray-400 font-medium"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full bg-neuro-base shadow-neuro-inset rounded-2xl px-6 py-4 text-text-main outline-none placeholder:text-gray-400 font-medium"
        />
        
        <button 
          disabled={loading}
          type="submit"
          className="w-full bg-gradient-to-br from-uv-azul to-blue-800 text-white font-bold py-4 rounded-2xl shadow-neuro transition-transform active:scale-95 disabled:opacity-50"
        >
          {loading ? 'Iniciando sesión...' : 'Entrar'}
        </button>
      </form>
      {message && <p className="mt-6 text-sm font-semibold text-[#FF3B30] text-center">{message}</p>}
    </div>
  )
}
