'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react'

const G   = '#c9a84c'
const GL  = '#e8d080'
const BG  = '#0a1510'
const CARD= '#111e17'
const W   = '#f5f0e8'
const MUT = '#8ab09a'
const BDR = 'rgba(201,168,76,.18)'
const BDR2= 'rgba(201,168,76,.45)'
const D   = 'Georgia, serif'
const B   = 'Inter, system-ui, sans-serif'

const TG_MSG = 'Здравствуйте! Хочу записаться на индивидуальный пошив в ателье «Кружева». Подскажите, пожалуйста, с чего начать?'
const TG = `https://t.me/to_palto_atelier?text=${encodeURIComponent(TG_MSG)}`

const WORKS = [
  { id: 'item_01', title: 'Жакет Шанель',              material: 'Твид, натуральный шёлк',                                                                             photos: ['photo_2026-05-31_19-44-52.jpg','photo_2026-05-31_19-44-53.jpg','photo_2026-05-31_19-44-54.jpg','photo_2026-05-31_19-44-54_2.jpg','photo_2026-05-31_19-44-55.jpg','photo_2026-05-31_19-44-55_2.jpg','photo_2026-05-31_19-45-56.jpg'] },
  { id: 'item_02', title: 'Бомбер',                     material: 'Твид, подкладка — вискоза 100%',                                                                     photos: ['photo_2026-05-31_19-47-05.jpg','photo_2026-05-31_19-47-06.jpg','photo_2026-05-31_19-47-08.jpg','photo_2026-05-31_19-47-09.jpg','photo_2026-05-31_19-47-10.jpg'] },
  { id: 'item_03', title: 'Жакет',                      material: 'Твид, натуральный шёлк',                                                                             photos: ['photo_2026-05-30_20-43-52.jpg','photo_2026-05-30_20-44-59.jpg','photo_2026-05-31_19-48-26.jpg','photo_2026-05-31_19-48-27.jpg','photo_2026-05-31_19-48-35.jpg','photo_2026-05-31_19-48-43.jpg'] },
  { id: 'item_04', title: 'Жакет',                      material: 'Твид, натуральный шёлк',                                                                             photos: ['photo_2026-05-31_19-50-50.jpg','photo_2026-05-31_19-50-52.jpg','photo_2026-05-31_19-50-53.jpg','photo_2026-05-31_19-50-56.jpg','photo_2026-05-31_19-50-56_2.jpg','photo_2026-05-31_19-50-58.jpg'] },
  { id: 'item_05', title: 'Тренч',                      material: 'Костюмная ткань двусторонняя (Италия), подкладка — вискоза 100%',                                    photos: ['photo_2026-04-20_16-24-12.jpg','photo_2026-04-20_16-24-21.jpg','photo_2026-05-30_20-45-01.jpg','photo_2026-05-31_19-55-12.jpg','photo_2026-05-31_19-55-15.jpg','photo_2026-05-31_19-55-18.jpg'] },
  { id: 'item_06', title: 'Укороченный тренч',          material: 'Ткань Рип-стоп, хлопок (Италия)',                                                                    photos: ['photo_2026-05-31_19-59-36.jpg','photo_2026-05-31_19-59-37.jpg','photo_2026-05-31_19-59-38.jpg','photo_2026-05-31_19-59-41.jpg','photo_2026-05-31_19-59-42.jpg'] },
  { id: 'item_07', title: 'Рубашка',                    material: 'Хлопок',                                                                                             photos: ['photo_2026-05-31_20-01-07.jpg','photo_2026-05-31_20-01-11.jpg','photo_2026-05-31_20-01-13.jpg'] },
  { id: 'item_08', title: 'Рубашка',                    material: 'Хлопок (Португалия)',                                                                                photos: ['photo_2026-05-30_20-57-48.jpg','photo_2026-05-30_20-59-03.jpg','photo_2026-05-30_20-59-04.jpg','photo_2026-05-31_20-04-12.jpg','photo_2026-05-31_20-04-14.jpg','photo_2026-05-31_20-04-16.jpg'] },
  { id: 'item_09', title: 'Блуза',                      material: 'Лён 100%',                                                                                           photos: ['photo_2026-05-31_20-07-48.jpg','photo_2026-05-31_20-07-49.jpg','photo_2026-05-31_20-07-52.jpg'] },
  { id: 'item_10', title: 'Рубашка',                    material: 'Хлопок',                                                                                             photos: ['photo_2026-05-31_20-17-56.jpg','photo_2026-05-31_20-17-56_2.jpg'] },
  { id: 'item_11', title: 'Блуза',                      material: 'Натуральный крепдешин',                                                                              photos: ['photo_2026-05-31_20-21-31.jpg','photo_2026-05-31_20-21-33.jpg','photo_2026-05-31_20-21-34.jpg','photo_2026-05-31_20-21-36.jpg'] },
  { id: 'item_12', title: 'Куртка из меха',             material: 'Стриженный бобёр, норка, натуральная замша',                                                         photos: ['photo_2026-05-30_20-53-55.jpg','photo_2026-05-31_20-24-17.jpg','photo_2026-05-31_20-24-19.jpg'] },
  { id: 'item_13', title: 'Опушка на воротник',         material: 'Мех енота',                                                                                          photos: ['photo_2026-01-14_13-16-34.jpg','photo_2026-05-31_20-25-42.jpg'] },
  { id: 'item_14', title: 'Утеплённый комбинезон',      material: 'Плащевая ткань, вискоза, утеплитель альпалюкс, опушка из меха рыжей лисы «огнёвка»',                photos: ['photo_2026-02-18_11-15-21.jpg','photo_2026-02-18_11-15-26.jpg','photo_2026-02-18_11-15-32.jpg','photo_2026-05-31_20-28-50.jpg','photo_2026-05-31_20-29-01.jpg','photo_2026-05-31_20-29-05.jpg','photo_2026-05-31_20-29-08.jpg','photo_2026-05-31_20-29-11.jpg'] },
  { id: 'item_15', title: 'Шубка укороченная',          material: 'Мех норки «Вельвет» цвет Браун, подкладка вискоза 100%',                                            photos: ['photo_2025-12-02_09-31-38.jpg','photo_2026-05-31_20-31-15.jpg','photo_2026-05-31_20-31-16.jpg'] },
  { id: 'item_16', title: 'Пальто утеплённое',          material: 'Пальтовая ткань (Италия), вискоза, утеплитель из шерстипона, воротник из меха норки (Норвегия)',     photos: ['photo_2026-05-31_20-36-01.jpg','photo_2026-05-31_20-36-01_2.jpg','photo_2026-05-31_20-36-02.jpg','photo_2026-05-31_20-36-02_2.jpg'] },
  { id: 'item_17', title: 'Плащ-пыльник',               material: 'Хлопок-сатин, подкладка вискозный батист',                                                          photos: ['photo_2026-05-31_20-41-41.jpg','photo_2026-05-31_20-41-43.jpg','photo_2026-05-31_20-41-44.jpg','photo_2026-05-31_20-41-45.jpg','photo_2026-05-31_20-41-46.jpg','photo_2026-05-31_20-41-46_2.jpg','photo_2026-05-31_20-41-48.jpg','photo_2026-05-31_20-41-49.jpg'] },
  { id: 'item_18', title: 'Бомбер',                     material: 'Мягкая пальтовая ткань (Италия), подкладка вискоза 100%',                                           photos: ['photo_2026-05-31_20-44-37.jpg','photo_2026-05-31_20-44-39.jpg','photo_2026-05-31_20-44-40.jpg','photo_2026-05-31_20-44-41.jpg','photo_2026-05-31_20-44-53.jpg'] },
  { id: 'item_19', title: 'Кроп-тренч',                 material: 'Тренчевая ткань хлопок (Италия), подкладка из вискозы и хлопка',                                    photos: ['photo_2026-05-31_20-48-34.jpg','photo_2026-05-31_20-48-36.jpg','photo_2026-05-31_20-48-36_2.jpg','photo_2026-05-31_20-48-36_3.jpg','photo_2026-05-31_20-48-39.jpg','photo_2026-05-31_20-48-40.jpg','photo_2026-05-31_20-48-41.jpg','photo_2026-05-31_20-48-44.jpg'] },
  { id: 'item_20', title: 'Куртка из натуральной кожи', material: 'Расписана вручную акрилом',                                                                          photos: ['photo_2026-05-31_20-51-54.jpg','photo_2026-05-31_20-51-55.jpg','photo_2026-05-31_20-51-56.jpg','photo_2026-05-31_20-51-57.jpg','photo_2026-05-31_20-52-00.jpg','photo_2026-05-31_20-52-01.jpg','photo_2026-05-31_20-52-03.jpg','photo_2026-05-31_20-52-04.jpg'] },
]

