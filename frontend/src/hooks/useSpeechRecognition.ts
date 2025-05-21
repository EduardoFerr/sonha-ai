import { useEffect, useRef, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { SpeechRecognition } from '@capacitor-community/speech-recognition'

/**
 * Declarações globais necessárias para a API Web Speech
 */
declare global {
  interface Window {
    webkitSpeechRecognition: any
    SpeechRecognition: any
  }

  interface SpeechRecognitionEvent extends Event {
    readonly results: SpeechRecognitionResultList
    readonly resultIndex: number // 👈 adicione isso
  }
}


/**
 * Hook React para reconhecimento de voz (Web/Android/iOS)
 */
export function useSpeechRecognition() {
  const [gravando, setGravando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [texto, setTexto] = useState('')

  const recognitionRef = useRef<any>(null)
  const gravandoRef = useRef(false)
  const partialListenerRef = useRef<any>(null)
  const platform = Capacitor.getPlatform()

  useEffect(() => {
    if (platform !== 'web') return
    if (recognitionRef.current) return

    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognitionClass) {
      setErro('Reconhecimento de voz não suportado no navegador.')
      return
    }

    const recognition = new SpeechRecognitionClass()
    recognition.lang = 'pt-BR'
    recognition.continuous = true
    recognition.interimResults = true

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      const txt = Array.from(e.results)
        .map(r => r[0].transcript)
        .join(' ');

      setTexto(txt)
    }

    recognition.onerror = (e: any) => {
      setErro('Erro no reconhecimento de voz: ' + e.error)
    }

    recognitionRef.current = recognition
  }, [])

  const start = async () => {
    setErro(null)
    setTexto('')

    if (platform === 'android' || platform === 'ios') {
      const { speechRecognition } = await SpeechRecognition.requestPermissions()
      if (speechRecognition !== 'granted') {
        setErro('Permissão negada para usar o microfone.')
        return
      }

      await SpeechRecognition.start({
        language: 'pt-BR',
        partialResults: true,
        popup: false,
      })

      if (partialListenerRef.current) {
        await partialListenerRef.current.remove()
        partialListenerRef.current = null
      }

      partialListenerRef.current = await SpeechRecognition.addListener(
        'partialResults',
        (data: { matches: string[] }) => {
          if (data.matches?.length) {
            setTexto((prev) => `${prev} ${data.matches[0]}`.trim())
          }
        }
      )
    } else {
      try {
        const permissionStatus = await navigator.permissions?.query({
          name: 'microphone' as PermissionName,
        })
        if (permissionStatus?.state === 'denied') {
          setErro('Permissão de microfone negada pelo navegador.')
          return
        }
        recognitionRef.current?.start()
      } catch (e) {
        setErro('Erro ao acessar o microfone.')
      }
    }

    setGravando(true)
    gravandoRef.current = true
  }

  const stop = async () => {
    if (platform === 'android' || platform === 'ios') {
      await SpeechRecognition.stop()
      if (partialListenerRef.current) {
        await partialListenerRef.current.remove()
        partialListenerRef.current = null
      }
      await SpeechRecognition.removeAllListeners()
    } else {
      recognitionRef.current?.stop?.()
    }

    setGravando(false)
    gravandoRef.current = false
  }

  return {
    texto,
    erro,
    gravando,
    start,
    stop,
    setTexto, 
  }
}

