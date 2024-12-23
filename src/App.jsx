import { useState, useRef, useEffect } from 'react'
import { Download, Trash2, History, Loader2 } from 'lucide-react'
import KeyboardSequence from './components/KeyboardSequence'
import gifshot from 'gifshot'
import html2canvas from 'html2canvas'

function App() {
  const [sequence, setSequence] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const previewRef = useRef(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const fixedSize = {
    width: 1000,
    height: 400
  }

  const handleKeyClick = (key) => {
    setSequence(prev => [...prev, { key, id: Date.now() }])
    setActiveIndex(sequence.length)
  }

  const handleRemoveKey = (id) => {
    setSequence(prev => {
      const index = prev.findIndex(k => k.id === id)
      if (index <= activeIndex) {
        setActiveIndex(Math.max(0, activeIndex - 1))
      }
      return prev.filter(k => k.id !== id)
    })
  }

  const clearSequence = () => {
    setSequence([])
    setActiveIndex(0)
    setProgress(0)
  }

  const generateGif = async () => {
    if (sequence.length === 0) return
    setIsGenerating(true)
    setProgress(0)

    try {
      const frames = []
      const frameDelay = 0.5 // Velocidad ajustada
      const framesPerKey = 9 // Menos frames para mejor rendimiento
      const transitionFrames = 3 // Frames de transición

      // Opciones mejoradas para html2canvas
      const html2canvasOptions = {
        backgroundColor: '#ffffff',
        scale: 3, // Mayor escala para mejor calidad
        logging: false,
        useCORS: true,
        allowTaint: true,
        windowWidth: fixedSize.width,
        windowHeight: fixedSize.height,
        x: 0,
        y: 0,
        width: fixedSize.width,
        height: fixedSize.height,
        scrollX: 0,
        scrollY: 0,
        imageTimeout: 0,
        removeContainer: true
      }

      // Captura de frames con transiciones suaves
      for (let i = 0; i < sequence.length; i++) {
        setActiveIndex(i)
        setProgress((i / sequence.length) * 50)
        
        // Espera para la actualización del DOM
        await new Promise(resolve => setTimeout(resolve, 50))
        
        // Captura el frame principal
        const canvas = await html2canvas(previewRef.current, html2canvasOptions)
        
        // frames principales y de transición
        for (let f = 0; f < framesPerKey; f++) {
          frames.push(canvas.toDataURL('image/png'))
        }

        // frames de transición si no es el último
        if (i < sequence.length - 1) {
          for (let t = 0; t < transitionFrames; t++) {
            frames.push(canvas.toDataURL('image/png'))
          }
        }
      }

      // Frame final con más duración
      setActiveIndex(sequence.length)
      await new Promise(resolve => setTimeout(resolve, 50))
      const finalCanvas = await html2canvas(previewRef.current, html2canvasOptions)
      
      // más frames finales para que se vea mejor el resultado
      for (let i = 0; i < framesPerKey * 2; i++) {
        frames.push(finalCanvas.toDataURL('image/png'))
      }

      // Opciones mejoradas para gifshot
      gifshot.createGIF({
        images: frames,
        gifWidth: fixedSize.width,
        gifHeight: fixedSize.height,
        interval: frameDelay / framesPerKey,
        numWorkers: 4,
        quality: 10, // Mejor calidad
        sampleInterval: 7, // Mejor muestreo de color
        progressCallback: (captureProgress) => {
          setProgress(50 + (captureProgress * 50))
        },
      }, function(obj) {
        if(!obj.error) {
          const link = document.createElement('a')
          link.href = obj.image
          link.download = 'keyboard-sequence.gif'
          link.click()
          setProgress(100)
        }
      })
    } catch (error) {
      console.error('Error generando GIF:', error)
    } finally {
      setTimeout(() => {
        setIsGenerating(false)
        setProgress(0)
        setActiveIndex(sequence.length)
      }, 1000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {isMobile && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md text-center border border-gray-100">
            <p className="text-gray-700 mb-6 font-medium text-lg">
              No se puede acceder desde este dispositivo. Para disfrutar de toda la experiencia es mejor ir a desktop.
            </p>
            <p className="text-gray-500 mb-6 font-medium">
              -AndrewHypervenom
            </p>
            <div className="flex justify-center space-x-6">
              <a 
                href="https://www.linkedin.com/in/andresfelipefajardopachon/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                LinkedIn
              </a>
              <a 
                href="https://github.com/AndrewHypervenom"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <header className="w-full px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⌨️</span>
            <h1 className="text-xl font-semibold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              Generador de GIF - Secuencia de Teclado
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {sequence.length > 0 && (
              <button
                onClick={clearSequence}
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg flex items-center gap-2 
                  text-sm hover:bg-gray-100 transition-all duration-200"
              >
                <Trash2 className="w-4 h-4" />
                Limpiar
              </button>
            )}
            
            <button
              onClick={generateGif}
              disabled={sequence.length === 0 || isGenerating}
              className="bg-primary-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 
                disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-600 transition-all duration-200
                text-sm font-medium shadow-sm hover:shadow-md disabled:hover:bg-primary-500"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generando... {Math.round(progress)}%
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Generar GIF
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="container max-w-5xl mx-auto p-6 flex flex-col gap-6">
        {/* Barra de progreso */}
        {isGenerating && (
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-primary-500 transition-all duration-300 ease-in-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Sequence Display */}
        {sequence.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <History className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium text-gray-700">Secuencia ({sequence.length} teclas):</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {sequence.map((item, index) => (
                <div 
                  key={item.id}
                  className="bg-gray-50 flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200
                    hover:border-gray-300 transition-all duration-200 group"
                >
                  <span className="text-xs font-medium text-gray-400">{index + 1}</span>
                  <span className="text-sm font-medium text-gray-700">{item.key}</span>
                  <button
                    onClick={() => handleRemoveKey(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Keyboard Preview */}
        <div className="flex justify-center items-center w-full">
        <div 
              ref={previewRef} 
              className="bg-white"
              style={{
                width: `${fixedSize.width}px`,
                height: `${fixedSize.height}px`,
                overflow: 'hidden'
              }}
            >
              <KeyboardSequence 
                sequence={sequence} 
                activeIndex={activeIndex}
                onKeyClick={handleKeyClick}
              />
          </div>
        </div>

        {/* Instrucciones */}
        {sequence.length === 0 && (
          <div className="bg-primary-50 border border-primary-100 rounded-lg p-4 text-center">
            <p className="text-primary-700">
              Haz clic en las teclas del teclado para crear tu secuencia.
              <br />
              Al terminar, presiona "Generar GIF" para crear tu animación.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App