'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, X, Send, Phone } from 'lucide-react'

function useIsMobile() {
  const [m, setM] = useState(false)
  useEffect(() => {
    const check = () => setM(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return m
}

const G    = '#c9a84c'
const GL   = '#e8d080'
const BG   = '#0a1510'
const CARD = '#111e17'
const W    = '#f5f0e8'
const MUT  = '#8ab09a'
const BDR  = 'rgba(201,168,76,.18)'
const BDR2 = 'rgba(201,168,76,.45)'
const D    = 'Georgia, serif'
const B    = 'Inter, system-ui, sans-serif'

const TG_MSG = 'Здравствуйте! Хочу записаться на индивидуальный пошив в ателье «Кружева». Подскажите, пожалуйста, с чего начать?'
const TG = `https://t.me/to_palto_atelier?text=${encodeURIComponent(TG_MSG)}`
const PHONE_HREF = 'tel:+79235672333'
const PHONE = '+7 (923) 567-23-33'
const MAX = 'https://max.ru/u/f9LHodD0cOKruzzMUm0r4kwLnOKfaMmEeqiHVQzELiGzTOJwd2SK8OGl_9o'

function Btn({ href, children, small, outline, block, icon: Icon }) {
  const [h, setH] = useState(false)
  const pad = small ? '8px 18px' : '12px 30px'
  const fs = small ? 10 : 11
  const base = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: pad, fontSize: fs, fontWeight: 500, letterSpacing: '2.5px', textDecoration: 'none', transition: 'all .3s', cursor: 'pointer', fontFamily: B, textTransform: 'uppercase', width: block ? '100%' : 'auto', flexShrink: 0 }
  const style = outline
    ? { ...base, border: `1px solid ${h ? G : BDR2}`, color: h ? '#fff' : W, background: h ? G : 'transparent' }
    : { ...base, background: h ? `linear-gradient(135deg,${GL},${G})` : `linear-gradient(135deg,${G},#9a7228)`, color: BG, border: 'none' }
  return <a href={href} target={href?.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" style={style} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>{Icon && <Icon size={14} strokeWidth={1.8}/>}{children}</a>
}

const NAV_LINKS = [
  ['/#services', 'Услуги'],
  ['/#process', 'Процесс'],
  ['/gallery', 'Галерея'],
  ['/#reviews', 'Отзывы'],
  ['/#contacts', 'Контакты'],
]

function GalleryNavbar() {
  const [open, setOpen] = useState(false)
  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, background: 'rgba(10,21,16,.96)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: `1px solid ${BDR}` }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 76 }}>
        <a href="/" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ color: G, fontSize: 28, fontWeight: 400, letterSpacing: '2px', fontFamily: "'Great Vibes', cursive", lineHeight: 1 }}>Кружева</div>
          <div style={{ color: MUT, fontSize: 8, letterSpacing: '4px', textTransform: 'uppercase', marginTop: 4, fontFamily: B }}>студия индивидуального пошива</div>
        </a>
        <div className="hidden md:flex" style={{ gap: 38, alignItems: 'center' }}>
          {NAV_LINKS.map(([href, label]) => (
            <a key={href} href={href} style={{ color: href === '/gallery' ? G : W, fontSize: 11, fontFamily: B, letterSpacing: '2.8px', textTransform: 'uppercase', textDecoration: 'none', fontWeight: 500, transition: 'color .3s' }}
              onMouseEnter={e => e.currentTarget.style.color = G}
              onMouseLeave={e => e.currentTarget.style.color = href === '/gallery' ? G : W}
            >{label}</a>
          ))}
        </div>
        <div className="hidden md:flex" style={{ gap: 8 }}>
          <Btn href={PHONE_HREF} small>{PHONE}</Btn>
          <Btn href={MAX} small outline icon={Send}>MAX</Btn>
          <Btn href={TG} small outline icon={Send}>TG</Btn>
        </div>
        <button onClick={() => setOpen(!open)} className="flex md:hidden"
          style={{ background: 'none', border: `1px solid ${BDR}`, color: G, padding: '8px 13px', cursor: 'pointer', fontSize: 17, lineHeight: 1 }}
        >{open ? '✕' : '☰'}</button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div key="menu" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.35, ease: [0.16, 0.84, 0.44, 1] }}
            style={{ overflow: 'hidden', background: 'rgba(10,21,16,.99)', borderTop: `1px solid ${BDR}` }}
          >
            <div style={{ padding: '28px 28px 36px', display: 'flex', flexDirection: 'column', gap: 22 }}>
              {NAV_LINKS.map(([href, label], i) => (
                <motion.a key={href} href={href} onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.06 + i * 0.07, duration: 0.4 }}
                  style={{ color: href === '/gallery' ? G : W, fontSize: 18, letterSpacing: '3px', textDecoration: 'none', textTransform: 'uppercase', fontFamily: D, fontStyle: 'italic' }}
                >{label}</motion.a>
              ))}
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.44, duration: 0.4 }}
                style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 12 }}
              >
                <Btn href={MAX} block icon={Send}>Написать в MAX</Btn>
                <Btn href={TG} block icon={Send}>Написать в Телеграм</Btn>
                <Btn href={PHONE_HREF} outline block icon={Phone}>Позвонить</Btn>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

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
  { id: 'item_21', title: 'Куртка комбинированная',     material: 'Курточная ткань, пальтовая ткань',                                                                   photos: ['photo_2026-05-31_20-55-00.jpg','photo_2026-05-31_20-55-08.jpg','photo_2026-05-31_20-55-29.jpg','photo_2026-05-31_20-55-38.jpg','photo_2026-05-31_20-56-09.jpg'] },
  { id: 'item_22', title: 'Жилет и юбка на подкладке',  material: 'Костюмная ткань (Италия), подкладка вискоза 100%',                                                   photos: ['photo_2026-04-05_11-04-53.jpg','photo_2026-05-31_20-57-07.jpg','photo_2026-05-31_20-57-08.jpg','photo_2026-05-31_20-57-09.jpg','photo_2026-05-31_20-57-09_2.jpg','photo_2026-05-31_20-57-09_3.jpg'] },
  { id: 'item_23', title: 'Брюки на подкладке',         material: '',                                                                                                    photos: ['photo_2025-11-16_11-59-17.jpg','photo_2026-05-31_21-01-59.jpg','photo_2026-05-31_21-02-00.jpg','photo_2026-05-31_21-02-01.jpg','photo_2026-05-31_21-02-03.jpg'] },
  { id: 'item_24', title: 'Брюки из смесовой ткани',    material: '',                                                                                                    photos: ['photo_2026-05-31_21-03-15.jpg','photo_2026-05-31_21-03-17.jpg','photo_2026-05-31_21-03-18.jpg'] },
  { id: 'item_25', title: 'Жакет из смесовой ткани',    material: 'Подкладка вискоза 100%, отделка из натурального шёлка',                                             photos: ['photo_2026-01-28_18-36-03.jpg','photo_2026-01-28_18-36-08.jpg','photo_2026-05-30_20-49-08.jpg','photo_2026-05-31_21-36-57.jpg','photo_2026-05-31_21-37-06.jpg','photo_2026-05-31_21-37-17.jpg'] },
  { id: 'item_26', title: 'Костюм: жакет и юбка',       material: 'Смесовая ткань',                                                                                     photos: ['photo_2026-05-31_21-40-23.jpg','photo_2026-05-31_21-40-23_2.jpg','photo_2026-05-31_21-40-23_3.jpg','photo_2026-05-31_21-40-23_4.jpg','photo_2026-05-31_21-40-23_5.jpg','photo_2026-05-31_21-40-23_6.jpg','photo_2026-05-31_21-40-23_7.jpg','photo_2026-05-31_21-40-24.jpg','photo_2026-05-31_21-40-24_2.jpg'] },
  { id: 'item_27', title: 'Платье из крепдешина',       material: 'Натуральный крепдешин, подкладка из вискозного батиста',                                            photos: ['photo_2025-07-24_20-12-51.jpg','photo_2026-05-31_21-43-26.jpg','photo_2026-05-31_21-43-28.jpg','photo_2026-05-31_21-43-33.jpg','photo_2026-05-31_21-43-36.jpg','photo_2026-05-31_21-43-38.jpg','photo_2026-05-31_21-43-39.jpg'] },
  { id: 'item_28', title: 'Платье из крепдешина',       material: 'Натуральный крепдешин, подкладка из натурального шёлка',                                            photos: ['photo_2026-01-28_18-36-42.jpg','photo_2026-01-28_18-36-56.jpg','photo_2026-05-31_21-45-36.jpg','photo_2026-05-31_21-45-40.jpg'] },
  { id: 'item_29', title: 'Платье из льна',             material: 'Лён 100%, отделка из кружева 100% хлопок',                                                          photos: ['photo_2026-05-31_21-49-02.jpg','photo_2026-05-31_21-49-02_2.jpg','photo_2026-05-31_21-49-02_3.jpg','photo_2026-05-31_21-49-02_4.jpg','photo_2026-05-31_21-49-02_5.jpg','photo_2026-05-31_21-49-02_6.jpg','photo_2026-05-31_21-49-02_7.jpg','photo_2026-05-31_21-49-02_8.jpg','photo_2026-05-31_21-49-02_9.jpg'] },
]

