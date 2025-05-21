import { useEffect, useState } from 'react'
import { listarSonhos } from '../libs/db'
import { type Sonho } from '../types/Sonho'

export function useSonhos() {
  const [historico, setHistorico] = useState<Sonho[]>([])

  useEffect(() => {
    listarSonhos().then(setHistorico)
  }, [])

  return { historico, setHistorico }
}
