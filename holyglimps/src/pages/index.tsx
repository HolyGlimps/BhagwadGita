import Image from 'next/image'
import { Inter } from 'next/font/google'
import Navbar from './components/Navbar';
import React from 'react';

import Homepage from './Home'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >

      <p>Hello world Test </p>

    </main>
  )
}
