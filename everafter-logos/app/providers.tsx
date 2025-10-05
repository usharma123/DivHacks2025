'use client'

import React from 'react'
import { EchoProvider } from '@merit-systems/echo-next-sdk/client'
import { ThemeProvider } from '@/components/theme-provider'

const appId = process.env.NEXT_PUBLIC_ECHO_APP_ID!

if (!appId) {
  throw new Error('NEXT_PUBLIC_ECHO_APP_ID environment variable is required')
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <EchoProvider config={{ appId }}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </EchoProvider>
  )
}


