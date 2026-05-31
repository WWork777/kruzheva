'use client'

import { useState, useEffect, useRef, createContext, useContext } from 'react'
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import {
  Crown,
  Sparkles,
  Wine,
  Briefcase,
  Shirt,
  Scissors,
  Phone,
  Send,
  Star,
  MapPin,
  Mail,
  Clock,
  ChevronLeft,
  ChevronRight,
  ChevronRight as ArrowRight,
  Gem,
  Award,
  Heart,
  CheckCircle2,
  Zap,
} from 'lucide-react'

const TG_MSG = 'Здравствуйте! Хочу записаться на индивидуальный пошив в ателье «Кружева». Подскажите, пожалуйста, с чего начать?'
const TG = `https://t.me/to_palto_atelier?text=${encodeURIComponent(TG_MSG)}`
const PHONE_HREF = 'tel:+79235672333'
const PHONE = '+7\u00a0(923)\u00a0567-23-33'
const VK = 'https://vk.com/i_kruzheva'
const MAX = 'https://max.ru/u/f9LHodD0cOKruzzMUm0r4kwLnOKfaMmEeqiHVQzELiGzTOJwd2SK8OGl_9o'
const ADDR = 'пр. Ленина, 67а, 1\u00a0этаж'
const CITY = 'Кемерово'

// ---- Real atelier photos ----
const R = (f) => `/real/${f}`
const IMG_HERO      = R('photo_109.jpg')   // hero фото
const IMG_PORTRAIT  = R('photo_inna.jpg')  // Инна — мастер
const IMG_PROCESS   = R('photo_59.jpg')   // рука на ткани
const IMG_ATELIER   = R('photo_53.jpg')   // ярлык INNA KRUZEL ATELIER
const IMG_FABRIC    = R('photo_79.jpg')   // шёлковая подкладка
const IMG_WEDDING   = R('photo_96.jpg')   // белое свадебное платье
const IMG_EVENING   = R('photo_29.jpg')   // красное вечернее платье
const IMG_COCKTAIL  = R('photo_98.jpg')   // клиентка в белом элегантном
const IMG_BUSINESS  = R('photo_43.jpg')   // лиловый костюм у зеркала
const IMG_SEWING    = R('photo_16.jpg')   // твидовый костюм Шанель
const IMG_CASUAL    = R('photo_01.jpg')   // чёрная куртка на манекене
const IMG_REPAIR    = R('photo_86.jpg')   // тёмная ткань, драпировка
const IMG_OUTERWEAR = R('photo_15.jpg')   // пальто с меховым воротником
const IMG_BLOUSE    = R('photo_22.jpg')   // полосатая рубашка

// ---- Palette ----
const G     = '#c9a84c'
const GL    = '#e8d080'
const BG    = '#0a1510'
const CARD  = '#111e17'
const CARD2 = '#182b20'
const W     = '#f5f0e8'
const WL    = '#f5f0e8'
const MUT   = '#8ab09a'
const BDR   = 'rgba(201,168,76,.18)'
const BDR2  = 'rgba(201,168,76,.45)'

// ---- Fonts ----
const D = 'var(--font-display, Georgia, serif)'
const B = 'var(--font-body, system-ui, sans-serif)'

// ============ HOOK: reveal on scroll ============
function useReveal(threshold = 0.15) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.unobserve(el)
        }
      },
      { threshold, rootMargin: '0px 0px -60px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return [ref, shown]
}

function useIsMobile(bp = 768) {
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${bp}px)`)
    const fn = () => setMobile(mq.matches)
    fn()
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [bp])
  return mobile
}

function Reveal({ children, delay = 0, y = 32, style = {}, ...rest }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px 0px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.7, delay: delay / 1000, ease: [0.16, 0.84, 0.44, 1] }}
      style={style}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

// ============ DECORATIVE: lace ornament SVG ============
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
    <svg
      aria-hidden
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity, mixBlendMode: 'screen' }}
    >
      <defs>
        <pattern id="lace-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <circle cx="40" cy="40" r="18" stroke={G} strokeWidth="0.5" fill="none"/>
          <circle cx="40" cy="40" r="6" stroke={G} strokeWidth="0.4" fill="none"/>
          <circle cx="0" cy="0" r="12" stroke={G} strokeWidth="0.4" fill="none"/>
          <circle cx="80" cy="0" r="12" stroke={G} strokeWidth="0.4" fill="none"/>
          <circle cx="0" cy="80" r="12" stroke={G} strokeWidth="0.4" fill="none"/>
          <circle cx="80" cy="80" r="12" stroke={G} strokeWidth="0.4" fill="none"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#lace-pattern)"/>
    </svg>
  )
}

// ============ FLOATING BOOK BTN ============
function FloatingBookBtn() {
  const [open, setOpen] = useState(false)
  const openLead = useContext(LeadContext)
  const fabItems = [
    { label: 'Оставить заявку', icon: Sparkles, action: () => { setOpen(false); openLead('Заявка на пошив') } },
    { label: 'MAX', icon: Send, href: MAX },
    { label: 'Телеграм', icon: Send, href: TG },
    { label: 'Позвонить', icon: Phone, href: PHONE_HREF },
  ]
  return (
    <div style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 300, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
      <AnimatePresence>
        {open && fabItems.map((item, i) => {
          const Tag = item.href ? 'a' : 'button'
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: { delay: i * 0.05, duration: 0.25, ease: [0.16, 0.84, 0.44, 1] } }}
              exit={{ opacity: 0, y: 10, scale: 0.9, transition: { duration: 0.15 } }}
              style={{ display: 'flex', alignItems: 'center', gap: 0, justifyContent: 'flex-end' }}
            >
              <span style={{
                background: 'rgba(10,21,16,0.92)', backdropFilter: 'blur(8px)',
                color: W, fontSize: 12, fontFamily: B, fontWeight: 400, letterSpacing: '1px',
                padding: '6px 14px', borderRadius: 20, marginRight: 10,
                border: `1px solid rgba(201,168,76,0.25)`, whiteSpace: 'nowrap',
              }}>{item.label}</span>
              <Tag
                href={item.href}
                target={item.href && item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href && item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                onClick={item.action}
                style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: `linear-gradient(135deg,${G},#9a7228)`,
                  color: BG, border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(201,168,76,.4)',
                  textDecoration: 'none', flexShrink: 0,
                }}
              >
                <item.icon size={18} strokeWidth={1.6} />
              </Tag>
            </motion.div>
          )
        })}
      </AnimatePresence>
      <button
        data-testid="floating-book-btn"
        onClick={() => setOpen(o => !o)}
        style={{
          padding: '16px 30px', borderRadius: 60, border: 'none', cursor: 'pointer',
          background: open ? `linear-gradient(135deg,#e8d080,${G})` : `linear-gradient(135deg,${G},#9a7228)`,
          color: BG, fontSize: 12, fontWeight: 500, letterSpacing: '2px',
          fontFamily: B, textTransform: 'uppercase',
          boxShadow: '0 8px 32px rgba(201,168,76,.4)',
          transition: 'all .35s cubic-bezier(.2,.8,.2,1)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}
      >
        <Sparkles size={16} strokeWidth={1.6} style={{ transition: 'transform .35s', transform: open ? 'rotate(90deg)' : 'none' }} />
        {open ? 'Закрыть' : 'Записаться'}
      </button>
    </div>
  )
}

function GoldLine({ width = 48 }) {
  return <div style={{ width, height: 1, background: G, flexShrink: 0 }} />
}

function SectionEye({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, marginBottom: 22 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <GoldLine width={32} />
        <span style={{ color: G, fontSize: 10, fontWeight: 500, letterSpacing: '6px', textTransform: 'uppercase', fontFamily: B }}>{children}</span>
        <GoldLine width={32} />
      </div>
      <LaceOrnament size={84} opacity={0.5} />
    </div>
  )
}

// ============ WOW COMPONENTS ============

// Sparkles around text
function SparklesText({ children, style = {} }) {
  const [sparks, setSparks] = useState([])
  useEffect(() => {
    const gen = () => setSparks(
      Array.from({ length: 6 }, (_, i) => ({
        id: Math.random(),
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 4 + Math.random() * 6,
        delay: Math.random() * 2,
        dur: 1.2 + Math.random() * 1,
      }))
    )
    gen()
    const t = setInterval(gen, 2500)
    return () => clearInterval(t)
  }, [])
  return (
    <span style={{ position: 'relative', display: 'inline-block', ...style }}>
      {sparks.map(s => (
        <svg key={s.id} width={s.size} height={s.size} viewBox="0 0 16 16"
          style={{ position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, pointerEvents: 'none', zIndex: 1,
            animation: `sparkle-fade ${s.dur}s ease-in-out ${s.delay}s infinite` }}>
          <path d="M8 0 L9.5 6.5 L16 8 L9.5 9.5 L8 16 L6.5 9.5 L0 8 L6.5 6.5 Z" fill="#c9a84c"/>
        </svg>
      ))}
      <span style={{ position: 'relative', zIndex: 2 }}>{children}</span>
    </span>
  )
}

// Card with subtle glow on hover
function GlowCard({ children, style = {}, onClick, onMouseEnter, onMouseLeave, ...rest }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => { setHovered(true); onMouseEnter?.() }}
      onMouseLeave={() => { setHovered(false); onMouseLeave?.() }}
      style={{
        ...style,
        transition: 'box-shadow .6s ease',
        animation: hovered ? 'glow-pulse 2s ease-in-out infinite' : 'none',
        boxShadow: hovered ? '0 0 40px rgba(201,168,76,0.18), 0 0 80px rgba(201,168,76,0.07)' : 'none',
      }}
      {...rest}
    >
      {children}
    </div>
  )
}

function Btn({ href, onClick, type, children, large, small, outline, outlineLight, block, icon: Icon, testId }) {
  const [h, setH] = useState(false)
  const pad = large ? '17px 44px' : small ? '8px 18px' : '12px 30px'
  const fs = large ? 12 : small ? 10 : 11
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    padding: pad, borderRadius: 1, fontSize: fs, fontWeight: 500,
    letterSpacing: '2.5px', textDecoration: 'none', transition: 'all .35s cubic-bezier(.2,.8,.2,1)',
    cursor: 'pointer', fontFamily: B, textTransform: 'uppercase',
    width: block ? '100%' : 'auto', flexShrink: 0,
    position: 'relative', overflow: 'hidden',
  }
  const isExt = href && href.startsWith('http')
  const Tag = href ? 'a' : 'button'
  const tagProps = href
    ? { href, target: isExt ? '_blank' : undefined, rel: isExt ? 'noopener noreferrer' : undefined }
    : { type: type || 'button', onClick }
  const style = outlineLight
    ? {
        ...base,
        border: `1px solid rgba(245,240,232,.5)`,
        color: h ? G : WL,
        background: h ? 'rgba(245,240,232,.1)' : 'transparent',
        transform: h ? 'translateY(-2px)' : 'none',
      }
    : outline
    ? {
        ...base,
        border: `1px solid ${h ? G : BDR2}`,
        color: h ? '#fff' : W,
        background: h ? G : 'transparent',
        transform: h ? 'translateY(-2px)' : 'none',
      }
    : {
        ...base,
        background: h
          ? `linear-gradient(135deg,${GL},${G})`
          : `linear-gradient(135deg,${G},#9a7228)`,
        color: BG, border: 'none',
        boxShadow: h ? `0 8px 36px rgba(201,168,76,.45)` : '0 2px 14px rgba(201,168,76,.12)',
        transform: h ? 'translateY(-2px)' : 'none',
      }
  return (
    <Tag
      {...tagProps}
      data-testid={testId}
      className={!outline && !outlineLight ? 'shimmer-btn' : ''}
      style={style}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
    >
      {Icon && <Icon size={15} strokeWidth={outline ? 1.6 : 1.8} />}
      {children}
    </Tag>
  )
}

const LeadContext = createContext(() => {})

const LEAD_FIELD = {
  width: '100%', padding: '14px 16px', background: BG,
  border: `1px solid ${BDR}`, color: W, fontFamily: B, fontSize: 15,
  outline: 'none', borderRadius: 1,
}

