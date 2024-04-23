"use client"

import * as React from "react"
import { ReactLenis } from "@studio-freight/react-lenis"

interface SmoothScrollProviderProps {
  children: React.ReactNode
}

export function SmoothScrollProvider({
  children,
}: Readonly<SmoothScrollProviderProps>) {
  return (
    <ReactLenis root options={{ lerp: 0.2, duration: 1.2, syncTouch: true }}>
      {children}
    </ReactLenis>
  )
}
