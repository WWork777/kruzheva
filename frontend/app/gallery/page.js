'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react'

// ---- Palette (identical to main page) ----
const G     = '#c9a84c'
const GL    = '#e8d080'
const BG    = '#0a1510'
const CARD  = '#111e17'
const W     = '#f5f0e8'
const MUT   = '#8ab09a'
const BDR   = 'rgba(201,168,76,.18)'
const BDR2  = 'rgba(201,168,76,.45)'
const D     = 'var(--font-display, Georgia, serif)'
const B     = 'var(--font-body, system-ui, sans-serif)'

const TG_MSG = 'Здравствуйте! Хочу записаться на индивидуальный пошив в ателье «Кружева». Подскажите, пожалуйста, с чего начать?'
const TG = `https://t.me/to_palto_atelier?text=${encodeURIComponent(TG_MSG)}`

const ALL_PHOTOS = Array.from({ length: 100 }, (_, i) => {
  const n = i + 1
  const name = n === 100 ? 'photo_100.jpg' : `photo_${String(n).padStart(2, '0')}.jpg`
  return { src: `/real/${name}`, id: i }
}).filter(({ id }) => id !== 96) // photo_97 отсутствует

function LaceOrnament({ size = 56, color = G, opacity = 0.7 }) {
  return (
    <svg width={size} height={size * 0.4} viewBox="0 0 140 56" fill="none" style={{ opacity, flexShrink: 0 }} aria-hidden>
      <path d="M2 28 Q20 8, 38 28 T74 28 T110 28 T140 28" stroke={color} strokeWidth="0.8" fill="none"/>
      <path d="M2 28 Q20 48, 38 28 T74 28 T110 28 T140 28" stroke={color} strokeWidth="0.8" fill="none"/>
      <circle cx="38" cy="28" r="2.5" stroke={color} strokeWidth="0.6" fill="none"/>
      <circle cx="74" cy="28" r="3.2" stroke={color} strokeWidth="0.6" fill="none"/>
      <circle cx="110" cy="28" r="2.5" stroke={color} strokeWidth="0.6" fill="none"/>
      <circle cx="74" cy="28" r="1.2" fill={color}/>
    </svg>
  )
}

function LaceBgPattern({ opacity = 0.04 }) {
  return (
    <svg aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity, mixBlendMode: 'screen' }}>
      <defs>
        <pattern id="lace-gallery" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <circle cx="40" cy="40" r="18" stroke={G} strokeWidth="0.5" fill="none"/>
          <circle cx="40" cy="40" r="6" stroke={G} strokeWidth="0.4" fill="none"/>
          <circle cx="0" cy="0" r="12" stroke={G} strokeWidth="0.4" fill="none"/>
          <circle cx="80" cy="0" r="12" stroke={G} strokeWidth="0.4" fill="none"/>
          <circle cx="0" cy="80" r="12" stroke={G} strokeWidth="0.4" fill="none"/>
          <circle cx="80" cy="80" r="12" stroke={G} strokeWidth="0.4" fill="none"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#lace-gallery)"/>
    </svg>
  )
}

// Lazy-loaded gallery item with reveal
function GalleryItem({ src, id, onOpen, index }) {
  const [h, setH] = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: [0.16, 0.84, 0.44, 1], delay: (index % 4) * 0.06 }}
      onClick={() => onOpen(id)}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        breakInside: 'avoid', marginBottom: 8, cursor: 'pointer',
        overflow: 'hidden', position: 'relative',
        border: `1px solid ${h ? BDR2 : BDR}`,
        transition: 'border-color .35s',
        background: CARD,
      }}
    >
      <div style={{ position: 'relative', paddingBottom: '133%', background: CARD }}>
        <img
          src={src}
          alt={`Работа ателье Кружева ${id + 1}`}
          loading="lazy"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%', display: 'block',
            objectFit: 'cover',
            transform: h ? 'scale(1.05)' : 'scale(1)',
            filter: h ? 'brightness(1.08)' : 'brightness(0.88)',
            transition: 'transform 1s cubic-bezier(.2,.8,.2,1), filter .4s',
          }}
        />
      </div>
      {/* Hover overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(10,21,16,.75) 0%, transparent 55%)',
        opacity: h ? 1 : 0, transition: 'opacity .35s',
        display: 'flex', alignItems: 'flex-end', padding: '16px 18px',
      }}>
        <div style={{ width: h ? 32 : 0, height: 1, background: G, transition: 'width .4s', marginRight: 10 }} />
        <span style={{ color: W, fontSize: 11, letterSpacing: '2.5px', textTransform: 'uppercase', fontFamily: B, fontWeight: 500 }}>
          Смотреть
        </span>
      </div>
      {/* Counter badge */}
      <div style={{
        position: 'absolute', top: 12, right: 12,
        background: 'rgba(10,21,16,.7)', backdropFilter: 'blur(6px)',
        border: `1px solid ${BDR}`, padding: '4px 10px',
        color: MUT, fontSize: 10, fontFamily: B, letterSpacing: '1.5px',
        opacity: h ? 1 : 0, transition: 'opacity .3s',
      }}>
        {id + 1}
      </div>
    </motion.div>
  )
}