function LeadModal({ state, onClose }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [sent, setSent] = useState(false)
  useEffect(() => {
    if (state.open) { setName(''); setPhone(''); setSent(false) }
  }, [state.open])
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    if (state.open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [state.open, onClose])
  if (!state.open) return null

  const submit = (e) => {
    e.preventDefault()
    const msg = `Заявка с сайта!\nИмя: ${name}\nТелефон: ${phone}${state.service ? `\nУслуга: ${state.service}` : ''}`
    window.open(`https://t.me/to_palto_atelier?text=${encodeURIComponent(msg)}`, '_blank')
    setSent(true)
  }

  return (
    <div onClick={onClose} data-testid="lead-modal" style={{
      position: 'fixed', inset: 0, zIndex: 500,
      background: 'rgba(5,10,8,.82)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      animation: 'fadeUp .35s ease',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: '100%', maxWidth: 460, background: CARD, border: `1px solid ${G}`,
        padding: '42px 36px', position: 'relative',
      }}>
        <button onClick={onClose} aria-label="Закрыть" data-testid="lead-close" style={{
          position: 'absolute', top: 14, right: 18, background: 'none', border: 'none',
          color: MUT, fontSize: 22, cursor: 'pointer', lineHeight: 1,
        }}>✕</button>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', border: `1px solid ${G}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 22px' }}>
              <CheckCircle2 size={28} strokeWidth={1.4} color={G}/>
            </div>
            <h3 style={{ fontSize: 27, fontFamily: D, color: W, fontStyle: 'italic', fontWeight: 400, marginBottom: 12 }}>Заявка принята</h3>
            <p style={{ color: MUT, fontSize: 14, lineHeight: 1.7, fontFamily: B, fontWeight: 300, marginBottom: 28 }}>
              Спасибо! Мы свяжемся с вами в ближайшее время, чтобы обсудить детали вашего образа.
            </p>
            <Btn href={TG} block icon={Send} testId="lead-tg-btn">Или напишите в Телеграм</Btn>
          </div>
        ) : (
          <>
            <div style={{ color: G, fontSize: 11, letterSpacing: '4px', textTransform: 'uppercase', fontFamily: B, fontWeight: 500, marginBottom: 12 }}>Заявка</div>
            <h3 style={{ fontSize: 28, fontFamily: D, color: W, fontStyle: 'italic', fontWeight: 400, marginBottom: 10, lineHeight: 1.2 }}>Оставьте заявку</h3>
            <p style={{ color: MUT, fontSize: 14, lineHeight: 1.7, fontFamily: B, fontWeight: 300, marginBottom: 26 }}>
              {state.service ? <><span style={{ color: W }}>{state.service}.</span> </> : null}
              Оставьте контакты — перезвоним и обсудим ваш образ. Первая консультация бесплатно.
            </p>
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Ваше имя" data-testid="lead-name" style={LEAD_FIELD} />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} required type="tel" placeholder="Телефон" data-testid="lead-phone" style={LEAD_FIELD} />
              <div style={{ marginTop: 6 }}>
                <Btn type="submit" block icon={Send} testId="lead-submit">Отправить заявку</Btn>
              </div>
            </form>
            <p style={{ color: MUT, fontSize: 11, lineHeight: 1.6, fontFamily: B, fontWeight: 300, marginTop: 16, textAlign: 'center' }}>
              Нажимая кнопку, вы соглашаетесь на обработку персональных данных
            </p>
          </>
        )}
      </div>
    </div>
  )
}

// ============ NAVBAR ============
function Navbar({ scrolled, open, setOpen }) {
  const links = [
    ['services', 'Услуги'],
    ['process', 'Процесс'],
    ['gallery', 'Галерея'],
    ['reviews', 'Отзывы'],
    ['contacts', 'Контакты'],
  ]
  return (
    <nav
      data-testid="navbar"
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background: scrolled ? 'rgba(10,21,16,.96)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: `1px solid ${scrolled ? BDR : 'transparent'}`,
        boxShadow: scrolled ? '0 2px 16px rgba(201,168,76,.08)' : 'none',
        transition: 'background .4s, border-color .4s',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 76 }}>
        <a href="#" data-testid="logo-link" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ color: G, fontSize: 28, fontWeight: 400, letterSpacing: '2px', fontFamily: "'Great Vibes', cursive", lineHeight: 1 }}>Кружева</div>
          <div style={{ color: MUT, fontSize: 8, letterSpacing: '4px', textTransform: 'uppercase', marginTop: 4, fontFamily: B }}>студия индивидуального пошива</div>
        </a>
        <div className="hidden md:flex" style={{ gap: 38, alignItems: 'center' }}>
          {links.map(([id, label]) => <NavLink key={id} href={`#${id}`} scrolled={scrolled}>{label}</NavLink>)}
        </div>
        <div className="hidden md:flex" style={{ gap: 8 }}>
          <Btn href={PHONE_HREF} small icon={Phone} testId="nav-phone-btn">{PHONE}</Btn>
          <Btn href={MAX} small icon={Send} outline testId="nav-max-btn">MAX</Btn>
          <Btn href={TG} small icon={Send} outline testId="nav-telegram-btn">TG</Btn>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="flex md:hidden"
          data-testid="mobile-menu-toggle"
          style={{ background: 'none', border: `1px solid ${BDR}`, color: G, padding: '8px 13px', cursor: 'pointer', fontSize: 17, lineHeight: 1 }}
        >
          {open ? '✕' : '☰'}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.38, ease: [0.16, 0.84, 0.44, 1] }}
            style={{ overflow: 'hidden', background: 'rgba(10,21,16,.99)', borderTop: `1px solid ${BDR}` }}
          >
            <div style={{ padding: '28px 28px 36px', display: 'flex', flexDirection: 'column', gap: 22 }}>
              {links.map(([id, label], i) => (
                <motion.a
                  key={id}
                  href={`#${id}`}
                  onClick={(e) => { e.preventDefault(); setOpen(false); setTimeout(() => scrollToId(id), 320) }}
                  data-testid={`mobile-nav-${id}`}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 + i * 0.07, duration: 0.42, ease: [0.16, 0.84, 0.44, 1] }}
                  style={{ color: W, fontSize: 18, letterSpacing: '3px', textDecoration: 'none', textTransform: 'uppercase', fontFamily: D, fontStyle: 'italic' }}
                >
                  {label}
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.44, duration: 0.4, ease: [0.16, 0.84, 0.44, 1] }}
                style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 12 }}
              >
                <Btn href={MAX} block icon={Send} testId="mobile-max-btn">Написать в MAX</Btn>
                <Btn href={TG} block icon={Send} testId="mobile-telegram-btn">Написать в Телеграм</Btn>
                <Btn href={PHONE_HREF} outline block icon={Phone} testId="mobile-phone-btn">Позвонить</Btn>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

function scrollToId(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function NavLink({ href, children, scrolled }) {
  const [h, setH] = useState(false)
  const baseColor = scrolled ? W : WL
  const id = href.replace('#', '')
  return (
    <a
      href={href}
      onClick={(e) => { e.preventDefault(); scrollToId(id) }}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        position: 'relative',
        color: h ? G : baseColor,
        fontSize: 11, letterSpacing: '2.8px', textDecoration: 'none',
        textTransform: 'uppercase', transition: 'color .3s', fontFamily: B, fontWeight: 500,
        paddingBottom: 4,
      }}
    >
      {children}
      <span style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: 1, background: G,
        transform: h ? 'scaleX(1)' : 'scaleX(0)', transformOrigin: 'left center',
        transition: 'transform .35s cubic-bezier(.2,.8,.2,1)',
      }}/>
    </a>
  )
}

// ============ HERO ============
const heroLine1 = 'Индивидуальный пошив'.split(' ')
const heroLine2 = 'класса люкс'.split(' ')

function Hero() {
  const { scrollY } = useScroll()
  const bgY = useTransform(scrollY, [0, 700], [0, 140])
  const mobile = useIsMobile()

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } }
  const wordAnim = {
    hidden: { y: '110%', opacity: 0 },
    show: { y: '0%', opacity: 1, transition: { duration: 0.75, ease: [0.16, 0.84, 0.44, 1] } }
  }

  return (
    <section data-testid="hero-section"
      style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>

      <motion.div style={{ y: bgY, position: 'absolute', inset: -60, willChange: 'transform' }}>
        <div style={{
          width: '100%', height: '100%',
          backgroundImage: `url(${IMG_HERO})`, backgroundSize: 'cover', backgroundPosition: mobile ? '71% center' : 'center',
          transform: 'scaleX(-1)', animation: 'kenburns 24s ease-in-out infinite alternate',
        }}/>
      </motion.div>

      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(110deg, rgba(10,21,16,.94) 32%, rgba(10,21,16,.55) 65%, rgba(10,21,16,.15) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 72% 50%, rgba(201,168,76,.1) 0%, transparent 55%)', pointerEvents: 'none' }}/>
      <LaceBgPattern opacity={0.05} />

      <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', padding: '148px 28px 120px', width: '100%' }}>
        <div style={{ maxWidth: 760 }}>

          <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 40 }}>
            <GoldLine width={42} />
            <span style={{ color: G, fontSize: 10, letterSpacing: '6px', textTransform: 'uppercase', fontFamily: B, fontWeight: 500 }}>
              Премиальное ателье
            </span>
          </motion.div>

          <h1 style={{ fontSize: 'clamp(28px,5.2vw,78px)', fontWeight: 300, lineHeight: 1.15, marginBottom: 32, fontFamily: D, letterSpacing: '-1px' }}>
            <div style={{ overflow: 'hidden', marginBottom: 4 }}>
              <motion.div variants={container} initial="hidden" animate="show" style={{ display: 'flex', flexWrap: 'wrap', gap: '0 16px' }}>
                {heroLine1.map((w, i) => (
                  <motion.span key={i} variants={wordAnim} style={{ color: WL, display: 'inline-block' }}>{w}</motion.span>
                ))}
              </motion.div>
            </div>
            <div style={{ overflow: 'hidden' }}>
              <motion.div variants={container} initial="hidden" animate="show" style={{ display: 'flex', flexWrap: 'wrap', gap: '0 16px' }}>
                {heroLine2.map((w, i) => (
                  <motion.span key={i} variants={wordAnim}
                    style={{ color: i === 1 ? GL : WL, fontStyle: 'italic', fontWeight: i === 1 ? 400 : 300, display: 'inline-block' }}>
                    {w}
                  </motion.span>
                ))}
              </motion.div>
            </div>
          </h1>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.6 }} style={{ marginBottom: 34 }}>
            <LaceOrnament size={100} opacity={0.5} />
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05, duration: 0.7 }}
            style={{ fontSize: 18, color: 'rgba(245,240,232,.82)', lineHeight: 1.85, marginBottom: 46, maxWidth: 540, fontFamily: B, fontWeight: 300 }}>
            Платья, жакеты, блузки и шубы из натурального меха — для торжеств и для каждого дня. Создаём образы, в которых вы затмите всех.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.7 }}
            style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 44 }}>
            <Btn href={PHONE_HREF} icon={Phone} testId="hero-phone-btn">Позвонить</Btn>
            <Btn href={MAX} outlineLight icon={Send} testId="hero-max-btn">MAX</Btn>
            <Btn href={TG} outlineLight icon={Send} testId="hero-telegram-btn">Телеграм</Btn>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 0.8 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 16, padding: '13px 20px', border: `1px solid ${BDR2}`, background: 'rgba(201,168,76,.06)', backdropFilter: 'blur(8px)' }}>
            <div style={{ display: 'flex', gap: 2 }}>
              {[0,1,2,3,4].map(i => <Star key={i} size={13} fill={G} strokeWidth={0} color={G}/>)}
            </div>
            <div>
              <div style={{ color: WL, fontSize: 13, fontWeight: 500, fontFamily: B }}>5.0 — рейтинг на 2ГИС</div>
              <div style={{ color: 'rgba(245,240,232,.65)', fontSize: 11, letterSpacing: '1px', fontFamily: B, fontWeight: 300 }}>13 отзывов · Нас рекомендуют</div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