function Lightbox({ item, photoIdx, onClose, onPrev, onNext }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = e => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey) }
  }, [])

  const src = `/items/${item.id}/${item.photos[photoIdx]}`
  const total = item.photos.length

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 600, background: 'rgba(5,12,8,.97)', backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
    >
      <button onClick={onClose}
        style={{ position: 'absolute', top: 20, right: 24, background: 'none', border: `1px solid ${BDR}`, color: MUT, cursor: 'pointer', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = G; e.currentTarget.style.color = G }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = BDR; e.currentTarget.style.color = MUT }}
      ><X size={20} strokeWidth={1.5}/></button>

      <div onClick={e => e.stopPropagation()} style={{ textAlign: 'center', marginBottom: 16 }}>
        <p style={{ color: G, fontSize: 11, letterSpacing: '4px', textTransform: 'uppercase', fontFamily: B, fontWeight: 500, margin: '0 0 4px' }}>{item.title}</p>
        <p style={{ color: MUT, fontSize: 12, fontFamily: B, fontWeight: 300, margin: 0 }}>{item.material}</p>
      </div>

      <div onClick={e => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={onPrev}
          style={{ background: 'rgba(201,168,76,.18)', border: `1px solid rgba(201,168,76,.4)`, color: G, cursor: 'pointer', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,.4)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(201,168,76,.18)'}
        ><ChevronLeft size={22} strokeWidth={1.8}/></button>

        <AnimatePresence mode="wait">
          <motion.img key={photoIdx} src={src} alt={`${item.title} ${photoIdx + 1}`}
            initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            style={{ maxWidth: 'min(560px, 72vw)', maxHeight: '60vh', objectFit: 'contain', border: `1px solid ${BDR}`, display: 'block' }}
          />
        </AnimatePresence>

        <button onClick={onNext}
          style={{ background: 'rgba(201,168,76,.18)', border: `1px solid rgba(201,168,76,.4)`, color: G, cursor: 'pointer', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,.4)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(201,168,76,.18)'}
        ><ChevronRight size={22} strokeWidth={1.8}/></button>
      </div>

      <div onClick={e => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
        <div style={{ width: 24, height: 1, background: BDR }}/>
        <span style={{ color: MUT, fontSize: 11, fontFamily: B, letterSpacing: '3px' }}>{photoIdx + 1} / {total}</span>
        <div style={{ width: 24, height: 1, background: BDR }}/>
      </div>

      {total > 1 && (
        <div onClick={e => e.stopPropagation()} style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap', justifyContent: 'center', maxWidth: '80vw' }}>
          {item.photos.map((_, i) => (
            <div key={i} onClick={() => { /* handled by parent */ }}
              style={{ width: 44, height: 44, cursor: 'pointer', border: `1.5px solid ${i === photoIdx ? G : BDR}`, overflow: 'hidden', opacity: i === photoIdx ? 1 : 0.5, transition: 'all .2s' }}
            >
              <img src={`/items/${item.id}/${item.photos[i]}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

function ItemSection({ item, index }) {
  const [lightbox, setLightbox] = useState(null)
  const num = String(index + 1).padStart(2, '0')

  const openPhoto = (i) => setLightbox(i)
  const prev = () => setLightbox(i => (i > 0 ? i - 1 : item.photos.length - 1))
  const next = () => setLightbox(i => (i < item.photos.length - 1 ? i + 1 : 0))

  const cols = item.photos.length <= 1 ? 1 : item.photos.length <= 2 ? 2 : item.photos.length <= 3 ? 3 : 4

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.16, 0.84, 0.44, 1] }}
      style={{ borderTop: `1px solid ${BDR}`, paddingTop: 48, marginBottom: 64 }}
    >
      {/* Item header */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, marginBottom: 28, flexWrap: 'wrap' }}>
        <span style={{ color: G, fontSize: 13, fontFamily: D, fontStyle: 'italic', opacity: 0.7, flexShrink: 0 }}>{num}</span>
        <h2 style={{ color: W, fontSize: 'clamp(22px,2.8vw,34px)', fontFamily: D, fontStyle: 'italic', fontWeight: 400, margin: 0, lineHeight: 1.1 }}>{item.title}</h2>
        <div style={{ flex: 1, height: 1, background: BDR, minWidth: 20, alignSelf: 'center' }}/>
        <p style={{ color: MUT, fontSize: 13, fontFamily: B, fontWeight: 300, margin: 0, flexShrink: 0, maxWidth: 320, textAlign: 'right' }}>{item.material}</p>
      </div>

      {/* Photo grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 260px)', gap: 8 }}>
        {item.photos.map((photo, i) => (
          <PhotoCell key={i} src={`/items/${item.id}/${photo}`} index={i} total={item.photos.length} onOpen={() => openPhoto(i)} />
        ))}
      </div>

      <AnimatePresence>
        {lightbox !== null && (
          <Lightbox item={item} photoIdx={lightbox} onClose={() => setLightbox(null)} onPrev={prev} onNext={next} />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function PhotoCell({ src, onOpen, index, total }) {
  const [h, setH] = useState(false)
  // Первое фото занимает 2 колонки если фото > 4 и cols = 4
  const spanTwo = total >= 5 && index === 0

  return (
    <div
      onClick={onOpen}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        gridColumn: spanTwo ? 'span 2' : 'span 1',
        position: 'relative',
        paddingBottom: spanTwo ? '66.5%' : '133%',
        cursor: 'pointer',
        overflow: 'hidden',
        border: `1px solid ${h ? BDR2 : BDR}`,
        transition: 'border-color .3s',
        background: CARD,
      }}
    >
      <img src={src} alt="" loading="lazy"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: h ? 'scale(1.03)' : 'scale(1)', transition: 'transform .9s cubic-bezier(.2,.8,.2,1)' }}
      />
    </div>
  )
}

export default function GalleryPage() {
  return (
    <div style={{ background: BG, minHeight: '100vh', color: W, fontFamily: B, overflowX: 'hidden' }}>

      {/* Sticky header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 200, background: 'rgba(10,21,16,.96)', backdropFilter: 'blur(16px)', borderBottom: `1px solid ${BDR}`, padding: '0 28px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: G, fontSize: 20, fontWeight: 400, letterSpacing: '7px', fontFamily: D, textTransform: 'uppercase', fontStyle: 'italic' }}>Кружева</div>
      </div>

      {/* Back link */}
      <div style={{ padding: '28px 28px 0' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: MUT, textDecoration: 'none', fontSize: 11, fontFamily: B, letterSpacing: '2px', textTransform: 'uppercase', transition: 'color .3s' }}
          onMouseEnter={e => e.currentTarget.style.color = G}
          onMouseLeave={e => e.currentTarget.style.color = MUT}
        >
          <ChevronLeft size={14} strokeWidth={1.6}/> На главную
        </Link>
      </div>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '48px 28px 56px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
          <div style={{ width: 32, height: 1, background: G }}/>
          <span style={{ color: G, fontSize: 10, fontWeight: 500, letterSpacing: '6px', textTransform: 'uppercase', fontFamily: B }}>Авторские работы</span>
          <div style={{ width: 32, height: 1, background: G }}/>
        </div>
        <h1 style={{ fontSize: 'clamp(36px,5vw,68px)', fontFamily: D, fontWeight: 300, color: W, letterSpacing: '-0.8px', margin: '0 0 16px', lineHeight: 1.1 }}>
          Готовые <span style={{ color: G, fontStyle: 'italic' }}>изделия</span>
        </h1>
        <p style={{ color: MUT, fontSize: 15, fontFamily: B, fontWeight: 300, letterSpacing: '0.5px', margin: 0 }}>
          {WORKS.length} изделий · Индивидуальный пошив класса люкс
        </p>
      </div>

      {/* Items */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 28px 100px' }}>
        {WORKS.map((item, i) => (
          <ItemSection key={item.id} item={item} index={i} />
        ))}
      </div>

      {/* CTA */}
      <div style={{ borderTop: `1px solid ${BDR}`, padding: '56px 28px', textAlign: 'center', background: CARD }}>
        <p style={{ color: MUT, fontSize: 14, fontFamily: B, fontWeight: 300, marginBottom: 24 }}>Хотите такое же изделие? Обсудим на бесплатной консультации</p>
        <a href={TG} target="_blank" rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 36px', background: `linear-gradient(135deg,${G},#9a7228)`, color: BG, fontSize: 13, fontWeight: 600, letterSpacing: '2px', textDecoration: 'none', fontFamily: B, textTransform: 'uppercase' }}
        >
          <Sparkles size={14} strokeWidth={1.6}/>Записаться на консультацию
        </a>
      </div>

    </div>
  )
}
