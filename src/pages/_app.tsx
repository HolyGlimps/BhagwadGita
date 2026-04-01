import '@/styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import { RecoilRoot } from 'recoil'
import Providers from '@/components/providers'
import Navbar from '@/components/Navbar'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <Providers>
      <RecoilRoot>
        <SessionProvider session={session}>
          <Navbar />
          <Component {...pageProps} />
        </SessionProvider>
      </RecoilRoot>
    </Providers>
  )
}