// ============ MARQUEE ============
function Marquee() {
  const items = ['ПЛАТЬЯ', 'ЖАКЕТЫ', 'ШУБЫ ИЗ МЕХА', 'ЖАКЕТ ШАНЕЛЬ', 'БЛУЗКИ', 'ИНДИВИДУАЛЬНЫЙ ПОШИВ', '85% РУЧНОЙ РАБОТЫ', 'КЕМЕРОВО']
  const repeated = [...items, ...items]
  return (
    <div style={{ background: G, overflow: 'hidden', padding: '14px 0', borderTop: `1px solid rgba(201,168,76,.3)` }}>
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 22, ease: 'linear', repeat: Infinity }}
        style={{ display: 'flex', width: 'max-content', gap: 0 }}
      >
        {repeated.map((item, i) => (
          <span key={i} style={{ color: BG, fontSize: 11, fontFamily: B, fontWeight: 600, letterSpacing: '3px', padding: '0 36px', whiteSpace: 'nowrap' }}>
            {item} <span style={{ opacity: 0.4 }}>·</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}

// ============ TRUST BANNER ============
function TrustBanner() {
  const stats = [
    { num: '500+', label: 'созданных образов' },
    { num: '25+',  label: 'лет на рынке' },
    { num: '98%',  label: 'клиентов возвращаются' },
    { num: '5.0',  label: 'рейтинг на 2ГИС' },
  ]
  return (
    <section style={{ padding: '76px 28px', background: CARD, borderTop: `1px solid ${BDR}`, borderBottom: `1px solid ${BDR}`, position: 'relative', overflow: 'hidden' }}>
      <LaceBgPattern opacity={0.035}/>
      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))', gap: 48, textAlign: 'center' }}>
          {stats.map((s, i) => (
            <Reveal key={i} delay={i*80}>
              <div style={{ color: G, fontSize: 58, fontFamily: D, fontWeight: 300, fontStyle: 'italic', marginBottom: 10, lineHeight: 1 }}>{s.num}</div>
              <div style={{ color: MUT, fontSize: 13, letterSpacing: '1.5px', fontFamily: B, fontWeight: 300 }}>{s.label}</div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={350}>
          <div style={{ marginTop: 64, textAlign: 'center', padding: '30px 36px', background: BG, border: `1px solid ${G}`, maxWidth: 760, margin: '64px auto 0', position: 'relative' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: G, fontSize: 11, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: 14, fontFamily: B, fontWeight: 500 }}>
              <Zap size={14} strokeWidth={1.8}/>
              Успейте записаться
            </div>
            <div style={{ color: W, fontSize: 21, fontFamily: D, fontWeight: 400, fontStyle: 'italic', marginBottom: 10, lineHeight: 1.4 }}>В работе не более 8 заказов одновременно</div>
            <div style={{ color: MUT, fontSize: 14, fontFamily: B, fontWeight: 300, lineHeight: 1.7 }}>Принимаем ограниченное количество клиентов для сохранения высокого качества</div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ============ SERVICE QUIZ ============
const IDEA_OPTIONS = [
  { id: 'clear',   title: 'Уже знаю, чего хочу',        desc: 'У меня есть чёткое представление об изделии',          Icon: CheckCircle2, mult: 1,    tg: 'я уже знаю, чего хочу' },
  { id: 'help',    title: 'Есть идея — помогите доработать', desc: 'Подскажем фасон, цвет и детали, дополним образ',   Icon: Sparkles,     mult: 1.15, tg: 'есть идея, нужна помощь её доработать' },
  { id: 'turnkey', title: 'Образ под ключ',             desc: 'Доверюсь вам полностью — от концепции до готового изделия', Icon: Crown,    mult: 1.3,  tg: 'хочу образ под ключ — придумайте за меня' },
]

const FABRIC_OPTIONS = [
  { id: 'catalog', title: 'Подберём вместе',          desc: 'Выберем подходящую ткань из нашего каталога', Icon: Gem,      mult: 1,    tg: 'ткань подберём вместе' },
  { id: 'own',     title: 'Принесу свою ткань',       desc: 'У меня уже есть материал для изделия',         Icon: Scissors, mult: 0.9,  tg: 'у меня своя ткань' },
  { id: 'premium', title: 'Только премиальные ткани', desc: 'Шёлк, кружево, благородные материалы',         Icon: Award,    mult: 1.45, tg: 'хочу премиальные ткани' },
]


function CalcOption({ title, desc, Icon, active, onClick, testId }) {
  const [h, setH] = useState(false)
  const on = h || active
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      data-testid={testId}
      style={{
        display: 'flex', alignItems: 'center', gap: 16, width: '100%', textAlign: 'left',
        padding: desc ? '16px 20px' : '14px 20px', cursor: 'pointer',
        background: active ? CARD2 : BG,
        border: `1px solid ${active ? G : BDR}`,
        transition: 'background .35s, border-color .35s, transform .35s cubic-bezier(.2,.8,.2,1)',
        transform: on ? 'translateY(-3px)' : 'none',
      }}
    >
      <div style={{
        width: 48, height: 48, flexShrink: 0, borderRadius: 4,
        background: active ? `linear-gradient(135deg, ${G}, #9a7228)` : 'rgba(201,168,76,.08)',
        border: `1px solid ${active ? G : BDR}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .35s',
      }}>
        <Icon size={23} strokeWidth={1.3} color={active ? BG : G}/>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ color: W, fontSize: 18, fontFamily: D, fontWeight: 400, fontStyle: 'italic', marginBottom: desc ? 3 : 0 }}>{title}</div>
        {desc && <div style={{ color: MUT, fontSize: 13, lineHeight: 1.5, fontFamily: B, fontWeight: 300 }}>{desc}</div>}
      </div>
      <ArrowRight size={18} strokeWidth={1.5} color={on ? G : 'rgba(138,176,154,.4)'} style={{ flexShrink: 0, transition: 'color .35s' }}/>
    </button>
  )
}

function StepHeading({ kicker, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ color: G, fontSize: 11, letterSpacing: '4px', textTransform: 'uppercase', fontFamily: B, fontWeight: 500, marginBottom: 8 }}>{kicker}</div>
      <h3 style={{ fontSize: 'clamp(22px,2.6vw,30px)', fontFamily: D, color: W, fontWeight: 300, fontStyle: 'italic', lineHeight: 1.2 }}>{children}</h3>
    </div>
  )
}

function DreamCalculator() {
  const [step, setStep] = useState(0)
  const [idea, setIdea] = useState(null)
  const [fabric, setFabric] = useState(null)
  const mobile = useIsMobile()

  const reset = () => { setStep(0); setIdea(null); setFabric(null) }

  const id = IDEA_OPTIONS.find(o => o.id === idea)
  const fb = FABRIC_OPTIONS.find(o => o.id === fabric)

  const STEPS_TOTAL = 2
  const progress = step >= STEPS_TOTAL ? STEPS_TOTAL : step

  let tgLink = TG
  if (id && fb) {
    const msg = `Здравствуйте! Хочу обсудить пошив в ателье «Кружева». По идее — ${id.tg}, ${fb.tg}. Подскажите по срокам и деталям?`
    tgLink = `https://t.me/to_palto_atelier?text=${encodeURIComponent(msg)}`
  }

  return (
    <section data-testid="calculator-section" style={{ padding: mobile ? '56px 20px' : '76px 28px', background: BG, borderTop: `1px solid ${BDR}`, borderBottom: `1px solid ${BDR}`, position: 'relative', overflow: 'hidden' }}>
      <LaceBgPattern opacity={0.04}/>
      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h2 style={{ fontSize: 'clamp(26px,3.2vw,40px)', fontFamily: D, color: W, fontWeight: 300, letterSpacing: '-0.5px', marginBottom: 14 }}>
              Создадим одежду <span style={{ color: G, fontStyle: 'italic' }}>вашей мечты</span>
            </h2>
            <p style={{ color: MUT, fontSize: 15, maxWidth: 600, margin: '0 auto', lineHeight: 1.7, fontFamily: B, fontWeight: 300 }}>
              Поможем сформулировать идею и подобрать ткань. Ответьте на 2 вопроса — покажем ориентир по стоимости.
            </p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            {/* Progress */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              {[0,1].map(i => {
                const active = i <= progress - 1 || step >= STEPS_TOTAL
                return (
                  <div key={i} style={{ flex: 1, height: 3, background: BDR, position: 'relative', overflow: 'hidden', borderRadius: 2 }}>
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: active ? 1 : 0 }}
                      transition={{ duration: 0.55, ease: [0.16, 0.84, 0.44, 1], delay: active ? i * 0.12 : 0 }}
                      style={{ position: 'absolute', inset: 0, background: G, transformOrigin: 'left' }}
                    />
                  </div>
                )
              })}
              <motion.span
                key={step}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                style={{ color: step >= STEPS_TOTAL ? G : MUT, fontSize: 12, fontFamily: B, fontWeight: 400, letterSpacing: '1px', minWidth: 38, textAlign: 'right' }}
              >
                {step >= STEPS_TOTAL ? '✓' : `${step + 1}/2`}
              </motion.span>
            </div>

            <div style={{ background: BG, border: `1px solid ${BDR}`, padding: mobile ? '24px 18px' : '32px 36px', minHeight: 260, display: 'flex', flexDirection: 'column' }}>
              {/* Step 0 — idea */}
              {step === 0 && (
                <div style={{ animation: 'fadeUp .5s cubic-bezier(.2,.8,.2,1)' }}>
                  <StepHeading kicker="Шаг 1 · Идея">Насколько проработан образ?</StepHeading>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {IDEA_OPTIONS.map(o => (
                      <CalcOption key={o.id} title={o.title} desc={o.desc} Icon={o.Icon}
                        active={idea === o.id} testId={`calc-idea-${o.id}`}
                        onClick={() => { setIdea(o.id); setStep(1) }} />
                    ))}
                  </div>
                </div>
              )}

              {/* Step 1 — fabric */}
              {step === 1 && (
                <div style={{ animation: 'fadeUp .5s cubic-bezier(.2,.8,.2,1)' }}>
                  <StepHeading kicker="Шаг 2 · Ткань">Из какой ткани шьём?</StepHeading>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {FABRIC_OPTIONS.map(o => (
                      <CalcOption key={o.id} title={o.title} desc={o.desc} Icon={o.Icon}
                        active={fabric === o.id} testId={`calc-fabric-${o.id}`}
                        onClick={() => { setFabric(o.id); setStep(2) }} />
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2 — result */}
              {step >= STEPS_TOTAL && id && fb && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.55, ease: [0.16, 0.84, 0.44, 1] }}
                  style={{ textAlign: 'center', margin: 'auto 0' }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.4 }}
                    style={{ color: G, fontSize: 11, letterSpacing: '4px', textTransform: 'uppercase', fontFamily: B, fontWeight: 500, marginBottom: 16 }}
                  >
                    Отлично, мы готовы помочь
                  </motion.div>
                  <SparklesText style={{ display: 'block', marginBottom: 10 }}>
                  <h3 style={{ color: W, fontSize: 'clamp(22px,2.8vw,32px)', fontFamily: D, fontWeight: 300, fontStyle: 'italic', lineHeight: 1.2 }}>
                    Обсудим детали и назовём точную цену
                  </h3>
                  </SparklesText>
                  <p style={{ color: MUT, fontSize: 14, fontFamily: B, fontWeight: 300, lineHeight: 1.7, maxWidth: 460, margin: '0 auto 26px' }}>
                    Первая консультация — бесплатно, без обязательств.
                  </p>
                  <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 18 }}>
                    <Btn href={tgLink} large icon={Send} testId="calc-cta-btn">Обсудить в Телеграм</Btn>
                    <Btn href={PHONE_HREF} outline large icon={Phone} testId="calc-phone-btn">Позвонить</Btn>
                  </div>
                  <button onClick={reset} data-testid="calc-reset-btn" style={{ background: 'none', border: 'none', color: MUT, fontSize: 13, fontFamily: B, cursor: 'pointer', letterSpacing: '0.5px', textDecoration: 'underline', textUnderlineOffset: 4 }}>
                    Посчитать заново
                  </button>
                </motion.div>
              )}

              {/* Back control */}
              {step > 0 && step < STEPS_TOTAL && (
                <button onClick={() => setStep(step - 1)} data-testid="calc-back-btn" style={{ marginTop: 28, alignSelf: 'flex-start', background: 'none', border: 'none', color: MUT, fontSize: 13, fontFamily: B, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, letterSpacing: '0.5px' }}>
                  <ChevronLeft size={15} strokeWidth={1.6}/> Назад
                </button>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ============ SERVICES ============
const SERVICES = [
  { num: '01', title: 'Вечерние и выпускные платья',   tag: 'Люкс',      desc: 'Эксклюзивные наряды для торжеств и особенных вечеров. Элитные ткани, изысканный крой, безупречная посадка.', img: IMG_EVENING },
  { num: '02', title: 'Свадебные платья',              tag: 'Люкс',      desc: 'Платье вашей мечты создаётся с нуля. Индивидуальный дизайн, премиальные ткани, внимание к каждой детали.',     img: R('photo_101.jpg') },
  { num: '03', title: 'Коктейльные платья',            tag: 'Люкс',      desc: 'Элегантность для камерных мероприятий. Утончённые силуэты, благородные ткани, безупречное исполнение.',        img: R('photo_102.jpg') },
  { num: '04', title: 'Жакет в стиле Шанель',         tag: 'Эксклюзив', desc: 'Единственный мастер в Кемерово, шьющий жакеты кутюрным способом. Каждая деталь создаётся вручную.', img: R('photo_103.jpg') },
  { num: '05', title: 'Деловые жакеты и костюмы',     tag: 'Пошив',     desc: 'Женские жакеты и костюмы с безупречной посадкой. Премиальные ткани, ручная отделка, строгий элегантный силуэт.', img: IMG_BUSINESS },
  { num: '06', title: 'Блузки и рубашки',             tag: 'Пошив',     desc: 'Женские блузки и рубашки по индивидуальным меркам. Идеальная посадка, качественные ткани, неповторимый стиль.', img: IMG_BLOUSE },
  { num: '07', title: 'Шубы, мех и натуральная кожа', tag: 'Пошив',     desc: 'Пошив шуб из натурального меха, изделий из кожи и замши. Реставрация меховых изделий. Премиальное качество.',    img: R('photo_105.jpg') },
  { num: '08', title: 'Повседневная одежда',          tag: 'Пошив',     desc: 'Стильные вещи на каждый день — пальто, жакеты, юбки. Благородные ткани, выверенный крой, безупречная отделка.',  img: R('photo_107.jpg') },
  { num: '09', title: 'Тренч',                        tag: 'Пошив',     desc: 'Классический тренч и пальто по индивидуальным меркам. Выверенный крой, премиальные ткани, безупречная посадка.',   img: R('photo_106.jpg') },
  { num: '10', title: 'Пальто',                       tag: 'Пошив',     desc: 'Пальто по индивидуальным меркам. Классические и авторские силуэты, премиальные ткани, безупречная посадка.',          img: R('photo_108.jpg') },
]

function SvcCard({ num, title, tag, desc, img, index }) {
  const [hovered, setHovered] = useState(false)
  const openLead = useContext(LeadContext)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.3) }}
      onClick={() => openLead(`Услуга: ${title}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="button" tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLead(`Услуга: ${title}`) } }}
      data-testid={`service-card-${title}`}
      style={{
        flex: '0 0 280px',
        width: 280,
        height: 420,
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        border: `1px solid ${hovered ? BDR2 : BDR}`,
        outline: 'none',
        transition: 'border-color .35s',
        flexShrink: 0,
      }}
    >
      {/* Photo */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${img})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        transform: hovered ? 'scale(1.06)' : 'scale(1)',
        transition: 'transform 1.1s cubic-bezier(.2,.8,.2,1)',
      }} />

      {/* Always-on gradient + bottom title */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(10,21,16,.95) 0%, rgba(10,21,16,.4) 45%, rgba(10,21,16,.15) 100%)',
        transition: 'opacity .4s',
        opacity: hovered ? 0 : 1,
      }} />

      {/* Hover overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(10,21,16,.98) 0%, rgba(10,21,16,.85) 100%)',
        opacity: hovered ? 1 : 0,
        transition: 'opacity .4s',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: '28px 24px',
      }}>
        <div style={{ width: 36, height: 1, background: G, marginBottom: 16 }} />
        <p style={{ color: MUT, fontSize: 13, lineHeight: 1.75, fontFamily: B, fontWeight: 300, marginBottom: 24 }}>{desc}</p>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: GL, fontSize: 10, letterSpacing: '2.5px', textTransform: 'uppercase', fontFamily: B, fontWeight: 500 }}>
          Оставить заявку <ArrowRight size={13} strokeWidth={1.8}/>
        </span>
      </div>

      {/* Number — top left */}
      <div style={{
        position: 'absolute', top: 20, left: 20,
        color: G, fontSize: 11, letterSpacing: '3px', fontFamily: B, fontWeight: 500,
        opacity: hovered ? 0.6 : 1, transition: 'opacity .3s',
      }}>{num}</div>

      {/* Tag — top right */}
      <div style={{
        position: 'absolute', top: 18, right: 18,
        background: 'rgba(10,21,16,.75)', backdropFilter: 'blur(6px)',
        border: `1px solid ${BDR}`,
        color: G, fontSize: 9, letterSpacing: '2.5px', textTransform: 'uppercase',
        fontFamily: B, fontWeight: 500, padding: '5px 10px',
      }}>{tag}</div>

      {/* Title — bottom (hidden on hover, replaced by overlay) */}
      <div style={{
        position: 'absolute', bottom: 24, left: 24, right: 24,
        opacity: hovered ? 0 : 1, transition: 'opacity .25s',
      }}>
        <h3 style={{
          fontSize: 20, fontFamily: D, color: W, fontWeight: 400,
          fontStyle: 'italic', lineHeight: 1.25,
        }}>{title}</h3>
      </div>
    </motion.div>
  )
}

function Services() {
  const mobile = useIsMobile()
  const scrollRef = useRef(null)
  const [activeIdx, setActiveIdx] = useState(0)
  const touchStartX = useRef(null)

  const cardW = mobile ? Math.round(window !== undefined ? window.innerWidth * 0.78 : 260) : 280
  const gap = 16

  const scrollTo = (i) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ left: i * (cardW + gap), behavior: 'smooth' })
    setActiveIdx(i)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => {
      const i = Math.round(el.scrollLeft / (cardW + gap))
      setActiveIdx(Math.min(i, SERVICES.length - 1))
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [cardW, gap])

  return (
    <section id="services" data-testid="services-section" style={{ background: BG, position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: mobile ? '72px 0 0' : '120px 0 0' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: mobile ? 48 : 72, padding: '0 28px' }}>
            <SectionEye>Наши услуги</SectionEye>
            <h2 style={{ fontSize: 'clamp(38px,4.7vw,64px)', fontFamily: D, color: W, lineHeight: 1.1, fontWeight: 300, letterSpacing: '-0.6px' }}>
              Эксклюзивный <span style={{ color: G, fontStyle: 'italic' }}>пошив</span>
            </h2>
            <p style={{ color: MUT, fontSize: 16, maxWidth: 540, margin: '22px auto 0', lineHeight: 1.85, fontFamily: B, fontWeight: 300 }}>
              Создаём изделия для людей, которые ценят качество, стиль и внимание к деталям
            </p>
          </div>
        </Reveal>

        {/* Scroll strip */}
        <div style={{ position: 'relative' }}>
          {/* Left fade */}
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 48, background: `linear-gradient(to right, ${BG}, transparent)`, zIndex: 10, pointerEvents: 'none' }} />
          {/* Right fade */}
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 48, background: `linear-gradient(to left, ${BG}, transparent)`, zIndex: 10, pointerEvents: 'none' }} />

          {!mobile && (
            <>
              <button
                aria-label="Предыдущая услуга"
                onClick={() => scrollTo(Math.max(0, activeIdx - 1))}
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', zIndex: 20, background: G, border: 'none', color: BG, width: 44, height: 44, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <ChevronLeft size={20}/>
              </button>
              <button
                aria-label="Следующая услуга"
                onClick={() => scrollTo(Math.min(SERVICES.length - 1, activeIdx + 1))}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', zIndex: 20, background: G, border: 'none', color: BG, width: 44, height: 44, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <ChevronRight size={20}/>
              </button>
            </>
          )}

          <div
            ref={scrollRef}
            style={{
              display: 'flex',
              gap,
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              padding: mobile ? '0 11vw' : '0 72px',
              paddingBottom: 4,
            }}
          >
            <style>{`
              div::-webkit-scrollbar { display: none; }
            `}</style>
            {SERVICES.map((s, i) => (
              <div key={i} style={{ scrollSnapAlign: 'center', flexShrink: 0 }}>
                <SvcCard {...s} index={i} />
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, margin: '24px 0 0' }}>
          {SERVICES.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              aria-label={`Услуга ${i + 1}`}
              style={{
                width: i === activeIdx ? 28 : 8, height: 8,
                background: i === activeIdx ? G : BDR2,
                border: 'none', cursor: 'pointer', padding: 0,
                borderRadius: 4, transition: 'all .3s',
              }}
            />
          ))}
        </div>
      </div>
      <div style={{ height: mobile ? 64 : 96 }} />
    </section>
  )
}

// ============ VIDEO ============
function VideoSection() {
  const mobile = useIsMobile()
  const VIDS = ['/real/video_01.mp4', '/real/video_02.mp4', '/real/video_03.mp4', '/real/video_04.mp4', '/real/video_05.mp4', '/real/video_06.mp4', '/real/video_07.mp4', '/real/video_08.mp4', '/real/video_09.mp4']
  const [center, setCenter] = useState(0)
  const n = VIDS.length
  const mod = (i) => ((i % n) + n) % n
  const goTo = (dir) => setCenter(i => mod(i + dir))
  const touchStartX = useRef(null)
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 40) goTo(dx < 0 ? 1 : -1)
    touchStartX.current = null
  }

  const slots = mobile
    ? [center]
    : [mod(center - 1), center, mod(center + 1)]

  return (
    <section style={{ padding: mobile ? '64px 0' : '100px 28px', background: CARD, borderTop: `1px solid ${BDR}`, overflow: 'hidden' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 44, padding: mobile ? '0 20px' : 0 }}>
            <SectionEye>Процесс создания</SectionEye>
            <h2 style={{ fontSize: 'clamp(30px,3.8vw,50px)', fontFamily: D, color: W, fontWeight: 300, letterSpacing: '-0.5px' }}>
              Как рождается <span style={{ color: G, fontStyle: 'italic' }}>ваш образ</span>
            </h2>
          </div>
        </Reveal>

        <div style={{ position: 'relative' }}>
          <div
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            style={{ display: 'flex', gap: mobile ? 0 : 20, justifyContent: 'center', alignItems: 'center', padding: mobile ? 0 : 0 }}>
            {slots.map((idx, pos) => {
              const isCenter = mobile || pos === 1
              return (
                <div
                  key={`${idx}-${pos}`}
                  onClick={() => !isCenter && goTo(pos === 0 ? -1 : 1)}
                  style={{
                    flex: `0 0 ${isCenter ? (mobile ? '100vw' : '320px') : '260px'}`,
                    width: isCenter ? (mobile ? '100vw' : 320) : 260,
                    aspectRatio: '9/16',
                    maxHeight: mobile ? '85vh' : 560,
                    position: 'relative', overflow: 'hidden',
                    border: `2px solid ${isCenter ? G : BDR}`,
                    background: '#111',
                    transition: 'all .4s cubic-bezier(.2,.8,.2,1)',
                    opacity: isCenter ? 1 : 0.5,
                    transform: isCenter ? 'scale(1)' : 'scale(0.9)',
                    cursor: isCenter ? 'default' : 'pointer',
                    flexShrink: 0,
                  }}
                >
                  <video
                    key={idx}
                    src={VIDS[idx]}
                    autoPlay={isCenter} muted loop playsInline controls={isCenter}
                    preload={isCenter ? 'auto' : 'metadata'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
              )
            })}
          </div>

          <button aria-label="Предыдущее видео" onClick={() => goTo(-1)} style={{ position: 'absolute', left: mobile ? 8 : -20, top: '50%', transform: 'translateY(-50%)', background: G, border: 'none', color: '#fff', width: 44, height: 44, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
            <ChevronLeft size={22}/>
          </button>
          <button aria-label="Следующее видео" onClick={() => goTo(1)} style={{ position: 'absolute', right: mobile ? 8 : -20, top: '50%', transform: 'translateY(-50%)', background: G, border: 'none', color: '#fff', width: 44, height: 44, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
            <ChevronRight size={22}/>
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
          {VIDS.map((_, i) => (
            <button key={i} aria-label={`Видео ${i + 1}`} onClick={() => setCenter(i)} style={{ width: i === center ? 28 : 8, height: 8, background: i === center ? G : BDR2, border: 'none', cursor: 'pointer', padding: 0, borderRadius: 4, transition: 'all .3s' }} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ============ PROCESS ============
const STEPS = [
  { num: '01', title: 'Консультация',      desc: 'Обсуждаем ваши пожелания, стиль, ткань и бюджет. Первый визит — бесплатно, без обязательств.' },
  { num: '02', title: 'Снятие мерок',      desc: 'Индивидуальные замеры в ателье. Учитываем все особенности вашей фигуры для идеальной посадки.' },
  { num: '03', title: 'Создание',          desc: 'Мастер воплощает ваш образ с вниманием к каждой детали. Только качественные материалы.' },
  { num: '04', title: 'Финальная примерка', desc: 'Все примерки включены в стоимость. Дорабатываем до идеального результата.' },
]

function Process() {
  const mobile = useIsMobile()
  return (
    <section id="process" data-testid="process-section" style={{ padding: mobile ? '72px 20px' : '120px 28px', background: CARD, position: 'relative', overflow: 'hidden' }}>
      <LaceBgPattern opacity={0.035}/>
      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 80 }}>
            <SectionEye>Как мы работаем</SectionEye>
            <h2 style={{ fontSize: 'clamp(38px,4.7vw,64px)', fontFamily: D, color: W, fontWeight: 300, letterSpacing: '-0.6px' }}>
              Четыре шага к вашему <span style={{ color: G, fontStyle: 'italic' }}>образу</span>
            </h2>
          </div>
        </Reveal>

        <div style={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', alignItems: mobile ? 'stretch' : 'flex-start', gap: 0 }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: mobile ? 'row' : 'column', alignItems: mobile ? 'flex-start' : 'center', position: 'relative' }}>
              {/* Connecting line */}
              {i < STEPS.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0, scaleY: mobile ? 0 : 1 }}
                  whileInView={{ scaleX: mobile ? 1 : 1, scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.2, ease: 'easeOut' }}
                  style={{
                    position: 'absolute',
                    ...(mobile
                      ? { left: 28, top: 58, width: 1, height: 'calc(100% - 58px)', transformOrigin: 'top', background: `linear-gradient(to bottom, ${G}, transparent)` }
                      : { top: 28, left: '50%', width: '100%', height: 1, transformOrigin: 'left', background: `linear-gradient(to right, ${G}, rgba(201,168,76,.2))` }
                    ),
                  }}
                />
              )}
              <Reveal delay={i * 130} style={{ width: '100%', padding: mobile ? '0 0 40px 0' : '0 16px 0', display: 'flex', flexDirection: mobile ? 'row' : 'column', alignItems: mobile ? 'flex-start' : 'center', gap: mobile ? 20 : 0 }}>
                {/* Number circle */}
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.13, type: 'spring', stiffness: 200 }}
                  style={{ flexShrink: 0, width: 56, height: 56, borderRadius: '50%', border: `1px solid ${G}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `radial-gradient(circle, rgba(201,168,76,.15), transparent)`, color: G, fontSize: 18, fontFamily: D, fontStyle: 'italic', fontWeight: 400, zIndex: 1, marginBottom: mobile ? 0 : 28 }}
                >
                  {s.num}
                </motion.div>
                <div style={{ textAlign: mobile ? 'left' : 'center', paddingTop: mobile ? 4 : 0 }}>
                  <h3 style={{ fontSize: 18, fontFamily: D, color: W, marginBottom: 10, fontWeight: 400, fontStyle: 'italic' }}>{s.title}</h3>
                  <p style={{ color: MUT, fontSize: 13, lineHeight: 1.75, fontFamily: B, fontWeight: 300 }}>{s.desc}</p>
                </div>
              </Reveal>
            </div>
          ))}
        </div>

        <Reveal>
          <div style={{ marginTop: 56, position: 'relative', height: mobile ? 260 : 420, overflow: 'hidden', border: `1px solid ${BDR}` }}>
            <img loading="lazy" src={IMG_PROCESS} alt="Процесс работы" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,21,16,.55)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(10,21,16,.94) 0%, rgba(10,21,16,.35) 65%)', display: 'flex', alignItems: 'center', padding: '0 56px' }}>
              <div style={{ maxWidth: 520 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: G, fontSize: 11, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: 18, fontFamily: B, fontWeight: 500 }}>
                  <Gem size={14} strokeWidth={1.6}/>
                  Первая консультация бесплатно
                </div>
                <h3 style={{ fontSize: 'clamp(28px,3.2vw,46px)', fontFamily: D, color: WL, fontWeight: 400, fontStyle: 'italic', lineHeight: 1.2, marginBottom: 24 }}>
                  Обсудим ваш образ и подберём ткани
                </h3>
                <Btn href={TG} large icon={Send} testId="process-cta-btn">Записаться на консультацию</Btn>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function StepCard({ num, title, desc }) {
  const [h, setH] = useState(false)
  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: BG, padding: '40px 32px',
        border: `1px solid ${h ? BDR2 : BDR}`,
        position: 'relative',
        transition: 'all .4s cubic-bezier(.2,.8,.2,1)',
        transform: h ? 'translateY(-4px)' : 'none',
        boxShadow: h ? '0 14px 36px rgba(0,0,0,.45)' : 'none',
        overflow: 'hidden',
        height: '100%',
      }}
    >
      <div style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 58, height: 58, border: `1px solid ${G}`,
        color: G, fontSize: 26, fontFamily: D, fontWeight: 400, letterSpacing: '1px',
        marginBottom: 26, fontStyle: 'italic',
        background: h ? `linear-gradient(135deg, rgba(201,168,76,.15), transparent)` : 'transparent',
        transition: 'background .4s',
      }}>
        {num}
      </div>
      <h3 style={{ fontSize: 24, fontFamily: D, color: W, marginBottom: 14, fontWeight: 400, letterSpacing: '0.5px', fontStyle: 'italic' }}>{title}</h3>
      <div style={{ width: h ? 52 : 32, height: 1, background: G, marginBottom: 16, transition: 'width .4s' }} />
      <p style={{ color: MUT, fontSize: 14, lineHeight: 1.85, fontFamily: B, fontWeight: 300 }}>{desc}</p>
    </div>
  )
}

