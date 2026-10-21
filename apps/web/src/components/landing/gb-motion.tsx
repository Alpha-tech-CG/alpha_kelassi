'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'

/*
 * Animations de la page d'accueil, calquées sur les réglages relevés sur le
 * modèle de référence : apparition en ressort (raideur 450, amortissement 90,
 * montée de 30–40 px), barre de navigation qui descend, cartes empilées en
 * sticky dont l'échelle suit le défilement, notifications qui tournent.
 * Tout élément animé porte `data-motion` (neutralisé sous reduced-motion
 * dans landing.css).
 */

const SPRING = { type: 'spring', stiffness: 450, damping: 90, mass: 1 } as const

/** Apparition au chargement (hero) ou à l'entrée dans le viewport. */
export function Appear({
  children,
  className,
  delay = 0,
  y = 40,
  onLoad = false,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  onLoad?: boolean
  as?: 'div' | 'li' | 'span'
}) {
  const Tag = motion[as]
  const target = { opacity: 1, y: 0, transition: { ...SPRING, delay } }
  return (
    <Tag
      data-motion
      className={className}
      initial={{ opacity: 0, y }}
      {...(onLoad
        ? { animate: target }
        : { whileInView: target, viewport: { once: true, margin: '0px 0px -10% 0px' } })}
    >
      {children}
    </Tag>
  )
}

/** Barre de navigation qui descend au chargement. */
export function NavDrop({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.header
      data-motion
      className={className}
      initial={{ y: -100 }}
      animate={{ y: 0, transition: { type: 'spring', stiffness: 250, damping: 40, delay: 0.2 } }}
    >
      {children}
    </motion.header>
  )
}

/**
 * Carte de fonctionnalité empilée : sticky en haut de l'écran, elle grandit
 * de 0,9 à 1 en arrivant, et le téléphone qu'elle porte remonte en place.
 */
export function StackCard({
  children,
  phone,
  className,
}: {
  children: ReactNode
  phone: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 45px'] })
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1])
  const y = useTransform(scrollYProgress, [0, 1], [80, 0])
  const phoneScale = useTransform(scrollYProgress, [0, 1], [1.1, 1])
  // Empilement sticky à partir de la tablette ; sur mobile, les cartes se suivent.
  return (
    <div ref={ref} className="pt-10 md:sticky md:top-[45px] md:h-[640px] md:pt-28 md:last:h-auto">
      <motion.div data-motion style={{ scale, y }} className={className}>
        {children}
        <motion.div data-motion style={{ y, scale: phoneScale }} className="pointer-events-none">
          {phone}
        </motion.div>
      </motion.div>
    </div>
  )
}

/** Trois notifications empilées qui tournent (étape 3). */
export function NotificationStack({
  items,
}: {
  items: { title: string; meta: string; value: string; tone: 'good' | 'gold' }[]
}) {
  const reduce = useReducedMotion()
  const [front, setFront] = useState(0)
  useEffect(() => {
    if (reduce) return
    const t = setInterval(() => setFront((f) => (f + 1) % items.length), 2600)
    return () => clearInterval(t)
  }, [reduce, items.length])

  return (
    <div className="relative mx-auto h-[170px] w-full max-w-[300px]">
      {items.map((it, i) => {
        const depth = (i - front + items.length) % items.length
        return (
          <motion.div
            key={it.title}
            data-motion
            className="absolute inset-x-0 top-[70px] flex items-center gap-3 rounded-2xl bg-white px-4 py-3.5 shadow-[0_8px_30px_rgba(15,27,45,0.12)]"
            animate={{
              y: depth * -30,
              scale: 1 - depth * 0.07,
              opacity: 1 - depth * 0.25,
              zIndex: 10 - depth,
            }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
          >
            <span className="bg-cx-blue text-white flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold">
              {it.tone === 'good' ? '✓' : '★'}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-cx-navy truncate text-sm font-semibold">{it.title}</p>
              <p className="text-cx-navy/60 text-[11px]">{it.meta}</p>
            </div>
            <span
              className={`text-sm font-bold ${it.tone === 'good' ? 'text-cx-blue' : 'text-amber-600'}`}
            >
              {it.value}
            </span>
          </motion.div>
        )
      })}
    </div>
  )
}

/** Courbe de progression qui se dessine à l'entrée dans le viewport. */
export function ProgressLine() {
  return (
    <svg viewBox="0 0 220 90" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="gbFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#1E74E8" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#1E74E8" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        data-motion
        d="M4 78 L30 70 L52 74 L76 58 L98 62 L120 44 L142 48 L166 30 L190 34 L216 12 L216 90 L4 90 Z"
        fill="url(#gbFill)"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.6 }}
      />
      <motion.path
        data-motion
        d="M4 78 L30 70 L52 74 L76 58 L98 62 L120 44 L142 48 L166 30 L190 34 L216 12"
        fill="none"
        stroke="#1E74E8"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  )
}
