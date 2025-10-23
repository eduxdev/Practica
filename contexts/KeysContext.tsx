'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface KeyPair {
  userName: string
  publicKey: string
  privateKey: string
  generated: string
}

interface KeysContextType {
  currentKeys: KeyPair | null
  setCurrentKeys: (keys: KeyPair | null) => void
  saveKeysToStorage: (keys: KeyPair) => void
  loadKeysFromStorage: () => KeyPair | null
  clearKeys: () => void
}

const KeysContext = createContext<KeysContextType | undefined>(undefined)

export function KeysProvider({ children }: { children: React.ReactNode }) {
  const [currentKeys, setCurrentKeysState] = useState<KeyPair | null>(null)

  // Cargar claves del localStorage al inicializar
  useEffect(() => {
    const savedKeys = loadKeysFromStorage()
    if (savedKeys) {
      setCurrentKeysState(savedKeys)
    }
  }, [])

  const setCurrentKeys = (keys: KeyPair | null) => {
    setCurrentKeysState(keys)
    if (keys) {
      saveKeysToStorage(keys)
    } else {
      clearKeys()
    }
  }

  const saveKeysToStorage = (keys: KeyPair) => {
    try {
      localStorage.setItem('userKeys', JSON.stringify(keys))
    } catch (error) {
      console.error('Error guardando claves:', error)
    }
  }

  const loadKeysFromStorage = (): KeyPair | null => {
    try {
      const savedKeys = localStorage.getItem('userKeys')
      if (savedKeys) {
        return JSON.parse(savedKeys)
      }
    } catch (error) {
      console.error('Error cargando claves:', error)
    }
    return null
  }

  const clearKeys = () => {
    try {
      localStorage.removeItem('userKeys')
      setCurrentKeysState(null)
    } catch (error) {
      console.error('Error limpiando claves:', error)
    }
  }

  return (
    <KeysContext.Provider value={{
      currentKeys,
      setCurrentKeys,
      saveKeysToStorage,
      loadKeysFromStorage,
      clearKeys
    }}>
      {children}
    </KeysContext.Provider>
  )
}

export function useKeys() {
  const context = useContext(KeysContext)
  if (context === undefined) {
    throw new Error('useKeys debe ser usado dentro de un KeysProvider')
  }
  return context
}