// ============ ADDITIONAL SERVICES ============
const EXTRA_SERVICES = [
  { title: 'Ремонт одежды',          desc: 'Починка швов, замена подкладки, реставрация изделий',                      img: IMG_REPAIR,   Icon: Scissors },
  { title: 'Подгонка по фигуре',      desc: 'Ушивание, расставление, укорачивание — идеальная посадка гарантирована',   img: IMG_SEWING,   Icon: Shirt },
  { title: 'Реставрация меха',        desc: 'Реставрация шуб и меховых изделий, перекрой, замена подкладки',            img: R('photo_105.jpg'), Icon: Sparkles },
  { title: 'Перешив и обновление',    desc: 'Дадим вещи новую жизнь: обновление модели, апсайклинг любимых нарядов',   img: IMG_FABRIC,   Icon: Gem },
]

function AdditionalServices() {
  return (
    <section style={{ padding: '120px 28px', background: BG, position: 'relative' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <SectionEye>Дополнительно</SectionEye>
            <h2 style={{ fontSize: 'clamp(38px,4.7vw,64px)', fontFamily: D, color: W, fontWeight: 300, letterSpacing: '-0.6px', marginBottom: 18 }}>
              Ремонт и <span style={{ color: G, fontStyle: 'italic' }}>реставрация</span>
            </h2>
            <p style={{ color: MUT, fontSize: 16, maxWidth: 580, margin: '0 auto', lineHeight: 1.85, fontFamily: B, fontWeight: 300 }}>
              Подгонка по фигуре, ремонт, реставрация меховых изделий — стоимость уточняйте при обращении
            </p>
          </div>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))', gap: 24 }}>
          {EXTRA_SERVICES.map((s, i) => (
            <Reveal key={i} delay={i*90}>
              <ExtraCard {...s}/>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function ExtraCard({ title, desc, img, Icon }) {
  const [h, setH] = useState(false)
  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: CARD, border: `1px solid ${h ? BDR2 : BDR}`,
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
        transition: 'background .45s, border-color .45s, transform .45s cubic-bezier(.2,.8,.2,1), box-shadow .45s',
        transform: h ? 'translateY(-5px) translateZ(0)' : 'translateZ(0)',
        boxShadow: h ? '0 18px 48px rgba(0,0,0,.5)' : 'none',
        height: '100%',
      }}
    >
      <div style={{ height: 280, overflow: 'hidden', position: 'relative', background: CARD, transform: 'translateZ(0)', isolation: 'isolate' }}>
        <div style={{
          position: 'absolute', inset: -1,
          backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center',
          transform: h ? 'scale(1.08)' : 'scale(1)',
          backfaceVisibility: 'hidden',
          transition: 'transform 1.2s cubic-bezier(.2,.8,.2,1)',
          filter: h ? 'brightness(1.08) saturate(1.1)' : 'brightness(0.9)',
        }}/>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(17,30,23,.96) 0%, transparent 60%)' }} />
        <motion.div
          animate={{ borderColor: h ? G : 'rgba(201,168,76,.4)' }}
          style={{ position: 'absolute', top: 16, left: 16, width: 42, height: 42, border: `1px solid`, background: h ? 'rgba(201,168,76,.15)' : 'rgba(10,21,16,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)', transition: 'background .35s' }}
        >
          <motion.div
            animate={{ rotate: h ? 15 : 0, scale: h ? 1.2 : 1 }}
            transition={{ duration: 0.4, ease: [0.16, 0.84, 0.44, 1] }}
          >
            <Icon size={18} strokeWidth={1.4} color={G}/>
          </motion.div>
        </motion.div>
      </div>
      <div style={{ padding: '28px 26px 32px' }}>
        <h3 style={{ fontSize: 22, fontFamily: D, color: W, marginBottom: 10, fontWeight: 400, fontStyle: 'italic' }}>{title}</h3>
        <div style={{ width: h ? 44 : 28, height: 1, background: G, marginBottom: 14, transition: 'width .4s' }} />
        <p style={{ color: MUT, fontSize: 14, lineHeight: 1.75, fontFamily: B, fontWeight: 300 }}>{desc}</p>
      </div>
    </div>
  )
}

// ============ WHY US ============
const FEATS = [
  { title: '85% ручной работы',        desc: 'Каждое изделие создаётся вручную — от первого стежка до финальной отделки. Машинная строчка лишь там, где это оправдано технологией', Icon: Heart },
  { title: 'Элитные ткани',           desc: 'Работаем только с премиальными материалами: шёлк, кружево, парча, велюр, натуральный мех и кожа от лучших поставщиков', Icon: Gem },
  { title: 'Индивидуальный крой',     desc: 'Каждое изделие создаётся по вашим уникальным меркам. Безупречная посадка гарантирована',         Icon: Scissors },
  { title: 'До 2-х примерок включено', desc: 'Дорабатываем до идеального результата без дополнительной оплаты',                              Icon: CheckCircle2 },
  { title: 'Рейтинг 5.0 на 2ГИС',     desc: '13 отзывов — нас рекомендуют 100% клиентов, ценящих качество',                                  Icon: Award },
]

function WhyUs() {
  const mobile = useIsMobile()
  const photoRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: photoRef, offset: ['start end', 'end start'] })
  const photoY = useTransform(scrollYProgress, [0, 1], [40, -40])

  return (
    <section style={{ padding: mobile ? '72px 20px' : '120px 28px', background: BG, position: 'relative', overflow: 'hidden' }}>
      <LaceBgPattern opacity={0.04}/>
      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: mobile ? 40 : 80, alignItems: 'center' }}>
          <Reveal style={{ flex: '1 1 380px', minWidth: 280, position: 'relative' }}>
            <div ref={photoRef} style={{ position: 'relative', overflow: 'hidden', border: `1px solid ${BDR}` }}>
              <motion.img
                loading="lazy" src={IMG_PORTRAIT} alt="Мастер Инна"
                style={{ width: '100%', height: mobile ? 420 : 580, objectFit: 'cover', objectPosition: 'center 15%', display: 'block', y: mobile ? 0 : photoY }}
              />
              {/* Gold corner accents */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: 40, height: 40, borderTop: `2px solid ${G}`, borderLeft: `2px solid ${G}`, pointerEvents: 'none', zIndex: 1 }}/>
              <div style={{ position: 'absolute', top: 0, right: 0, width: 40, height: 40, borderTop: `2px solid ${G}`, borderRight: `2px solid ${G}`, pointerEvents: 'none', zIndex: 1 }}/>
              <div style={{ position: 'absolute', bottom: 0, left: 0, width: 40, height: 40, borderBottom: `2px solid ${G}`, borderLeft: `2px solid ${G}`, pointerEvents: 'none', zIndex: 1 }}/>
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: 40, height: 40, borderBottom: `2px solid ${G}`, borderRight: `2px solid ${G}`, pointerEvents: 'none', zIndex: 1 }}/>

              <div style={{
                position: 'absolute', bottom: -28, right: -24,
                background: CARD, border: `1px solid ${G}`,
                padding: '26px 32px', boxShadow: '0 12px 48px rgba(0,0,0,.7)',
              }}>
                <div style={{ color: G, fontSize: 46, fontWeight: 300, fontFamily: D, lineHeight: 1, fontStyle: 'italic' }}>25+</div>
                <div style={{ color: MUT, fontSize: 10, letterSpacing: '2.5px', marginTop: 10, fontFamily: B, fontWeight: 400 }}>ЛЕТ БЕЗУПРЕЧНОЙ</div>
                <div style={{ color: MUT, fontSize: 10, letterSpacing: '2.5px', fontFamily: B, fontWeight: 400 }}>РАБОТЫ</div>
              </div>
            </div>
          </Reveal>

          <div style={{ flex: '1 1 380px', minWidth: 280, paddingBottom: 24 }}>
            <Reveal>
              <SectionEye>Наши преимущества</SectionEye>
              <h2 style={{ fontSize: 'clamp(32px,4.1vw,54px)', fontFamily: D, color: W, marginBottom: 50, lineHeight: 1.15, fontWeight: 300, letterSpacing: '-0.5px' }}>
                Почему выбирают<br /><span style={{ color: G, fontStyle: 'italic' }}>именно нас</span>
              </h2>
            </Reveal>
            <motion.div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }} variants={{ visible: { transition: { staggerChildren: 0.12 } } }}>
              {FEATS.map((f, i) => (
                <motion.div key={i} variants={{ hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: [0.16, 0.84, 0.44, 1] } } }}>
                  <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                    <div style={{
                      flexShrink: 0, width: 40, height: 40,
                      border: `1px solid ${G}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'rgba(201,168,76,.06)',
                    }}>
                      <f.Icon size={18} strokeWidth={1.4} color={G}/>
                    </div>
                    <div>
                      <div style={{ color: W, fontSize: 16, fontWeight: 500, marginBottom: 6, fontFamily: B, letterSpacing: '0.3px' }}>{f.title}</div>
                      <div style={{ color: MUT, fontSize: 14, lineHeight: 1.8, fontFamily: B, fontWeight: 300 }}>{f.desc}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            <Reveal delay={500}>
              <div style={{ marginTop: 48 }}>
                <Btn href={PHONE_HREF} large icon={Phone} testId="whyus-cta-btn">Позвонить</Btn>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============ GALLERY ============
function Gallery() {
  const mobile = useIsMobile()
  const items = [
    { src: R('photo_105.jpg'), title: 'Шуба из натурального меха',  span: 1 },
    { src: R('photo_53.jpg'),  title: 'Знак качества',              span: 1 },
    { src: R('photo_104.jpg'), title: 'Жакет Шанель — детали',     span: 1 },
    { src: R('photo_95.jpg'),  title: 'Декор',                      span: 1 },
    { src: R('photo_82.jpg'),  title: '85% ручной работы',          span: 2 },
  ]
  return (
    <section id="gallery" data-testid="gallery-section" style={{ padding: mobile ? '72px 20px' : '120px 28px', background: CARD, position: 'relative' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: mobile ? 48 : 72 }}>
            <SectionEye>Наши работы</SectionEye>
            <h2 style={{ fontSize: 'clamp(34px,4.3vw,58px)', fontFamily: D, color: W, fontWeight: 300, letterSpacing: '-0.5px' }}>
              <span style={{ color: G, fontStyle: 'italic' }}>Галерея</span> мастерства
            </h2>
            <p style={{ color: MUT, fontSize: 15, marginTop: 18, fontFamily: B, fontWeight: 300, maxWidth: 560, margin: '18px auto 0', lineHeight: 1.7 }}>
              Каждое изделие — результат совместного творчества мастера и клиента
            </p>
          </div>
        </Reveal>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          style={{
            display: 'grid',
            gridTemplateColumns: mobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
            gridAutoRows: mobile ? '200px' : '300px',
            gap: 6,
          }}
        >
          {items.map((item, i) => (
            <motion.div
              key={i}
              variants={{ hidden: { opacity: 0, y: 28, scale: 0.97 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.16, 0.84, 0.44, 1] } } }}
              style={{ gridColumn: mobile ? `span ${item.span === 2 ? 2 : 1}` : `span ${item.span}` }}
            >
              <GalleryItem {...item} />
            </motion.div>
          ))}
        </motion.div>
        <Reveal>
          <div style={{ textAlign: 'center', marginTop: 56 }}>
            <Btn href="/gallery" outline large testId="gallery-all-btn">Смотреть все работы</Btn>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function GalleryItem({ src, title }) {
  const [h, setH] = useState(false)
  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        position: 'relative', overflow: 'hidden', cursor: 'pointer',
        border: `1px solid ${h ? BDR2 : 'transparent'}`, transition: 'border .3s',
        width: '100%', height: '100%', background: CARD,
        transform: 'translateZ(0)', isolation: 'isolate',
      }}
    >
      <img
        src={src} alt={title} loading="lazy"
        style={{
          position: 'absolute', inset: -1,
          width: 'calc(100% + 2px)', height: 'calc(100% + 2px)', objectFit: 'cover',
          transition: 'transform 1.2s cubic-bezier(.2,.8,.2,1), filter .4s',
          transform: h ? 'scale(1.08)' : 'scale(1)',
          filter: h ? 'brightness(1.05)' : 'brightness(0.92)',
          backfaceVisibility: 'hidden',
          display: 'block',
        }}
      />
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(to top, rgba(10,21,16,.9) 0%, rgba(10,21,16,.15) 55%)`,
        opacity: h ? 1 : 0.7, transition: 'opacity .35s',
      }} />
      <div style={{ position: 'absolute', bottom: 22, left: 24, right: 24 }}>
        <div style={{ width: h ? 38 : 24, height: 1, background: G, marginBottom: 10, transition: 'width .4s' }} />
        <div style={{
          color: WL, fontSize: 13, letterSpacing: '3px', textTransform: 'uppercase', fontFamily: B, fontWeight: 500,
          transform: h ? 'translateY(0)' : 'translateY(6px)', transition: 'transform .35s',
        }}>{title}</div>
      </div>
    </div>
  )
}

