'use client'

import Script from 'next/script'

export default function GTM() {
  return (
    <Script
      src="https://www.googletagmanager.com/gtm.js?id=GTM-KXQRLLCL"
      strategy="afterInteractive"
    />
  )
}
