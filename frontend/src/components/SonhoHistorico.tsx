
import { atualizarFavorito, deletarSonho, listarSonhos } from '../libs/db'
import { type Sonho } from '../types/Sonho'

interface Props {
  sonho: Sonho
  onAtualizar: (sonhos: Sonho[]) => void
}

export function SonhoHistorico({ sonho, onAtualizar }: Props) {
  const atualizar = async () => {
    const lista = await listarSonhos()
    onAtualizar(lista)
  }

  return (
    <div className="mt-4 p-4 border rounded bg-gray-100 dark:bg-gray-800 dark:border-gray-700 space-y-2">
      <p className="italic text-sm text-gray-800 dark:text-gray-200">{sonho.texto}</p>
      <p className="text-gray-900 dark:text-gray-100">
        <strong>Interpretação:</strong> {sonho.interpretacao}
      </p>
      <div className="flex gap-2 text-sm">
        <button
          onClick={async () => {
            await atualizarFavorito(sonho.id!, !sonho.favorito)
            atualizar()
          }}
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Favorito ⭐
        </button>
        <button
          onClick={async () => {
            await deletarSonho(sonho.id!)
            atualizar()
          }}
          className="text-red-600 dark:text-red-400 hover:underline"
        >
          Excluir 🗑️
        </button>
      </div>
    </div>
  )
}
