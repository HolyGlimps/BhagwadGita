import '@/styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import {RecoilRoot} from 'recoil'
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <RecoilRoot>

   
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
    </RecoilRoot>
  )
}

