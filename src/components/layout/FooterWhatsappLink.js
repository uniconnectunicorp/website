'use client'

import { handleWhatsappClick } from './Whatsapp'

export default function FooterWhatsappLink({ children, className }) {
  return (
    <a
      href="#"
      className={className}
      onClick={(e) => {
        e.preventDefault()
        handleWhatsappClick()
      }}
    >
      {children}
    </a>
  )
}
