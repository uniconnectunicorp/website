'use client'

import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'

const WhatsappFloat = dynamic(() => import('@/components/layout/Whatsapp'), {
  ssr: false,
})

const ToastProvider = dynamic(() => import('@/components/client/ToastProvider'), {
  ssr: false,
})

const WelcomePopup = dynamic(() => import('@/components/ui/WelcomePopup'), {
  ssr: false,
})

export default function ClientOverlays() {
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  return (
    <>
      <WhatsappFloat />
      <ToastProvider />
      {isHomePage && <WelcomePopup />}
    </>
  )
}
