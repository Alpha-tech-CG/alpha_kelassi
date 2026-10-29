import { useEffect, useState } from 'react'
import NetInfo from '@react-native-community/netinfo'

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected ?? true)
    })
    // Teardown explicite : le listener NetInfo est retiré au démontage,
    // sinon il retient le setState d'un composant déjà disparu.
    return () => { unsubscribe() }
  }, [])

  return { isOnline }
}
