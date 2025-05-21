const url = import.meta.env.VITE_API_URL

export async function interpretarSonho(texto: string): Promise<string> {
  const res = await fetch(`${url}/interpretar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ texto }),
  })
  const data = await res.json()
  return data.interpretacao ?? 'Sem interpretação.'
}