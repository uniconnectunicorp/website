'use client'

import dynamic from 'next/dynamic'

const WelcomePopup = dynamic(() => import('@/components/ui/WelcomePopup'), {
  ssr: false,
})

export default function LazyWelcomePopup() {
  return <WelcomePopup />
}
