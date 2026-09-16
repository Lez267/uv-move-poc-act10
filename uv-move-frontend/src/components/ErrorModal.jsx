import { AlertTriangle } from 'lucide-react'

export default function ErrorModal({ vehiculo, mensaje, onClose }) {
  return (
    <div className="absolute inset-0 bg-black/65 backdrop-blur-sm z-50 flex items-center justify-center p-8">
      <div className="bg-[#F5F5F7]/95 w-full rounded-[32px] p-8 flex flex-col items-center text-center shadow-[0_24px_48px_rgba(0,0,0,0.4)] border border-white/30 animate-[popIn_0.4s_ease-out]">
        
        <div className="w-[72px] h-[72px] bg-[#FFE5E5] rounded-full flex items-center justify-center text-red-500 mb-5 shadow-[inset_4px_4px_8px_rgba(255,59,48,0.15),inset_-4px_-4px_8px_rgba(255,255,255,0.8)]">
          <AlertTriangle size={32} />
        </div>
        
        <h2 className="text-xl font-bold text-text-main mb-3 leading-tight">
          Vehículo<br/>no disponible
        </h2>
        
        <p className="text-sm text-text-muted font-medium leading-relaxed mb-6">
          La unidad <b className="text-text-main">{vehiculo}</b> no se puede rentar. {mensaje}
        </p>

        <div className="bg-gray-200 text-gray-500 px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wide mb-6">
          Bloqueo por Regla: RN7
        </div>

        <button 
          onClick={onClose}
          className="w-full bg-[#FF3B30] text-white font-bold py-4 rounded-2xl shadow-[0_8px_16px_rgba(255,59,48,0.25)] active:scale-95 transition-transform"
        >
          Entendido
        </button>
      </div>
    </div>
  )
}
