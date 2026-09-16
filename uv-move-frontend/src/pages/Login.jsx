import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ text: '', type: '' })
    
    if (isRegistering) {
      // 1. Validar formato estricto UV: zS + 2 digitos + 00 + 4 digitos @estudiantes.uv.mx
      const uvRegex = /^[zZ][sS]\d{2}00\d{4}@estudiantes\.uv\.mx$/
      if (!uvRegex.test(email)) {
        setMessage({ text: 'Formato inválido. Debe ser zSXXXX00XXXX@estudiantes.uv.mx (Ej. zS24003976@estudiantes.uv.mx)', type: 'error' })
        setLoading(false)
        return
      }

      // 2. Registrar en Supabase
      const { data, error } = await supabase.auth.signUp({ email, password })
      
      if (error) {
        setMessage({ text: error.message, type: 'error' })
        setLoading(false)
        return
      }

      // 3. Registrar en base de datos Db2
      try {
        const res = await fetch('/api/usuarios/registrar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idUsuario: email })
        })

        if (!res.ok) {
          console.error("Error sincronizando con Db2")
        }
      } catch (err) {
        console.error("Error de red sincronizando Db2", err)
      }

      setMessage({ text: '¡Registro exitoso! Ya puedes iniciar sesión.', type: 'success' })
      setIsRegistering(false) // Regresar a modo login
      setLoading(false)

    } else {
      // Inicio de sesión normal
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      
      if (error) {
        setMessage({ text: 'Correo o contraseña incorrectos.', type: 'error' })
      }
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-neuro-base">
      <div className="w-16 h-16 rounded-2xl bg-neuro-base shadow-neuro flex items-center justify-center text-uv-azul mb-8">
        <span className="text-3xl font-bold">UV</span>
      </div>
      <h1 className="text-2xl font-bold text-uv-azul mb-2">UV Move PoC</h1>
      <p className="text-text-muted text-center text-sm mb-10">
        {isRegistering 
          ? 'Ingresa tu cuenta institucional de la UV para registrarla en UV Move' 
          : 'Bienvenido, ingresa tu correo y contraseña para entrar'}
      </p>
      
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
        <input
          type="email"
          placeholder="zS24003976@estudiantes.uv.mx"
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
          {loading ? 'Procesando...' : (isRegistering ? 'Registrarse' : 'Entrar')}
        </button>
      </form>
      
      {message.text && (
        <p className={`mt-6 text-sm font-semibold text-center ${message.type === 'error' ? 'text-[#FF3B30]' : 'text-uv-verde'}`}>
          {message.text}
        </p>
      )}

      <button 
        type="button"
        onClick={() => { setIsRegistering(!isRegistering); setMessage({text:'', type:''}) }}
        className="mt-8 text-sm text-text-muted underline decoration-gray-500/30 font-medium"
      >
        {isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
      </button>
    </div>
  )
}