function Lightbox({ item, photoIdx, onClose, onPrev, onNext, onThumb }) {
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

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 600, background: 'rgba(5,12,8,.97)', backdropFilter: 'blur(12px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
    >
      <button onClick={onClose}
        style={{ position: 'absolute', top: 20, right: 24, background: 'none', border: `1px solid ${BDR}`, color: MUT, cursor: 'pointer', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = G; e.currentTarget.style.color = G }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = BDR; e.currentTarget.style.color = MUT }}
      ><X size={20} strokeWidth={1.5}/></button>

      <div onClick={e => e.stopPropagation()} style={{ textAlign: 'center', marginBottom: 16 }}>
        <p style={{ color: G, fontSize: 11, letterSpacing: '4px', textTransform: 'uppercase', fontFamily: B, fontWeight: 500, margin: '0 0 4px' }}>{item.title}</p>
        {item.material && <p style={{ color: MUT, fontSize: 12, fontFamily: B, fontWeight: 300, margin: 0 }}>{item.material}</p>}
      </div>

      <div onClick={e => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={onPrev} style={{ background: 'rgba(201,168,76,.18)', border: `1px solid rgba(201,168,76,.4)`, color: G, cursor: 'pointer', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,.4)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(201,168,76,.18)'}
        ><ChevronLeft size={22} strokeWidth={1.8}/></button>

        <AnimatePresence mode="wait">
          <motion.img key={photoIdx} src={`/items/${item.id}/${item.photos[photoIdx]}`} alt={item.title}
            initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            style={{ maxWidth: 'min(520px, 72vw)', maxHeight: '58vh', objectFit: 'contain', border: `1px solid ${BDR}`, display: 'block' }}
          />
        </AnimatePresence>

        <button onClick={onNext} style={{ background: 'rgba(201,168,76,.18)', border: `1px solid rgba(201,168,76,.4)`, color: G, cursor: 'pointer', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,.4)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(201,168,76,.18)'}
        ><ChevronRight size={22} strokeWidth={1.8}/></button>
      </div>

      <div onClick={e => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
        <div style={{ width: 24, height: 1, background: BDR }}/>
        <span style={{ color: MUT, fontSize: 11, fontFamily: B, letterSpacing: '3px' }}>{photoIdx + 1} / {item.photos.length}</span>
        <div style={{ width: 24, height: 1, background: BDR }}/>
      </div>

      {item.photos.length > 1 && (
        <div onClick={e => e.stopPropagation()} style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap', justifyContent: 'center', maxWidth: '80vw' }}>
          {item.photos.map((_, i) => (
            <div key={i} onClick={() => onThumb(i)}
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

function CatalogCard({ item, index, onOpen }) {
  const [h, setH] = useState(false)
  const cover = `/items/${item.id}/${item.photos[0]}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.07, ease: [0.16, 0.84, 0.44, 1] }}
      onClick={onOpen}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{ cursor: 'pointer', background: CARD, border: `1px solid ${h ? BDR2 : BDR}`, transition: 'border-color .3s, transform .3s', transform: h ? 'translateY(-4px)' : 'none' }}
    >
      {/* Photo */}
      <div style={{ position: 'relative', paddingBottom: '133%', overflow: 'hidden' }}>
        <img src={cover} alt={item.title} loading="lazy"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: h ? 'scale(1.05)' : 'scale(1)', transition: 'transform .9s cubic-bezier(.2,.8,.2,1)' }}
        />
        {/* Photo count badge */}
        {item.photos.length > 1 && (
          <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(10,21,16,.75)', backdropFilter: 'blur(4px)', border: `1px solid ${BDR}`, padding: '3px 9px', color: MUT, fontSize: 10, fontFamily: B, letterSpacing: '1px' }}>
            {item.photos.length} фото
          </div>
        )}
        {/* Hover overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,21,16,.7) 0%, transparent 50%)', opacity: h ? 1 : 0, transition: 'opacity .3s', display: 'flex', alignItems: 'flex-end', padding: '14px 16px' }}>
          <span style={{ color: W, fontSize: 10, letterSpacing: '2.5px', textTransform: 'uppercase', fontFamily: B, fontWeight: 500 }}>Смотреть</span>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '16px 16px 20px' }}>
        <h3 style={{ color: W, fontSize: 15, fontFamily: D, fontStyle: 'italic', fontWeight: 400, margin: '0 0 6px', lineHeight: 1.2 }}>{item.title}</h3>
        {item.material && (
          <p style={{ color: MUT, fontSize: 11, fontFamily: B, fontWeight: 300, margin: 0, lineHeight: 1.6 }}>{item.material}</p>
        )}
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, color: G, opacity: h ? 1 : 0, transition: 'opacity .3s' }}>
          <span style={{ fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase', fontFamily: B }}>Подробнее</span>
          <ChevronRight size={12} strokeWidth={2}/>
        </div>
      </div>
    </motion.div>
  )
}

export default function GalleryPage() {
  const mobile = useIsMobile()
  const [lightbox, setLightbox] = useState(null) // { item, photoIdx }

  const openItem = (item) => setLightbox({ item, photoIdx: 0 })
  const prev = () => setLightbox(s => ({ ...s, photoIdx: s.photoIdx > 0 ? s.photoIdx - 1 : s.item.photos.length - 1 }))
  const next = () => setLightbox(s => ({ ...s, photoIdx: s.photoIdx < s.item.photos.length - 1 ? s.photoIdx + 1 : 0 }))
  const thumb = (i) => setLightbox(s => ({ ...s, photoIdx: i }))

  return (
    <div style={{ background: BG, minHeight: '100vh', color: W, fontFamily: B, overflowX: 'hidden', paddingTop: 76 }}>
      <GalleryNavbar />

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: mobile ? '48px 20px 40px' : '64px 28px 48px', borderBottom: `1px solid ${BDR}` }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <div style={{ width: 28, height: 1, background: G }}/>
          <span style={{ color: G, fontSize: 10, fontWeight: 500, letterSpacing: '6px', textTransform: 'uppercase', fontFamily: B }}>Авторские работы</span>
          <div style={{ width: 28, height: 1, background: G }}/>
        </div>
        <h1 style={{ fontSize: 'clamp(32px,4.5vw,60px)', fontFamily: D, fontWeight: 300, color: W, letterSpacing: '-0.5px', margin: '0 0 12px', lineHeight: 1.1 }}>
          Каталог <span style={{ color: G, fontStyle: 'italic' }}>изделий</span>
        </h1>
        <p style={{ color: MUT, fontSize: 14, fontFamily: B, fontWeight: 300, margin: 0 }}>
          {WORKS.length} изделий · Индивидуальный пошив класса люкс
        </p>
      </div>

      {/* Catalog grid */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: mobile ? '32px 16px 80px' : '48px 28px 100px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: mobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: mobile ? 12 : 16 }}>
          {WORKS.map((item, i) => (
            <CatalogCard key={item.id} item={item} index={i} onOpen={() => openItem(item)} />
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ borderTop: `1px solid ${BDR}`, padding: '56px 28px', textAlign: 'center', background: CARD }}>
        <p style={{ color: MUT, fontSize: 14, fontFamily: B, fontWeight: 300, marginBottom: 8 }}>Хотите похожее изделие?</p>
        <p style={{ color: MUT, fontSize: 14, fontFamily: B, fontWeight: 300, marginBottom: 28 }}>Обсудим на бесплатной консультации — подберём ткань, крой и стиль под вас</p>
        <a href={TG} target="_blank" rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 40px', background: `linear-gradient(135deg,${G},#9a7228)`, color: BG, fontSize: 12, fontWeight: 600, letterSpacing: '2.5px', textDecoration: 'none', fontFamily: B, textTransform: 'uppercase' }}
        >
          <Send size={14} strokeWidth={1.6}/>Записаться на консультацию
        </a>
      </div>

      <AnimatePresence>
        {lightbox && (
          <Lightbox
            item={lightbox.item}
            photoIdx={lightbox.photoIdx}
            onClose={() => setLightbox(null)}
            onPrev={prev}
            onNext={next}
            onThumb={thumb}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
