import { useState } from 'react'
import { useSpeechRecognition } from './hooks/useSpeechRecognition'
import { useSonhos } from './hooks/useSonhos'
import { SonhoForm } from './components/SonhoForm'
import { SonhoHistorico } from './components/SonhoHistorico'
import { useSonhoService } from './services/useSonhoService'
import { DarkModeToggle } from './components/DarkModeToggle'

import './App.css'

export default function App() {
  const hojeISO = new Date().toISOString().split('T')[0]
  const [dataSelecionada, setDataSelecionada] = useState(hojeISO)

  const { historico, setHistorico } = useSonhos()
  const { texto, setTexto, gravando, erro, start, stop } = useSpeechRecognition()
  const { salvarESincronizarSonho } = useSonhoService(setHistorico)

  const toggleMic = () => (gravando ? stop() : start())

  const enviarSonho = async () => {
    await salvarESincronizarSonho(dataSelecionada, texto)
  }

  const sonhoAtual = historico.find((s) => s.data === dataSelecionada)

  return (
      <main className="p-8 max-w-xl mx-auto space-y-4 bg-white text-black dark:bg-black dark:text-white">
      <DarkModeToggle />
        <h1 className="text-2xl font-bold">SonhAI</h1>
        <h2 className="text-lg text-gray-600 dark:text-gray-300">Diário de Sonhos</h2>

        {erro && <div className="text-red-600 dark:text-red-400">{erro}</div>}

        <SonhoForm
          data={dataSelecionada}
          setData={setDataSelecionada}
          texto={texto}
          setTexto={setTexto}
          gravando={gravando}
          toggleMic={toggleMic}
          onSubmit={enviarSonho}
        />

        {sonhoAtual && <SonhoHistorico sonho={sonhoAtual} onAtualizar={setHistorico} />}
      </main>
  )
}