// ============ REVIEWS ============
const REVIEWS = [
  { name: 'Клиент с 2ГИС', text: 'Заказывал пошив пиджака из замши, результатом остался доволен. Инна, спасибо Вам!', date: '2024', svc: 'Пошив пиджака', source: '2ГИС' },
  { name: 'Алёна М.',     text: 'Заказывала свадебное платье — получился настоящий шедевр! Примерялась дважды, каждый раз вносили идеальные правки. Команда внимательная и профессиональная.', date: '2024', svc: 'Свадебное платье', source: '2ГИС' },
  { name: 'Наталья В.',   text: 'Пришла с просьбой перешить старое платье — на выходе получился совершенно новый наряд. Профессионализм, внимание к деталям и тёплая атмосфера — всё на высшем уровне.', date: '2024', svc: 'Переделка изделия', source: '2ГИС' },
  { name: 'Светлана К.',  text: 'Уже третий год заказываю здесь деловые костюмы. Качество, посадка и сроки — всегда безупречны. Ателье для тех, кто ценит настоящее мастерство. Рекомендую всем!', date: '2024', svc: 'Деловые костюмы', source: '2ГИС' },
  { name: 'Марина Т.',    text: 'Заказала жакет в стиле Шанель — это просто произведение искусства. Каждая строчка, каждая деталь и шов — отдельное восхищение. Инна — мастер с золотыми руками!', date: '2024', svc: 'Жакет в стиле Шанель', source: '2ГИС' },
]

