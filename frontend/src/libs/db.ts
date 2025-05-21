import { type Sonho } from '../types/Sonho'


let db: IDBDatabase | null = null

function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (db) return resolve(db)

    const request = indexedDB.open('sonhai', 1)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      db = request.result
      resolve(db)
    }
    request.onupgradeneeded = () => {
      const store = request.result.createObjectStore('sonhos', { keyPath: 'id', autoIncrement: true })
      store.createIndex('data', 'data')
    }
  })
}

export async function salvarSonho(sonho: Sonho) {
  const database = await initDB()
  const tx = database.transaction('sonhos', 'readwrite')
  tx.objectStore('sonhos').put(sonho)
  return tx.oncomplete
}

export async function listarSonhos(): Promise<Sonho[]> {
  const database = await initDB()
  const tx = database.transaction('sonhos', 'readonly')
  const req = tx.objectStore('sonhos').getAll()
  return new Promise((resolve) => (req.onsuccess = () => resolve(req.result)))
}

export async function deletarSonho(id: number) {
  const database = await initDB()
  const tx = database.transaction('sonhos', 'readwrite')
  tx.objectStore('sonhos').delete(id)
  return tx.oncomplete
}

export async function atualizarFavorito(id: number, favorito: boolean) {
  const database = await initDB()
  const tx = database.transaction('sonhos', 'readwrite')
  const store = tx.objectStore('sonhos')
  const sonho = await new Promise<Sonho>((resolve) => {
    const req = store.get(id)
    req.onsuccess = () => resolve(req.result)
  })
  if (sonho) {
    sonho.favorito = favorito
    store.put(sonho)
  }
  return tx.oncomplete
}
