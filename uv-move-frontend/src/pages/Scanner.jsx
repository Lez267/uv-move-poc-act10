import { useEffect, useState } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { useNavigate } from 'react-router-dom'
import { X, Flashlight } from 'lucide-react'
import ErrorModal from '../components/ErrorModal'

export default function Scanner({ session }) {
  const navigate = useNavigate()
  const [errorModal, setErrorModal] = useState({ show: false, message: '', vehiculo: '' })
  const [loading, setLoading] = useState(false)
  const [scannedId, setScannedId] = useState(null)

  useEffect(() => {
    // iniciamos el lector de qr de la camara
    let scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: {width: 200, height: 200} }, false);
    
    scanner.render(async (decodedText) => {
      scanner.pause()
      setScannedId(decodedText)
      setLoading(true)
      
      try {
        // mandamos la peticion para iniciar el viaje
        const res = await fetch('/api/viajes/iniciar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({
            idUsuario: session.user.email, // Simulando matrícula
            idVehiculo: decodedText
          })
        })

        if (res.ok) {
          const viaje = await res.json()
          scanner.clear()
          // pasamos a la pantalla del viaje
          navigate(`/viaje-activo/${viaje.idViaje}`, { state: { vehiculo: decodedText } })
        } else if (res.status === 409) {
          const errMsg = await res.text()
          setLoading(false)
          // mostramos el modal si hay error
          setErrorModal({ show: true, message: errMsg, vehiculo: decodedText })
        } else {
          setLoading(false)
          alert("Error de validación")
          scanner.resume()
        }
      } catch (err) {
        setLoading(false)
        console.error(err)
        scanner.resume()
      }
    }, (error) => { /* ignore */ })

    return () => {
      scanner.clear().catch(e => console.error(e))
    }
  }, [navigate, session])

  return (
    <div className="flex-1 bg-[#1C1C1E] rounded-[40px] m-1 overflow-hidden relative flex flex-col">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#2C2C2E_0%,#1C1C1E_80%)]"></div>
      
      {/* Top Controls */}
      <div className="flex justify-between items-center p-6 pt-12 z-10">
        <button onClick={() => navigate('/mapa')} className="w-11 h-11 bg-[#2C2C2E] rounded-full flex items-center justify-center text-white shadow-[6px_6px_12px_rgba(0,0,0,0.6),-6px_-6px_12px_rgba(72,72,74,0.5)] border border-white/5">
          <X size={20} />
        </button>
        <button className="w-11 h-11 bg-[#2C2C2E] rounded-full flex items-center justify-center text-white shadow-[6px_6px_12px_rgba(0,0,0,0.6),-6px_-6px_12px_rgba(72,72,74,0.5)] border border-white/5">
          <Flashlight size={18} />
        </button>
      </div>

      {/* QR Reader Container */}
      <div className="flex-1 flex flex-col items-center justify-center z-10 px-6">
        <div className="w-full bg-black/40 rounded-3xl overflow-hidden border border-white/20 p-2 relative">
           <div id="reader" className="w-full"></div>
           {/* Simulador para testing sin cámara real */}
           <div className="mt-4 flex gap-2 w-full">
             <button onClick={() => simulateScan("B-001")} className="bg-uv-verde text-white flex-1 py-2 rounded-xl text-xs font-bold">Simular B-001 (Éxito)</button>
             <button onClick={() => simulateScan("B-002")} className="bg-red-500 text-white flex-1 py-2 rounded-xl text-xs font-bold">Simular B-002 (RN7)</button>
           </div>
        </div>
      </div>

      {loading && (
        <div className="absolute bottom-10 left-6 right-6 bg-[#2C2C2E]/85 backdrop-blur-xl p-4 rounded-3xl flex items-center gap-4 z-20 shadow-[0_20px_40px_rgba(0,0,0,0.5)] border border-white/10">
          <div className="w-7 h-7 rounded-full border-2 border-white/10 border-t-uv-verde animate-spin"></div>
          <div>
            <h3 className="text-white font-bold text-sm">Vehículo {scannedId} detectado</h3>
            <p className="text-uv-verde text-xs font-medium">Validando disponibilidad en servidor...</p>
          </div>
        </div>
      )}

      {errorModal.show && (
        <ErrorModal 
          vehiculo={errorModal.vehiculo} 
          mensaje={errorModal.message}
          onClose={() => {
            setErrorModal({show: false})
            navigate('/mapa')
          }} 
        />
      )}
    </div>
  )

  // funcion nomas para probar sin tener que escanear de verdad
  function simulateScan(id) {
    const readerElement = document.getElementById('reader');
    if (readerElement) {
       // Stop actual camera
       readerElement.innerHTML = '<p class="text-white text-center">Escaneo simulado...</p>';
    }
    setScannedId(id)
    setLoading(true)
    
    fetch('/api/viajes/iniciar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({ idUsuario: session.user.email, idVehiculo: id })
    })
    .then(async res => {
      if (res.ok) {
        const viaje = await res.json()
        navigate(`/viaje-activo/${viaje.idViaje}`, { state: { vehiculo: id } })
      } else if (res.status === 409) {
        const errMsg = await res.text()
        setLoading(false)
        setErrorModal({ show: true, message: errMsg, vehiculo: id })
      }
    })
  }
}
