import Image from 'next/image'
import { Inter } from 'next/font/google'
import React from 'react';
import Homepage from './Home';
import Providers from "../components/providers";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Providers>
        <Homepage />
      </Providers>
    </>
  )
}