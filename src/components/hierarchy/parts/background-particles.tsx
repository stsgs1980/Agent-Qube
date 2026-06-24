'use client'
import React, { useRef, useEffect } from 'react'

interface Contour { cx: number; cy: number; rings: number[]; opacity: number; pulse: number; pulseDir: number }

function initContours(canvas: HTMLCanvasElement): { contours: Contour[]; markers: Array<{ x: number; y: number }> } {
  const contours: Contour[] = []
  const markers: Array<{ x: number; y: number }> = []
  for (let i = 0; i < 5; i++) {
    const ringCount = 4 + Math.floor(Math.random() * 3)
    const baseSize = 40 + Math.random() * 60
    const rings: number[] = []
    for (let r = 0; r < ringCount; r++) rings.push(baseSize + r * (15 + Math.random() * 10))
    contours.push({ cx: Math.random() * canvas.width, cy: Math.random() * canvas.height, rings, opacity: 0.08 + Math.random() * 0.12, pulse: 0, pulseDir: Math.random() > 0.5 ? 1 : -1 })
  }
  for (let i = 0; i < 25; i++) markers.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height })
  return { contours, markers }
}

function drawFrame(ctx: CanvasRenderingContext2D, contours: Contour[], markers: Array<{ x: number; y: number }>, canvasW: number, canvasH: number) {
  ctx.clearRect(0, 0, canvasW, canvasH)
  for (const m of markers) {
ctx.strokeStyle = 'rgba(51, 51, 51, 0.3)'
    ctx.lineWidth = 0.8
    ctx.beginPath()
    ctx.moveTo(m.x - 3, m.y)
    ctx.lineTo(m.x + 3, m.y)
    ctx.moveTo(m.x, m.y - 3)
    ctx.lineTo(m.x, m.y + 3)
    ctx.stroke()
  }
  for (const c of contours) {
    c.pulse += 0.003 * c.pulseDir
    if (c.pulse > 1 || c.pulse < -1) c.pulseDir *= -1
    const currentOpacity = c.opacity + c.pulse * 0.06
    for (let ri = 0; ri < c.rings.length; ri++) {
      const baseR = c.rings[ri]
      ctx.beginPath()
      const segments = 48
      for (let s = 0; s <= segments; s++) {
        const angle = (2 * Math.PI * s) / segments
        const irregularity = Math.sin(angle * 3 + ri * 0.5) * baseR * 0.08 + Math.sin(angle * 5 + ri * 1.2) * baseR * 0.04 + Math.cos(angle * 2 + ri * 0.8) * baseR * 0.06
        const r = baseR + irregularity
        const px = c.cx + Math.cos(angle) * r
        const py = c.cy + Math.sin(angle) * r * 0.85
        if (s === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
      ctx.strokeStyle = `rgba(6, 182, 212, ${currentOpacity * (1 - ri * 0.12)})`
      ctx.lineWidth = 0.6
      ctx.stroke()
    }
  }
}

export function BackgroundParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const contoursRef = useRef<Contour[]>([])
  const markersRef = useRef<Array<{ x: number; y: number }>>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)
    if (contoursRef.current.length === 0) {
      const { contours, markers } = initContours(canvas)
      contoursRef.current = contours
      markersRef.current = markers
    }
    const animate = () => {
      drawFrame(ctx, contoursRef.current, markersRef.current, canvas.width, canvas.height)
      animationRef.current = requestAnimationFrame(animate)
    }
    animate()
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-0" style={{ width: '100%', height: '100%' }} />
}