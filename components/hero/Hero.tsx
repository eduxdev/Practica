'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { TextAnimate } from '../ui/text-animate'
import { RainbowButton } from '../ui/rainbow-button'
import { AnimatedGradientText } from '../ui/animated-gradient-text'
import { NumberTicker } from '../ui/number-ticker'
import { Particles } from '../ui/particles'
import { RetroGrid } from '../ui/retro-grid'
import { BorderBeam } from '../ui/border-beam'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

export default function Hero() {
  const { setTheme } = useTheme()

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0F2A1D] dark:bg-gray-900">
      
      {/* Imagen de fondo */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/image/agri2.jpg"
          alt="Agricultura moderna"
          fill
          className="object-cover opacity-30 dark:opacity-20"
          priority
        />
      </div>
      
      {/* Contenido principal */}
      <div className="relative z-10 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          
          {/* Layout con contenido a la izquierda y panel derecho */}
          <div className="min-h-screen flex items-center justify-between">
            
            {/* Contenido principal alineado a la izquierda */}
            <div className="text-left max-w-2xl">
              
              {/* Título principal */}
              <div className="mb-8">
                <TextAnimate 
                  animation="blurInUp" 
                  as="h1"
                  className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight tracking-tight text-white dark:text-gray-100"
                > 
                  Back to
                </TextAnimate>
                <TextAnimate 
                  animation="blurInUp" 
                  as="h1"
                  delay={0.2}
                  className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight tracking-tight text-[#6B9071] dark:text-[#7FA085]"
                > 
                  Nature.
                </TextAnimate>
              </div>

              {/* Subtítulo */}
              <div className="mb-8">
                <h2 className="text-xl md:text-2xl font-semibold mb-4 text-[#AEC3B0] dark:text-gray-300">
                  RaXiBot
                </h2>
                <AnimatedGradientText 
                  className="text-lg md:text-xl"
                  colorFrom="#AEC3B0"
                  colorTo="#E3EED4"
                >
                  Sistema Inteligente de Asistencia Agrícola
                </AnimatedGradientText>
              </div>

              {/* Descripción */}
              <TextAnimate 
                animation="fadeIn"
                delay={0.4}
                className="mb-8 max-w-lg text-base md:text-lg leading-relaxed text-[#E3EED4] dark:text-gray-200"
              >
                Plataforma empresarial que integra inteligencia artificial avanzada con herramientas especializadas para revolucionar la gestión agrícola moderna.
              </TextAnimate>

              {/* Botón de registro */}
              <div className="flex justify-start">
                <Link href="/auth?mode=register">
                  <button className="px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl bg-[#6B9071] dark:bg-[#4F7942] text-[#E3EED4] dark:text-white hover:bg-[#5A7F61] dark:hover:bg-[#3F6235]">
                    Registarte Ahora
                  </button>
                </Link>
              </div>
              
            </div>

            {/* Panel derecho con información */}
            <div className="hidden lg:flex flex-col space-y-6 max-w-sm">
              
              {/* Panel de estadísticas */}
              <div className="p-8 rounded-3xl backdrop-blur-sm border-0 shadow-2xl transition-all duration-300 hover:scale-105 bg-[rgba(174,195,176,0.15)] dark:bg-[rgba(75,85,99,0.2)]">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2 text-[#E3EED4] dark:text-white">
                    Impacto Global
                  </h3>
                  <div className="w-16 h-1 mx-auto rounded-full bg-[#6B9071] dark:bg-[#7FA085]"></div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#AEC3B0] dark:text-gray-300">Agricultores activos</span>
                    <span className="text-lg font-bold text-[#E3EED4] dark:text-white">
                      <NumberTicker value={2500} />+
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#AEC3B0] dark:text-gray-300">Hectáreas monitoreadas</span>
                    <span className="text-lg font-bold text-[#E3EED4] dark:text-white">
                      <NumberTicker value={15000} />+
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#AEC3B0] dark:text-gray-300">Ahorro promedio</span>
                    <span className="text-lg font-bold text-[#E3EED4] dark:text-white">35%</span>
                  </div>
                </div>
              </div>

              {/* Panel de características */}
              <div className="p-6 rounded-3xl backdrop-blur-sm border-0 shadow-2xl transition-all duration-300 hover:scale-105 bg-[rgba(107,144,113,0.15)] dark:bg-[rgba(55,65,81,0.3)]">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#6B9071] dark:bg-[#4F7942]">
                      <svg className="w-4 h-4 text-[#E3EED4] dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-[#E3EED4] dark:text-white">IA Avanzada</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#6B9071] dark:bg-[#4F7942]">
                      <svg className="w-4 h-4 text-[#E3EED4] dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-[#E3EED4] dark:text-white">Monitoreo 24/7</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#6B9071] dark:bg-[#4F7942]">
                      <svg className="w-4 h-4 text-[#E3EED4] dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-[#E3EED4] dark:text-white">Alertas Predictivas</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#6B9071] dark:bg-[#4F7942]">
                      <svg className="w-4 h-4 text-[#E3EED4] dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-[#E3EED4] dark:text-white">Soporte Experto</span>
                  </div>
                </div>
              </div>

              {/* Panel de contacto */}
              <div className="p-6 rounded-3xl backdrop-blur-sm border-0 shadow-2xl transition-all duration-300 hover:scale-105 bg-[rgba(55,85,52,0.15)] dark:bg-[rgba(31,41,55,0.4)]">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 bg-[#6B9071] dark:bg-[#4F7942]">
                    <svg className="w-6 h-6 text-[#E3EED4] dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold mb-2 text-[#E3EED4] dark:text-white">
                    ¿Necesitas ayuda?
                  </h4>
                  <p className="text-sm mb-4 text-[#AEC3B0] dark:text-gray-300">
                    Nuestro equipo está listo para asesorarte
                  </p>
                  <button className="px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 hover:scale-105 bg-[rgba(107,144,113,0.3)] dark:bg-[rgba(75,85,99,0.4)] text-[#E3EED4] dark:text-white border border-[#6B9071] dark:border-[#4F7942] hover:bg-[rgba(107,144,113,0.5)] dark:hover:bg-[rgba(75,85,99,0.6)]">
                    Contactar
                  </button>
                </div>
              </div>
              
            </div>
            
          </div>
        </div>
      </div>
      
      {/* Sección de estadísticas y módulos */}
      <div className="relative z-10 px-4 py-12 sm:px-6 lg:px-8 bg-[#E3EED4] dark:bg-gray-800">
        <div className="mx-auto max-w-7xl text-center">

          {/* Estadísticas Empresariales */}
          <div className="mb-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <Card className="relative p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-0 rounded-2xl bg-[#AEC3B0] dark:bg-gray-700">
              <BorderBeam size={50} duration={10} delay={0} colorFrom="#6B9071" colorTo="#375534" />
              <div className="text-4xl font-bold mb-2 text-[#0F2A1D] dark:text-white">
                <NumberTicker value={24} />
                <span className="text-2xl">/7</span>
              </div>
              <h3 className="font-semibold mb-1 text-[#0F2A1D] dark:text-white">Asistente IA Disponible</h3>
              <p className="text-sm text-[#375534] dark:text-gray-300">Soporte técnico continuo</p>
            </Card>
            
            <Card className="relative p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-0 rounded-2xl bg-[#6B9071] dark:bg-gray-600">
              <BorderBeam size={50} duration={10} delay={2} colorFrom="#AEC3B0" colorTo="#E3EED4" />
              <div className="text-4xl font-bold mb-2 text-[#E3EED4] dark:text-white">
                <NumberTicker value={99} />
                <span className="text-2xl">.9%</span>
              </div>
              <h3 className="font-semibold mb-1 text-[#E3EED4] dark:text-white">Precisión Garantizada</h3>
              <p className="text-sm text-[#AEC3B0] dark:text-gray-200">Análisis de datos confiables</p>
            </Card>
            
            <Card className="relative p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-0 rounded-2xl bg-[#375534] dark:bg-gray-800">
              <BorderBeam size={50} duration={10} delay={4} colorFrom="#6B9071" colorTo="#AEC3B0" />
              <div className="text-4xl font-bold mb-2 text-[#E3EED4] dark:text-white">
                <NumberTicker value={15} />
                <span className="text-2xl">+</span>
              </div>
              <h3 className="font-semibold mb-1 text-[#E3EED4] dark:text-white">Módulos Especializados</h3>
              <p className="text-sm text-[#AEC3B0] dark:text-gray-300">Herramientas profesionales</p>
            </Card>
          </div>

          {/* Módulos Empresariales */}
          <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="group rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105 bg-[#AEC3B0] dark:bg-gray-700">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full p-3 transition-colors bg-[#375534] dark:bg-gray-600">
                  <svg className="h-6 w-6 text-[#E3EED4] dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="font-semibold mb-2 text-[#0F2A1D] dark:text-white">Asistente IA Especializado</h3>
              <p className="text-sm text-[#375534] dark:text-gray-300">Consultoría técnica 24/7 con Google Gemini 2.5</p>
            </div>
            
            <div className="group rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105 bg-[#6B9071] dark:bg-gray-600">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full p-3 transition-colors bg-[#0F2A1D] dark:bg-gray-800">
                  <svg className="h-6 w-6 text-[#E3EED4] dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <h3 className="font-semibold mb-2 text-[#E3EED4] dark:text-white">Analytics Avanzado</h3>
              <p className="text-sm text-[#AEC3B0] dark:text-gray-200">Dashboard empresarial con métricas en tiempo real</p>
            </div>
            
            <div className="group rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105 bg-[#375534] dark:bg-gray-800">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full p-3 transition-colors bg-[#6B9071] dark:bg-gray-600">
                  <svg className="h-6 w-6 text-[#E3EED4] dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                </div>
              </div>
              <h3 className="font-semibold mb-2 text-[#E3EED4] dark:text-white">Monitoreo Climático</h3>
              <p className="text-sm text-[#AEC3B0] dark:text-gray-300">Integración meteorológica con alertas predictivas</p>
            </div>
            
            <div className="group rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105 bg-[#0F2A1D] dark:bg-gray-900">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full p-3 transition-colors bg-[#6B9071] dark:bg-gray-600">
                  <svg className="h-6 w-6 text-[#E3EED4] dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
              </div>
              <h3 className="font-semibold mb-2 text-[#E3EED4] dark:text-white">Gestión de Recursos</h3>
              <p className="text-sm text-[#AEC3B0] dark:text-gray-300">Optimización automática de riego y fertilización</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
