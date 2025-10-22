
'use client'

import Link from 'next/link'
import { Menu, X } from "lucide-react"
import { useState } from 'react'
import { AnimatedThemeToggler } from '../ui/animated-theme-toggler'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigationLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Características', href: '#features' },
    { name: 'Módulos', href: '#modules' },
    { name: 'Contacto', href: '#contact' },
  ]

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-all duration-300 bg-[rgba(15,42,29,0.9)] dark:bg-[rgba(30,30,30,0.9)] border-b-[rgba(107,144,113,0.2)] dark:border-b-[rgba(156,163,175,0.2)]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo y nombre */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#6B9071] dark:bg-[#4F7942]">
                <svg className="w-6 h-6 text-[#E3EED4] dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#E3EED4] dark:text-white">
                  RaXiBot
                </h1>
                <p className="text-xs text-[#AEC3B0] dark:text-gray-300">
                  Sistema Agrícola IA
                </p>
              </div>
            </Link>
          </div>

          {/* Navegación desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium transition-colors hover:scale-105 duration-200 text-[#AEC3B0] dark:text-gray-300 hover:text-[#E3EED4] dark:hover:text-white"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Controles de la derecha */}
          <div className="flex items-center space-x-4">
            
            {/* Toggle de tema animado */}
            <AnimatedThemeToggler 
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 bg-[rgba(107,144,113,0.2)] dark:bg-[rgba(75,85,99,0.3)] text-[#E3EED4] dark:text-white hover:bg-[rgba(107,144,113,0.3)] dark:hover:bg-[rgba(75,85,99,0.5)]"
              duration={500}
            />

            {/* Botón de acceso */}
            <Link href="/auth">
              <button className="hidden md:block px-6 py-2 text-sm font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg bg-[#6B9071] dark:bg-[#4F7942] text-[#E3EED4] dark:text-white hover:bg-[#5A7F61] dark:hover:bg-[#3F6235]">
                Acceder
              </button>
            </Link>

            {/* Menú móvil */}
            <button
              className="md:hidden w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 bg-[rgba(107,144,113,0.2)] dark:bg-[rgba(75,85,99,0.3)] text-[#E3EED4] dark:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Menú móvil expandido */}
        {isMenuOpen && (
          <div className="md:hidden border-t mt-2 pt-4 pb-4 space-y-4 border-t-[rgba(107,144,113,0.2)] dark:border-t-[rgba(156,163,175,0.2)]">
            {navigationLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block text-sm font-medium transition-colors py-2 text-[#AEC3B0] dark:text-gray-300 hover:text-[#E3EED4] dark:hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link href="/auth" onClick={() => setIsMenuOpen(false)}>
              <button className="w-full mt-4 px-6 py-3 text-sm font-semibold rounded-full transition-all duration-300 bg-[#6B9071] dark:bg-[#4F7942] text-[#E3EED4] dark:text-white">
                Acceder
              </button>
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
