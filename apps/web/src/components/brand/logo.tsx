import Image from 'next/image'

/*
 * Logo officiel Cognix, recomposé depuis les calques du splash de l'app
 * (apps/mobile/assets/splash-layers) : public/brand/cognix-{emblem,wordmark}.png
 * pour fond clair (parties blanches passées en navy), *-dark.png pour fond
 * sombre (couleurs d'origine).
 */

/** Emblème seul : le C, le cerveau et le livre. */
export function LogoMark({
  className = 'h-9 w-8',
  dark = false,
}: {
  className?: string
  dark?: boolean
}) {
  return (
    <span className={`relative inline-block shrink-0 ${className}`}>
      <Image
        src={dark ? '/brand/cognix-emblem-dark.png' : '/brand/cognix-emblem.png'}
        alt=""
        fill
        sizes="64px"
        className="object-contain"
      />
    </span>
  )
}

/** Logo complet : emblème + mot « COGNIX » (X bleu). */
export function Logo({
  dark = false,
  size = 'md',
  className = '',
}: {
  dark?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const mark = { sm: 'h-7 w-6', md: 'h-9 w-8', lg: 'h-12 w-11' }[size]
  const word = { sm: 'h-[14px] w-[86px]', md: 'h-[18px] w-[110px]', lg: 'h-[26px] w-[159px]' }[size]
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark className={mark} dark={dark} />
      <span className={`relative inline-block ${word}`}>
        <Image
          src={dark ? '/brand/cognix-wordmark-dark.png' : '/brand/cognix-wordmark.png'}
          alt="Cognix"
          fill
          sizes="160px"
          className="object-contain object-left"
        />
      </span>
    </span>
  )
}
