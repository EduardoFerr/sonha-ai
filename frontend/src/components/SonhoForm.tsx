interface SonhoFormProps {
  data: string
  setData: (value: string) => void
  texto: string
  setTexto: (value: string) => void
  gravando: boolean
  toggleMic: () => void
  onSubmit: () => void
}

export function SonhoForm({
  data,
  setData,
  texto,
  setTexto,
  gravando,
  toggleMic,
  onSubmit,
}: SonhoFormProps) {
  const alterarData = (delta: number) => {
    const novaData = new Date(data + 'T00:00')
    novaData.setDate(novaData.getDate() + delta)
    setData(novaData.toISOString().split('T')[0])
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-center items-center">
        <button
          onClick={() => alterarData(-1)}
          className="text-xl dark:text-white px-4 py-2"
        >
          ◀
        </button>

        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="border rounded p-1 text-center dark:bg-gray-800 dark:text-white dark:border-gray-600"
        />

        <button
          onClick={() => alterarData(1)}
          className="text-xl dark:text-white px-4 py-2"
        >
          ▶
        </button>
      </div>

      <textarea
        className="w-full h-40 p-2 border rounded bg-white text-black dark:bg-gray-900 dark:text-white dark:border-gray-700"
        placeholder="Descreva seu sonho..."
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
      />

      <div className="flex gap-4">
        <button
          onClick={toggleMic}
          className={`flex-1 px-4 py-2 text-white rounded ${gravando
              ? 'bg-red-600 dark:bg-red-500'
              : 'bg-gray-600 dark:bg-gray-700'
            }`}
        >
          {gravando ? 'Gravando… 🎙️' : 'Falar'}
        </button>

        <button
          onClick={onSubmit}
          disabled={!texto.trim()}
          className="flex-1 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Interpretar 🧠
        </button>
      </div>
    </div>
  )
}
