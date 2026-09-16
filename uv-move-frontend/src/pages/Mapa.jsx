import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { Camera } from 'lucide-react'

export default function Mapa({ session }) {
  const navigate = useNavigate()
  const [vehiculos, setVehiculos] = useState([])

  useEffect(() => {
    // API Call al Backend de Spring Boot (Gestor de Flota)
    fetch('/api/flota/cercanos', {
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      }
    })
      .then(res => res.json())
      .then(data => setVehiculos(data))
      .catch(err => console.error("Error fetching flota:", err))
  }, [session])

  return (
    <div className="flex-1 relative bg-[#E2EAF2] rounded-[36px] mx-4 mt-2 overflow-hidden shadow-neuro-inset">
      
      {/* Fake Map Elements */}
      <div className="absolute w-[140%] h-[26px] bg-white/70 rounded-xl top-[32%] -left-[20%] -rotate-[18deg]"></div>
      <div className="absolute w-[28px] h-[120%] bg-white/70 rounded-xl top-[-10%] left-[58%] rotate-[12deg]"></div>
      <div className="absolute w-[160px] h-[140px] bg-uv-verde/10 border-2 border-dashed border-uv-verde/30 rounded-3xl top-[18%] left-[8%] flex items-center justify-center text-[10px] font-bold text-uv-verde uppercase text-center p-2">
        Facultad de Negocios y Tecnologías
      </div>

      {/* Header */}
      <div className="absolute top-4 left-4 right-4 bg-white/80 backdrop-blur-md p-3 rounded-3xl flex justify-between items-center shadow-neuro border border-white/70 z-10">
        <div>
          <h2 className="text-uv-azul font-bold text-sm flex items-center gap-1">
            <span className="text-uv-verde text-lg leading-none mb-0.5">•</span> UV Move
          </h2>
          <p className="text-[10px] text-text-muted font-medium">Campus Ixtac</p>
        </div>
        <button onClick={() => supabase.auth.signOut()} className="w-9 h-9 rounded-full bg-neuro-base shadow-neuro font-bold text-uv-azul text-xs border border-white">
          S
        </button>
      </div>

      {/* Render Pines del API */}
      {vehiculos.map((v, i) => {
        const positions = [
          { top: '25%', left: '20%' },
          { top: '35%', left: '50%' },
          { top: '45%', left: '15%' },
          { top: '28%', left: '75%' },
          { top: '55%', left: '40%' },
          { top: '65%', left: '70%' },
          { top: '75%', left: '25%' },
          { top: '68%', left: '10%' }
        ];
        const pos = positions[i % positions.length];
        return (
        <div key={v.idVehiculo} className="absolute flex flex-col items-center z-10" 
             style={{ top: pos.top, left: pos.left }}>
          <div className="w-11 h-11 bg-uv-verde rounded-full flex items-center justify-center text-white text-xl shadow-neuro border-2 border-white">
            {v.tipoVehiculo === 'Scooter' ? '🛴' : '🚲'}
          </div>
          <span className="mt-1 bg-white/90 px-2 py-0.5 rounded-lg text-[10px] font-bold shadow-sm">{v.idVehiculo}</span>
        </div>
      )})}
      
      {/* Botón inferior para Escanear */}
      <div className="absolute bottom-6 left-4 right-4 bg-neuro-base rounded-[32px] p-5 shadow-neuro border border-white/80 z-10">
        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
        <div className="flex justify-between items-center mb-5">
          <div>
            <h3 className="font-bold text-text-main text-lg">Vehículos cerca</h3>
            <p className="text-xs text-text-muted font-medium">Selecciona o acércate a una unidad</p>
          </div>
          <span className="bg-[#DEE7F2] text-uv-azul px-3 py-1.5 rounded-xl text-xs font-bold shadow-neuro-inset">
            {vehiculos.length} Libres
          </span>
        </div>
        
        <button 
          onClick={() => navigate('/escaner')}
          className="w-full h-14 bg-gradient-to-br from-[#1A5BB0] to-[#134585] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(24,82,157,0.35)] active:scale-95 transition-transform"
        >
          <Camera size={20} />
          Escanear código QR
        </button>
      </div>
    </div>
  )
}