function Reviews() {
  const mobile = useIsMobile()
  const [idx, setIdx] = useState(0)
  const [dir, setDir] = useState(1)
  const n = REVIEWS.length
  const reviewTouchX = useRef(null)

  const go = (d) => { setDir(d); setIdx(i => (i + d + n) % n) }
  const onReviewTouchStart = (e) => { reviewTouchX.current = e.touches[0].clientX }
  const onReviewTouchEnd = (e) => {
    if (reviewTouchX.current === null) return
    const dx = e.changedTouches[0].clientX - reviewTouchX.current
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
    reviewTouchX.current = null
  }

  const variants = {
    enter: (d) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.55, ease: [0.16, 0.84, 0.44, 1] } },
    exit: (d) => ({ x: d > 0 ? -80 : 80, opacity: 0, transition: { duration: 0.35 } }),
  }

  const r = REVIEWS[idx]

  return (
    <section id="reviews" data-testid="reviews-section"
      style={{ padding: mobile ? '72px 20px' : '120px 28px', background: CARD, position: 'relative', overflow: 'hidden' }}>
      <LaceBgPattern opacity={0.03}/>

      {/* Big decorative quote background */}
      <div style={{ position: 'absolute', top: mobile ? 20 : 40, left: mobile ? 10 : 60, fontSize: mobile ? 200 : 400,
        fontFamily: D, color: 'rgba(201,168,76,.04)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>&ldquo;</div>

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: mobile ? 48 : 80 }}>
            <SectionEye>Отзывы клиентов</SectionEye>
            <h2 style={{ fontSize: 'clamp(38px,4.7vw,64px)', fontFamily: D, color: W, fontWeight: 300, letterSpacing: '-0.6px' }}>
              Нас <span style={{ color: G, fontStyle: 'italic' }}>рекомендуют</span>
            </h2>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 16 }}>
              {[0,1,2,3,4].map(i => <Star key={i} size={15} fill={G} strokeWidth={0} color={G}/>)}
              <span style={{ color: MUT, fontSize: 13, fontFamily: B, fontWeight: 300, marginLeft: 6 }}>5.0 · 13 отзывов на 2ГИС</span>
            </div>
          </div>
        </Reveal>

        {/* Main review */}
        <div
          onTouchStart={onReviewTouchStart}
          onTouchEnd={onReviewTouchEnd}
          style={{ position: 'relative', minHeight: mobile ? 320 : 280, overflow: 'hidden' }}>
          <AnimatePresence custom={dir} mode="wait">
            <motion.div key={idx} custom={dir} variants={variants} initial="enter" animate="center" exit="exit"
              style={{ padding: mobile ? '40px 24px' : '60px 80px', background: 'rgba(17,30,23,0.6)',
                backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                border: `1px solid ${BDR}`, position: 'relative' }}>

              <div style={{ display: 'flex', gap: 2, marginBottom: 28 }}>
                {[0,1,2,3,4].map(i => <Star key={i} size={16} fill={G} strokeWidth={0} color={G}/>)}
              </div>

              <p style={{ color: W, fontSize: mobile ? 20 : 'clamp(20px,2.2vw,28px)', lineHeight: 1.7,
                marginBottom: 40, fontStyle: 'italic', fontFamily: D, fontWeight: 300, maxWidth: 800 }}>
                &ldquo;{r.text}&rdquo;
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: `linear-gradient(135deg,${G},#9a7228)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: BG, fontSize: 18, fontFamily: D, fontWeight: 400, flexShrink: 0 }}>
                  {r.name[0]}
                </div>
                <div>
                  <div style={{ color: G, fontSize: 16, fontWeight: 500, fontFamily: B }}>{r.name}</div>
                  <div style={{ color: MUT, fontSize: 12, letterSpacing: '1px', marginTop: 3, fontFamily: B, fontWeight: 300 }}>{r.svc} · {r.source}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, marginTop: 40 }}>
          <button aria-label="Предыдущий отзыв" onClick={() => go(-1)} data-testid="review-prev-btn"
            style={{ width: 48, height: 48, background: 'transparent', border: `1px solid ${BDR}`,
              color: G, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all .3s' }}>
            <ChevronLeft size={20}/>
          </button>

          <div style={{ display: 'flex', gap: 8 }}>
            {REVIEWS.map((_, i) => (
              <button key={i} onClick={() => { setDir(i > idx ? 1 : -1); setIdx(i) }}
                style={{ width: i === idx ? 28 : 8, height: 8, background: i === idx ? G : BDR2,
                  border: 'none', cursor: 'pointer', padding: 0, borderRadius: 4, transition: 'all .35s' }}/>
            ))}
          </div>

          <button aria-label="Следующий отзыв" onClick={() => go(1)} data-testid="review-next-btn"
            style={{ width: 48, height: 48, background: 'transparent', border: `1px solid ${BDR}`,
              color: G, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all .3s' }}>
            <ChevronRight size={20}/>
          </button>
        </div>
      </div>
    </section>
  )
}

function ReviewCard({ name, text, date, svc, source }) {
  return (
    <div style={{ padding: '52px 44px', background: CARD, border: `1px solid ${BDR}`, position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', gap: 2, marginBottom: 26 }}>
        {[0,1,2,3,4].map(i => <Star key={i} size={14} fill={G} strokeWidth={0} color={G}/>)}
      </div>
      <p style={{ color: W, fontSize: 19, lineHeight: 1.85, marginBottom: 36, fontStyle: 'italic', fontFamily: D, position: 'relative', zIndex: 1, fontWeight: 300 }}>
        &ldquo;{text}&rdquo;
      </p>
      <div style={{ width: 36, height: 1, background: G, marginBottom: 18 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ color: G, fontSize: 15, fontWeight: 500, fontFamily: B }}>{name}</div>
          <div style={{ color: MUT, fontSize: 12, letterSpacing: '0.5px', marginTop: 4, fontFamily: B, fontWeight: 300 }}>{svc}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: MUT, fontSize: 11, fontFamily: B, fontWeight: 300 }}>{date}</div>
          <div style={{ color: MUT, fontSize: 10, marginTop: 2, fontFamily: B, fontWeight: 300 }}>Отзыв с {source}</div>
        </div>
      </div>
      <div style={{ position: 'absolute', top: 16, right: 28, fontSize: 140, color: 'rgba(201,168,76,.05)', fontFamily: D, lineHeight: 1, userSelect: 'none', fontStyle: 'italic' }}>&ldquo;</div>
    </div>
  )
}

// ============ PRICING ============
function PriceRow({ name, price, note }) {
  const [h, setH] = useState(false)
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, x: -24 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.16, 0.84, 0.44, 1] } } }}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: 'flex', alignItems: 'baseline', gap: 0,
        padding: '18px 12px', borderBottom: `1px solid ${BDR}`,
        background: h ? 'rgba(201,168,76,.05)' : 'transparent',
        marginLeft: -12, marginRight: -12,
        transition: 'background .3s',
        borderRadius: 2,
      }}
    >
      <div style={{ flex: 1 }}>
        <span style={{ color: h ? W : 'rgba(245,240,232,.88)', fontSize: 17, fontFamily: D, letterSpacing: '0.5px', fontWeight: 400, transition: 'color .3s' }}>{name}</span>
        {note && <div style={{ color: MUT, fontSize: 11, letterSpacing: '1px', marginTop: 4, fontFamily: B }}>{note}</div>}
      </div>
      <motion.div
        animate={{ width: h ? 56 : 40 }}
        transition={{ duration: 0.35 }}
        style={{ borderBottom: `1px dotted rgba(201,168,76,.25)`, marginBottom: 5, marginLeft: 12, marginRight: 12, flexShrink: 0, alignSelf: 'flex-end' }}
      />
      <span style={{ color: G, fontSize: 17, fontFamily: D, fontWeight: 500, whiteSpace: 'nowrap', flexShrink: 0, fontStyle: 'italic' }}>{price}</span>
    </motion.div>
  )
}

const PRICE_CATEGORIES = [
  { cat: 'Блузки, рубашки, топы', items: [
    { name: 'Блуза',   price: 'от 12 000 ₽' },
    { name: 'Рубашка', price: 'от 8 500 ₽' },
    { name: 'Топ',     price: 'от 6 000 ₽' },
  ]},
  { cat: 'Юбки', items: [
    { name: 'Юбка без подкладки',              price: 'от 6 000 ₽' },
    { name: 'Юбка с подкладкой',               price: 'от 7 500 ₽' },
    { name: 'Юбка из натуральной кожи',        price: 'от 18 000 ₽' },
    { name: 'Юбка в стиле «Шанель» бесклеевым способом', price: 'от 15 000 ₽' },
  ]},
  { cat: 'Брюки', items: [
    { name: 'Брюки без подкладки',      price: 'от 8 500 ₽' },
    { name: 'Брюки с подкладкой',       price: 'от 10 000 ₽' },
    { name: 'Брюки из натуральной кожи', price: 'от 28 000 ₽' },
    { name: 'Брюки из футера',          price: 'от 5 000 ₽' },
  ]},
  { cat: 'Платья', items: [
    { name: 'Платье без подкладки', price: 'от 11 000 ₽' },
    { name: 'Платье на подкладке',  price: 'от 18 000 ₽' },
  ]},
  { cat: 'Жакеты', items: [
    { name: 'Жакет без подкладки',                        price: 'от 18 000 ₽' },
    { name: 'Жакет на подкладке',                         price: 'от 20 000 ₽' },
    { name: 'Жакет из натуральной кожи',                  price: 'от 38 000 ₽' },
    { name: 'Жакет в стиле «Шанель» бесклеевым способом', price: 'от 25 000 ₽' },
  ]},
  { cat: 'Куртки', items: [
    { name: 'Куртка-ветровка на подкладке', price: 'от 19 000 ₽' },
    { name: 'Куртка из джинсовой ткани',   price: 'от 16 000 ₽' },
    { name: 'Куртка из натуральной кожи',  price: 'от 35 000 ₽' },
    { name: 'Куртка типа «Бомбер»',        price: 'от 12 000 ₽' },
  ]},
  { cat: 'Верхняя одежда', items: [
    { name: 'Тренч',                                              price: 'от 20 000 ₽' },
    { name: 'Тренч укороченный',                                  price: 'от 18 000 ₽' },
    { name: 'Пальто без утеплителя',                              price: 'от 24 000 ₽' },
    { name: 'Пальто с утеплителем',                               price: 'от 30 000 ₽' },
    { name: 'Пальто с утеплителем и воротником из натурального меха', price: 'от 42 000 ₽' },
    { name: 'Пальто из курточной ткани стёганое с утеплителем',   price: 'от 20 000 ₽' },
  ]},
  { cat: 'Меха и кожа', items: [
    { name: 'Шуба из натурального меха', price: 'от 70 000 ₽' },
    { name: 'Жилет из натурального меха', price: 'от 35 000 ₽' },
  ]},
  { cat: 'Трикотаж и повседневное', items: [
    { name: 'Свитшот из футера',         price: 'от 5 000 ₽' },
    { name: 'Шорты без подкладки',       price: 'от 6 500 ₽' },
    { name: 'Шорты с подкладкой',        price: 'от 7 000 ₽' },
    { name: 'Комбинезон без подкладки',  price: 'от 18 000 ₽' },
    { name: 'Комбинезон на подкладке с утеплителем', price: 'от 27 000 ₽' },
    { name: 'Футболка из кулирки',       price: 'от 3 000 ₽' },
    { name: 'Лонгслив',                  price: 'от 3 500 ₽' },
    { name: 'Жилет без подкладки',       price: 'от 7 800 ₽' },
  ]},
  { cat: 'Услуги', items: [
    { name: 'Удорожание при сложности модели',                           price: 'от 20% от стоимости' },
    { name: 'Консультация с выездом за тканью и фурнитурой (1 час)',     price: '1 500 ₽' },
    { name: 'Первичная консультация в ателье',                           price: 'Бесплатно' },
  ]},
]

function PriceAccordion() {
  const [open, setOpen] = useState(null)
  return (
    <div>
      {PRICE_CATEGORIES.map((cat, ci) => {
        const isOpen = open === ci
        return (
          <div key={ci} style={{ borderBottom: `1px solid ${BDR}` }}>
            <button
              onClick={() => setOpen(isOpen ? null : ci)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 12px', background: 'none', border: 'none', cursor: 'pointer',
                transition: 'background .2s', borderRadius: 2,
                ...(isOpen ? { background: 'rgba(201,168,76,.06)' } : {}),
              }}
            >
              <span style={{ color: isOpen ? W : 'rgba(245,240,232,.88)', fontSize: 16, fontFamily: D, letterSpacing: '0.5px', fontWeight: 400, transition: 'color .2s', textAlign: 'left' }}>
                {cat.cat}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                <span style={{ color: MUT, fontSize: 11, fontFamily: B, fontWeight: 300 }}>{cat.items.length} позиций</span>
                <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.25 }} style={{ color: G, lineHeight: 1, fontSize: 20, fontWeight: 300 }}>+</motion.div>
              </div>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 0.84, 0.44, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ paddingBottom: 8 }}>
                    {cat.items.map((item, ii) => (
                      <div key={ii} style={{ display: 'flex', alignItems: 'baseline', padding: '10px 12px', borderTop: `1px solid rgba(201,168,76,.07)` }}>
                        <span style={{ flex: 1, color: 'rgba(245,240,232,.7)', fontSize: 14, fontFamily: B, fontWeight: 300 }}>{item.name}</span>
                        <div style={{ borderBottom: `1px dotted rgba(201,168,76,.2)`, flex: '0 1 40px', marginBottom: 4, marginLeft: 12, marginRight: 12, alignSelf: 'flex-end' }} />
                        <span style={{ color: G, fontSize: 14, fontFamily: D, fontWeight: 500, whiteSpace: 'nowrap', flexShrink: 0, fontStyle: 'italic' }}>{item.price}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
      <p style={{ color: MUT, fontSize: 12, marginTop: 20, letterSpacing: '0.5px', fontFamily: B, fontWeight: 300 }}>
        * Ткани можно принести свои или выбрать из нашего каталога
      </p>
    </div>
  )
}

function PricingSection() {
  return (
    <section style={{ padding: '92px 28px', background: CARD, position: 'relative', overflow: 'hidden' }}>
      <LaceBgPattern opacity={0.035}/>
      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <SectionEye>Стоимость</SectionEye>
            <h2 style={{ fontSize: 'clamp(34px,4.3vw,58px)', fontFamily: D, color: W, fontWeight: 300, letterSpacing: '-0.5px' }}>
              Примерные <span style={{ color: G, fontStyle: 'italic' }}>цены</span>
            </h2>
            <p style={{ color: MUT, fontSize: 15, maxWidth: 480, margin: '18px auto 0', lineHeight: 1.75, fontFamily: B, fontWeight: 300 }}>
              Точная стоимость зависит от сложности изделия и выбранных тканей. Обсудим на консультации.
            </p>
          </div>
        </Reveal>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 64, alignItems: 'flex-start' }}>
          <div style={{ flex: '1 1 380px', minWidth: 280 }}>
            <PriceAccordion />
          </div>

          <Reveal delay={200} style={{ flex: '1 1 280px', minWidth: 240 }}>
            <div style={{ background: BG, border: `1px solid ${G}`, padding: '48px 38px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,.1) 0%, transparent 70%)' }} />
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: G, fontSize: 11, letterSpacing: '5px', textTransform: 'uppercase', fontFamily: B, marginBottom: 22, fontWeight: 500 }}>
                <Heart size={13} strokeWidth={1.8}/>
                Первая консультация
              </div>
              <div style={{ color: W, fontSize: 'clamp(36px,4.2vw,52px)', fontFamily: D, lineHeight: 1.05, marginBottom: 22, fontWeight: 300, fontStyle: 'italic' }}>Бесплатно</div>
              <p style={{ color: MUT, fontSize: 14, lineHeight: 1.8, marginBottom: 36, fontFamily: B, fontWeight: 300 }}>
                Напишите нам или позвоните, чтобы обсудить ваш образ и узнать точную стоимость.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Btn href={TG} block icon={Send} testId="pricing-tg-btn">Телеграм</Btn>
                <Btn href={PHONE_HREF} outline block icon={Phone} testId="pricing-phone-btn">{PHONE}</Btn>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// ============ CTA BANNER ============
const ctaWords1 = ['Создайте', 'свой']
const ctaWords2 = ['неповторимый', 'образ']

function CTABanner() {
  const openLead = useContext(LeadContext)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const wordVariants = {
    hidden: { y: '110%', opacity: 0 },
    show: (i) => ({
      y: '0%', opacity: 1,
      transition: { duration: 0.7, delay: i * 0.12, ease: [0.16, 0.84, 0.44, 1] },
    }),
  }

  return (
    <section className="aurora-bg" style={{
      padding: '120px 28px',
      borderTop: `1px solid ${BDR}`, borderBottom: `1px solid ${BDR}`,
      position: 'relative', overflow: 'hidden',
    }}>
      <LaceBgPattern opacity={0.05}/>

      {/* Aurora blobs */}
      <motion.div
        animate={{ x: [0, 80, -40, 0], y: [0, -60, 40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', top: '-10%', left: '10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,.11) 0%, transparent 65%)', pointerEvents: 'none', willChange: 'transform' }}
      />
      <motion.div
        animate={{ x: [0, -60, 50, 0], y: [0, 50, -30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        style={{ position: 'absolute', bottom: '-15%', right: '5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(30,90,60,.25) 0%, transparent 65%)', pointerEvents: 'none', willChange: 'transform' }}
      />

      <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
        <Reveal>
          <SectionEye>Готовы начать?</SectionEye>
        </Reveal>

        <div ref={ref} style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 'clamp(36px,5.7vw,72px)', fontFamily: D, color: W, lineHeight: 1.08, fontWeight: 300, letterSpacing: '-0.8px' }}>
            <div style={{ overflow: 'hidden', marginBottom: 6, display: 'flex', gap: '0 16px', justifyContent: 'center' }}>
              {ctaWords1.map((w, i) => (
                <motion.span key={i} custom={i} variants={wordVariants} initial="hidden" animate={inView ? 'show' : 'hidden'}
                  style={{ display: 'inline-block', color: W }}>
                  {w}
                </motion.span>
              ))}
            </div>
            <div style={{ overflow: 'hidden', display: 'flex', gap: '0 16px', justifyContent: 'center' }}>
              {ctaWords2.map((w, i) => (
                <motion.span key={i} custom={i + 2} variants={wordVariants} initial="hidden" animate={inView ? 'show' : 'hidden'}
                  style={{ display: 'inline-block', color: i === 0 ? G : W, fontStyle: 'italic' }}>
                  {w}
                </motion.span>
              ))}
            </div>
          </h2>
        </div>

        <Reveal delay={150}>
          <p style={{ color: MUT, fontSize: 17, lineHeight: 1.85, marginBottom: 52, fontFamily: B, fontWeight: 300 }}>
            Первая консультация бесплатно. Напишите нам в Телеграм или позвоните — обсудим ваш образ и ответим на все вопросы.
          </p>
        </Reveal>
        <Reveal delay={300}>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Btn onClick={() => openLead('Заявка на пошив')} large icon={Send} testId="cta-lead-btn">Оставить заявку</Btn>
            <Btn href={MAX} outline large icon={Send} testId="cta-max-btn">MAX</Btn>
            <Btn href={TG} outline large icon={Send} testId="cta-tg-btn">Написать в Телеграм</Btn>
            <Btn href={PHONE_HREF} outline large icon={Phone} testId="cta-phone-btn">{PHONE}</Btn>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ============ CONTACTS ============
function Contacts() {
  const mobile = useIsMobile()
  return (
    <section id="contacts" data-testid="contacts-section" style={{ padding: mobile ? '72px 20px' : '120px 28px', background: BG, position: 'relative' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <SectionEye>Контакты</SectionEye>
            <h2 style={{ fontSize: 'clamp(34px,4.3vw,58px)', fontFamily: D, color: W, fontWeight: 300, letterSpacing: '-0.5px' }}>
              Приходите в <span style={{ color: G, fontStyle: 'italic' }}>ателье</span>
            </h2>
          </div>
        </Reveal>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 60, alignItems: 'flex-start' }}>
          <Reveal style={{ flex: '1 1 300px', minWidth: 260 }}>
            <motion.div
              style={{ display: 'flex', flexDirection: 'column', gap: 0 }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
              <ContactRow Icon={MapPin} label="Адрес">
                <span style={{ color: W, fontFamily: B, fontWeight: 300 }}>пр. Ленина, 67а, 1 этаж</span><br />
                <span style={{ color: MUT, fontSize: 14, fontFamily: B, fontWeight: 300 }}>Кемерово, 650066</span>
              </ContactRow>
              <ContactRow Icon={Phone} label="Телефон">
                <a href={PHONE_HREF} data-testid="contact-phone-link" style={{ color: W, fontFamily: B, fontWeight: 300, textDecoration: 'none', fontSize: 18 }}>{PHONE}</a>
              </ContactRow>
              <ContactRow Icon={Clock} label="Работа">
                <span style={{ color: W, fontFamily: B, fontWeight: 300 }}>Пн–Пт: 10:00–18:00</span><br />
                <span style={{ color: MUT, fontSize: 14, fontFamily: B, fontWeight: 300 }}>Суббота: 10:00–16:00</span>
              </ContactRow>
              <ContactRow Icon={Mail} label="Email">
                <a href="mailto:innkruzel@yandex.ru" data-testid="contact-email-link" style={{ color: W, fontFamily: B, fontWeight: 300, textDecoration: 'none' }}>innkruzel@yandex.ru</a>
              </ContactRow>
            </motion.div>
            <div>
              <div style={{ color: MUT, fontSize: 9, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: 16, fontFamily: B }}>Социальные сети</div>
              <div style={{ display: 'flex', gap: 10 }}>
                <SocBtn href={MAX} label="MAX" testId="soc-max">MAX</SocBtn>
                <SocBtn href={TG} label="Телеграм" testId="soc-tg">TG</SocBtn>
                <SocBtn href={VK} label="ВКонтакте" testId="soc-vk">VK</SocBtn>
              </div>
            </div>
          </Reveal>
          <Reveal delay={150} style={{ flex: '1 1 380px', minWidth: 280 }}>
            <div style={{ height: mobile ? 280 : 440, border: `1px solid ${BDR}`, overflow: 'hidden', position: 'relative' }}>
              <iframe
                src="https://yandex.ru/map-widget/v1/?ll=86.107760%2C55.343539&z=17&pt=86.107760%2C55.343539,pm2gnm"
                width="100%" height="100%" frameBorder="0"
                style={{ border: 'none', display: 'block', filter: 'contrast(1.05) saturate(0.85)' }}
                title="Карта расположения ателье"
              />
              {/* Gold corner accents */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: 28, height: 28, borderTop: `2px solid ${G}`, borderLeft: `2px solid ${G}`, pointerEvents: 'none' }}/>
              <div style={{ position: 'absolute', top: 0, right: 0, width: 28, height: 28, borderTop: `2px solid ${G}`, borderRight: `2px solid ${G}`, pointerEvents: 'none' }}/>
              <div style={{ position: 'absolute', bottom: 0, left: 0, width: 28, height: 28, borderBottom: `2px solid ${G}`, borderLeft: `2px solid ${G}`, pointerEvents: 'none' }}/>
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderBottom: `2px solid ${G}`, borderRight: `2px solid ${G}`, pointerEvents: 'none' }}/>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function ContactRow({ Icon, label, children }) {
  const [h, setH] = useState(false)
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.16, 0.84, 0.44, 1] } } }}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{ marginBottom: 30, display: 'flex', gap: 18, alignItems: 'flex-start' }}
    >
      <motion.div
        animate={{ borderColor: h ? G : 'rgba(201,168,76,.4)', background: h ? 'rgba(201,168,76,.12)' : 'rgba(201,168,76,.06)' }}
        transition={{ duration: 0.35 }}
        style={{ flexShrink: 0, width: 38, height: 38, border: `1px solid`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <motion.div animate={{ rotate: h ? 10 : 0, scale: h ? 1.15 : 1 }} transition={{ duration: 0.35, ease: [0.16, 0.84, 0.44, 1] }}>
          <Icon size={16} strokeWidth={1.4} color={G}/>
        </motion.div>
      </motion.div>
      <div style={{ flex: 1 }}>
        <div style={{ color: G, fontSize: 11, letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: 8, fontFamily: B, fontWeight: 500 }}>{label}</div>
        <div style={{ color: W, fontSize: 16, lineHeight: 1.7, fontFamily: B, fontWeight: 300 }}>{children}</div>
      </div>
    </motion.div>
  )
}

function SocBtn({ href, label, children, testId }) {
  const [h, setH] = useState(false)
  return (
    <a
      href={href} target="_blank" rel="noopener noreferrer" title={label}
      data-testid={testId}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        width: 48, height: 48, background: h ? G : CARD,
        border: `1px solid ${h ? G : BDR}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: h ? BG : G, fontSize: 13, fontWeight: 500, textDecoration: 'none',
        transition: 'all .35s', fontFamily: B, letterSpacing: '1px',
      }}
    >
      {children}
    </a>
  )
}

