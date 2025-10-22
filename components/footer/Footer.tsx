'use client'

import Link from 'next/link'
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const navigationLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Características', href: '#features' },
    { name: 'Módulos', href: '#modules' },
    { name: 'Precios', href: '#pricing' },
    { name: 'Contacto', href: '#contact' },
  ]

  const serviceLinks = [
    { name: 'Asistente IA', href: '#ai-assistant' },
    { name: 'Analytics', href: '#analytics' },
    { name: 'Monitoreo Climático', href: '#weather' },
    { name: 'Gestión de Recursos', href: '#resources' },
    { name: 'Soporte Técnico', href: '#support' },
  ]

  const legalLinks = [
    { name: 'Términos de Servicio', href: '#terms' },
    { name: 'Política de Privacidad', href: '#privacy' },
    { name: 'Cookies', href: '#cookies' },
    { name: 'Documentación', href: '#docs' },
  ]

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#facebook' },
    { name: 'Twitter', icon: Twitter, href: '#twitter' },
    { name: 'Instagram', icon: Instagram, href: '#instagram' },
    { name: 'LinkedIn', icon: Linkedin, href: '#linkedin' },
    { name: 'GitHub', icon: Github, href: '#github' },
  ]

  return (
    <footer className="bg-[#0F2A1D] dark:bg-gray-900 text-[#E3EED4] dark:text-gray-200 transition-colors duration-300">
      
      {/* Sección principal del footer */}
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          
          {/* Grid principal */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 md:grid-cols-2">
            
            {/* Columna de información de la empresa */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#6B9071] dark:bg-[#4F7942]">
                  <svg className="w-7 h-7 text-[#E3EED4] dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#E3EED4] dark:text-white">
                    RaXiBot
                  </h3>
                  <p className="text-sm text-[#AEC3B0] dark:text-gray-300">
                    Sistema Agrícola IA
                  </p>
                </div>
              </div>
              
              <p className="text-sm leading-relaxed text-[#AEC3B0] dark:text-gray-300 mb-6">
                Revolucionamos la agricultura moderna con inteligencia artificial avanzada, 
                proporcionando herramientas especializadas para optimizar la gestión agrícola.
              </p>
              
              {/* Redes sociales */}
              <div>
                <h5 className="text-sm font-semibold mb-4 text-[#E3EED4] dark:text-white">
                  Síguenos
                </h5>
                <div className="flex space-x-3">
                  {socialLinks.map((social) => {
                    const Icon = social.icon
                    return (
                      <Link
                        key={social.name}
                        href={social.href}
                        className="w-9 h-9 rounded-full flex items-center justify-center bg-[rgba(107,144,113,0.2)] dark:bg-[rgba(75,85,99,0.3)] text-[#E3EED4] dark:text-white hover:bg-[#6B9071] dark:hover:bg-[#4F7942] transition-all duration-300 hover:scale-110"
                        aria-label={social.name}
                      >
                        <Icon className="w-4 h-4" />
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Columna de navegación */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-[#E3EED4] dark:text-white">
                Navegación
              </h4>
              <ul className="space-y-3">
                {navigationLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#AEC3B0] dark:text-gray-300 hover:text-[#E3EED4] dark:hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block transform"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Columna de contacto */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-[#E3EED4] dark:text-white">
                Contacto
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-[#6B9071] dark:text-[#7FA085] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-[#E3EED4] dark:text-white">Email</p>
                    <a 
                      href="mailto:contacto@raxibot.com" 
                      className="text-sm text-[#AEC3B0] dark:text-gray-300 hover:text-[#E3EED4] dark:hover:text-white transition-colors duration-200"
                    >
                      contacto@raxibot.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-[#6B9071] dark:text-[#7FA085] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-[#E3EED4] dark:text-white">Teléfono</p>
                    <a 
                      href="tel:+1234567890" 
                      className="text-sm text-[#AEC3B0] dark:text-gray-300 hover:text-[#E3EED4] dark:hover:text-white transition-colors duration-200"
                    >
                      +123 456 7890
                    </a>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-[#6B9071] dark:text-[#7FA085] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-[#E3EED4] dark:text-white">Ubicación</p>
                    <p className="text-sm text-[#AEC3B0] dark:text-gray-300">
                      Ciudad, País
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Columna de servicios 
            <div>
              <h4 className="text-lg font-semibold mb-6 text-[#E3EED4] dark:text-white">
                Servicios
              </h4>
              <ul className="space-y-3">
                {serviceLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#AEC3B0] dark:text-gray-300 hover:text-[#E3EED4] dark:hover:text-white transition-colors duration-200 hover:translate-x-1 transform"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            */}

            {/* Columna de legal y redes sociales
            <div>
              <h4 className="text-lg font-semibold mb-6 text-[#E3EED4] dark:text-white">
                Legal
              </h4>
              <ul className="space-y-3 mb-8">
                {legalLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#AEC3B0] dark:text-gray-300 hover:text-[#E3EED4] dark:hover:text-white transition-colors duration-200 hover:translate-x-1 transform"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>

              
              <div>
                <h5 className="text-sm font-semibold mb-4 text-[#E3EED4] dark:text-white">
                  Síguenos
                </h5>
                <div className="flex space-x-3">
                  {socialLinks.map((social) => {
                    const Icon = social.icon
                    return (
                      <Link
                        key={social.name}
                        href={social.href}
                        className="w-9 h-9 rounded-full flex items-center justify-center bg-[rgba(107,144,113,0.2)] dark:bg-[rgba(75,85,99,0.3)] text-[#E3EED4] dark:text-white hover:bg-[#6B9071] dark:hover:bg-[#4F7942] transition-all duration-300 hover:scale-110"
                        aria-label={social.name}
                      >
                        <Icon className="w-4 h-4" />
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
            */}
          </div>

          {/* Newsletter */}
          <div className="mt-12 pt-8 border-t border-[rgba(107,144,113,0.2)] dark:border-[rgba(156,163,175,0.2)]">
            <div className="max-w-2xl">
              <h4 className="text-lg font-semibold mb-4 text-[#E3EED4] dark:text-white">
                Mantente actualizado
              </h4>
              <p className="text-sm text-[#AEC3B0] dark:text-gray-300 mb-6">
                Recibe las últimas noticias sobre innovaciones en agricultura inteligente y actualizaciones de RaXiBot.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Tu correo electrónico"
                  className="flex-1 px-4 py-3 rounded-full bg-[rgba(174,195,176,0.1)] dark:bg-[rgba(75,85,99,0.2)] border border-[rgba(107,144,113,0.3)] dark:border-[rgba(156,163,175,0.3)] text-[#E3EED4] dark:text-white placeholder-[#AEC3B0] dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6B9071] dark:focus:ring-[#7FA085] focus:border-transparent transition-all duration-200"
                />
                <button className="px-8 py-3 bg-[#6B9071] dark:bg-[#4F7942] text-[#E3EED4] dark:text-white font-semibold rounded-full hover:bg-[#5A7F61] dark:hover:bg-[#3F6235] transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  Suscribirse
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="border-t border-[rgba(107,144,113,0.2)] dark:border-[rgba(156,163,175,0.2)] bg-[rgba(15,42,29,0.5)] dark:bg-[rgba(17,24,39,0.8)]">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              
              {/* Copyright */}
              <div className="text-sm text-[#AEC3B0] dark:text-gray-400">
                © {currentYear} RaXiBot. Todos los derechos reservados.
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
