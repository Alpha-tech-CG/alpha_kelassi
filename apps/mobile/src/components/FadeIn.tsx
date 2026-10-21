import { useEffect, useRef, type ReactNode } from 'react'
import { Animated, Easing, type StyleProp, type ViewStyle } from 'react-native'

/**
 * Apparition douce d'un bloc à l'ouverture d'un écran : fondu + légère montée.
 * `delay` permet d'enchaîner plusieurs blocs (effet « cascade »).
 */
export function FadeIn({
  children,
  delay = 0,
  distance = 16,
  style,
}: {
  children: ReactNode
  delay?: number
  distance?: number
  style?: StyleProp<ViewStyle>
}) {
  const v = useRef(new Animated.Value(0)).current
  useEffect(() => {
    const anim = Animated.timing(v, {
      toValue: 1,
      duration: 420,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    })
    anim.start()
    return () => anim.stop()
  }, [v, delay])
  return (
    <Animated.View
      style={[
        style,
        {
          opacity: v,
          transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [distance, 0] }) }],
        },
      ]}
    >
      {children}
    </Animated.View>
  )
}