export default function GalleryPage() {
  const [lightbox, setLightbox] = useState(null)

  const prev = () => setLightbox(i => (i > 0 ? i - 1 : ALL_PHOTOS.length - 1))
  const next = () => setLightbox(i => (i < ALL_PHOTOS.length - 1 ? i + 1 : 0))

  useEffect(() => {
    const onKey = (e) => {
      if (lightbox === null) return
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape') setLightbox(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox])

  return (
    <div style={{ background: BG, minHeight: '100vh', color: W, fontFamily: B, overflowX: 'hidden' }}>

      {/* Sticky header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 200,
        background: 'rgba(10,21,16,.96)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${BDR}`,
        padding: '0 28px', height: 72,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link href="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          color: MUT, textDecoration: 'none', fontSize: 11,
          fontFamily: B, letterSpacing: '2px', textTransform: 'uppercase',
          transition: 'color .3s',
        }}
          onMouseEnter={e => e.currentTarget.style.color = G}
          onMouseLeave={e => e.currentTarget.style.color = MUT}
        >
          <ChevronLeft size={14} strokeWidth={1.6}/> На главную
        </Link>

        <div style={{ color: G, fontSize: 22, fontWeight: 400, letterSpacing: '7px', fontFamily: D, textTransform: 'uppercase', fontStyle: 'italic', lineHeight: 1 }}>
          Кружева
        </div>

        <a href={TG} target="_blank" rel="noopener noreferrer" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '10px 22px', background: `linear-gradient(135deg,${G},#9a7228)`,
          color: BG, fontSize: 11, fontWeight: 500, letterSpacing: '2px',
          textDecoration: 'none', fontFamily: B, textTransform: 'uppercase',
          transition: 'opacity .3s',
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          <Sparkles size={13} strokeWidth={1.6}/>
          Записаться
        </a>
      </div>

      {/* Hero title */}
      <div style={{ position: 'relative', textAlign: 'center', padding: '80px 28px 64px', overflow: 'hidden' }}>
        <LaceBgPattern opacity={0.04}/>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 20 }}
        >
          <div style={{ width: 32, height: 1, background: G }} />
          <span style={{ color: G, fontSize: 10, fontWeight: 500, letterSpacing: '6px', textTransform: 'uppercase', fontFamily: B }}>
            Наши работы
          </span>
          <div style={{ width: 32, height: 1, background: G }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          style={{ marginBottom: 18 }}
        >
          <LaceOrnament size={90} opacity={0.45}/>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 0.84, 0.44, 1] }}
          style={{ fontSize: 'clamp(38px,5.2vw,72px)', fontFamily: D, fontWeight: 300, letterSpacing: '-0.8px', color: W, lineHeight: 1.08, marginBottom: 18 }}
        >
          Галерея <span style={{ color: G, fontStyle: 'italic' }}>мастерства</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{ color: MUT, fontSize: 15, fontFamily: B, fontWeight: 300, letterSpacing: '0.5px' }}
        >
          {ALL_PHOTOS.length} авторских работ · Индивидуальный пошив класса люкс
        </motion.p>
      </div>

      {/* Masonry grid */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 16px 100px', columns: 'auto 280px', gap: 8 }}>
        {ALL_PHOTOS.map(({ src, id }) => (
          <GalleryItem key={id} src={src} id={id} index={id} onOpen={setLightbox} />
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setLightbox(null)}
            style={{
              position: 'fixed', inset: 0, zIndex: 500,
              background: 'rgba(5,12,8,.96)', backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {/* Close */}
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox(null) }}
              style={{
                position: 'absolute', top: 20, right: 24,
                background: 'none', border: `1px solid ${BDR}`,
                color: MUT, cursor: 'pointer', width: 44, height: 44,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'border-color .3s, color .3s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = G; e.currentTarget.style.color = G }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = BDR; e.currentTarget.style.color = MUT }}
            >
              <X size={20} strokeWidth={1.5}/>
            </button>

            {/* Prev */}
            <button
              onClick={(e) => { e.stopPropagation(); prev() }}
              style={{
                position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                background: G, border: 'none', color: BG,
                width: 48, height: 48, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background .3s',
                zIndex: 10,
              }}
              onMouseEnter={e => e.currentTarget.style.background = GL}
              onMouseLeave={e => e.currentTarget.style.background = G}
            >
              <ChevronLeft size={22} strokeWidth={1.8}/>
            </button>

            {/* Image */}
            <AnimatePresence mode="wait">
              <motion.img
                key={lightbox}
                src={ALL_PHOTOS[lightbox].src}
                alt={`Работа ${lightbox + 1}`}
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: [0.16, 0.84, 0.44, 1] }}
                style={{
                  maxWidth: '88vw', maxHeight: '88vh',
                  objectFit: 'contain', display: 'block',
                  border: `1px solid ${BDR}`,
                  boxShadow: '0 32px 80px rgba(0,0,0,.7)',
                }}
              />
            </AnimatePresence>

            {/* Next */}
            <button
              onClick={(e) => { e.stopPropagation(); next() }}
              style={{
                position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
                background: G, border: 'none', color: BG,
                width: 48, height: 48, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background .3s',
                zIndex: 10,
              }}
              onMouseEnter={e => e.currentTarget.style.background = GL}
              onMouseLeave={e => e.currentTarget.style.background = G}
            >
              <ChevronRight size={22} strokeWidth={1.8}/>
            </button>

            {/* Counter */}
            <div style={{
              position: 'absolute', bottom: 24,
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div style={{ width: 36, height: 1, background: BDR }} />
              <span style={{ color: MUT, fontSize: 12, fontFamily: B, letterSpacing: '3px' }}>
                {lightbox + 1} / {ALL_PHOTOS.length}
              </span>
              <div style={{ width: 36, height: 1, background: BDR }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
