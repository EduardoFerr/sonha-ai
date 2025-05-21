import { interpretarSonho } from './interpretadorService'
import { salvarSonho, listarSonhos } from '../libs/db'
import { type Sonho } from '../types/Sonho'

export function useSonhoService(setHistorico: (sonhos: Sonho[]) => void) {
  const salvarESincronizarSonho = async (data: string, texto: string) => {
    const interpretado = await interpretarSonho(texto)

    await salvarSonho({
      data,
      texto,
      interpretacao: interpretado,
      favorito: false,
    })

    const lista = await listarSonhos()
    setHistorico(lista)
  }

  return { salvarESincronizarSonho }
}
