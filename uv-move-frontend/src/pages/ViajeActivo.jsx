import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { supabase } from '../supabaseClient'

export default function ViajeActivo({ session }) {
  const { idViaje } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const vehiculo = location.state?.vehiculo || 'Desconocido'
  
  const [seconds, setSeconds] = useState(0)
  const [loading, setLoading] = useState(false)
  const [startTime] = useState(() => new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}))

  useEffect(() => {
    // un relojito para ver cuanto llevamos
    const interval = setInterval(() => {
      setSeconds(s => s + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600)
    const m = Math.floor((totalSeconds % 3600) / 60)
    const s = totalSeconds % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleFinalizar = async () => {
    setLoading(true)
    try {
      // avisamos al backend que terminamos de usar la bici o scooter
      const res = await fetch(`/api/viajes/${idViaje}/finalizar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })
      if (res.ok) {
        navigate('/mapa')
      } else {
        alert("Error al finalizar viaje")
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 bg-neuro-base flex flex-col items-center">
      
      {/* Banner de Éxito */}
      <div className="mt-20 bg-uv-verde/10 border border-uv-verde/30 text-uv-verde px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-[0_4px_12px_rgba(40,173,86,0.15)] animate-[slideDown_0.5s_ease-out]">
        <Check size={16} strokeWidth={3} /> VIAJE EN CURSO
      </div>

      {/* Timer Circle */}
      <div className="mt-10 w-[260px] h-[260px] rounded-full bg-neuro-base shadow-neuro flex justify-center items-center relative">
        {/* Animated Progress Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-uv-verde border-r-uv-verde -rotate-45 shadow-[0_0_15px_rgba(40,173,86,0.4)] z-10"></div>
        
        <div className="w-[210px] h-[210px] rounded-full bg-neuro-base shadow-neuro-inset flex flex-col justify-center items-center z-20">
          <div className="text-[42px] font-extrabold text-text-main tracking-tight font-mono mb-1">
            {formatTime(seconds)}
          </div>
          <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
            Tiempo Transcurrido
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="w-[85%] mt-12 bg-neuro-base rounded-[28px] p-6 shadow-neuro flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-neuro-base shadow-neuro-inset flex justify-center items-center text-2xl">
            {vehiculo.startsWith('B') ? '🚲' : '🛴'}
          </div>
          <div>
            <h4 className="font-bold text-text-main">{vehiculo.startsWith('B') ? 'Bicicleta Clásica' : 'Scooter Eléctrico'}</h4>
            <p className="text-xs text-text-muted font-medium mt-0.5">ID Vehículo: {vehiculo}</p>
          </div>
        </div>
        
        <div className="h-[2px] bg-[#A3B1C6]/20 rounded-full"></div>
        
        <div className="flex items-center justify-center gap-2 text-xs text-text-main font-medium bg-white/50 p-2.5 rounded-xl">
          <span>⏱️</span>
          <span>Iniciado a las:</span>
          <strong className="text-uv-azul">{startTime}</strong>
        </div>
      </div>

      {/* End Button */}
      <button 
        disabled={loading}
        onClick={handleFinalizar}
        className="w-[85%] h-16 mt-auto mb-10 bg-gradient-to-br from-[#FF5E55] to-[#FF3B30] text-white rounded-[22px] text-[17px] font-bold shadow-[0_12px_24px_rgba(255,59,48,0.35)] active:scale-95 transition-transform disabled:opacity-50"
      >
        {loading ? 'Finalizando...' : 'Finalizar Viaje'}
      </button>

    </div>
  )
}
