'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface HyperTextProps {
  text: string
  className?: string
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

export const HyperText = ({ text, className = '' }: HyperTextProps) => {
  const [displayText, setDisplayText] = useState(text)

  useEffect(() => {
    let currentIndex = 0
    const finalText = text
    const duration = 50 // Duración de cada cambio en ms
    const scrambleLength = 2 // Número de veces que se mezcla cada letra

    const scrambleText = () => {
      if (currentIndex >= finalText.length * scrambleLength) {
        setDisplayText(finalText)
        clearInterval(interval)
        return
      }

      const newText = finalText.split('').map((char, index) => {
        if (index < currentIndex / scrambleLength) {
          return finalText[index]
        }
        return CHARS[Math.floor(Math.random() * CHARS.length)]
      }).join('')

      setDisplayText(newText)
      currentIndex++
    }

    const interval: NodeJS.Timeout = setInterval(scrambleText, duration)
    return () => clearInterval(interval)
  }, [text])

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {displayText}
    </motion.span>
  )
}