// ============ FOOTER ============
function Footer() {
  return (
    <footer style={{ background: CARD, borderTop: `1px solid ${BDR}`, padding: '48px 28px' }}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-30px' }}
        variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 28 }}
      >
        <motion.div variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}>
          <div style={{ color: G, fontSize: 20, fontWeight: 400, letterSpacing: '7px', fontFamily: D, textTransform: 'uppercase', fontStyle: 'italic' }}>Кружева</div>
          <div style={{ color: MUT, fontSize: 10, marginTop: 6, letterSpacing: '3px', fontFamily: B }}>СТУДИЯ ИНДИВИДУАЛЬНОГО ПОШИВА</div>
        </motion.div>
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
          style={{ color: MUT, fontSize: 13, textAlign: 'center', lineHeight: 1.8, fontFamily: B, fontWeight: 300 }}
        >
          {ADDR} · {CITY}<br />
          <a href={PHONE_HREF} style={{ color: MUT, textDecoration: 'none' }}>{PHONE}</a>
        </motion.div>
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
          style={{ color: MUT, fontSize: 11, textAlign: 'right', fontFamily: B, fontWeight: 300 }}
        >
          © 2026 Кружева
        </motion.div>
      </motion.div>
    </footer>
  )
}

// ============ APP ============
export default function App() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [lead, setLead] = useState({ open: false, service: '' })
  const openLead = (service = '') => setLead({ open: true, service })
  const closeLead = () => setLead({ open: false, service: '' })

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <LeadContext.Provider value={openLead}>
      <div data-testid="app-root" style={{ background: BG, color: W, fontFamily: B, overflowX: 'hidden', minHeight: '100vh' }}>
        <Navbar scrolled={scrolled} open={open} setOpen={setOpen} />
        {/* — Уровень 1: горячий клиент — */}
        <Hero />
        <Marquee />

        {/* — Уровень 2: тёплый клиент — */}
        <Services />
        <Process />

        {/* — Уровень 3: въедливый — */}
        <Gallery />
        <VideoSection />
        <AdditionalServices />
        <CTABanner />

        {/* — Уровень 4: совсем въедливый — */}
        <Reviews />
        <WhyUs />
        <PricingSection />
        <Contacts />
        <Footer />
        <FloatingBookBtn />
        <LeadModal state={lead} onClose={closeLead} />
      </div>
    </LeadContext.Provider>
  )
}
