# PRD — Kruzheva Atelier Site

## Original Problem Statement
> Улучши сайт по дизайну и картинкам — https://github.com/virlabpro/kruzheva-next.js
> (Загружен пользователем как ZIP: kruzheva-next.js-main.zip)
>
> User choice: "Сделать всё перечисленное под ключ"

## Project
- **Type:** Premium static marketing single-page site (Next.js 14 App Router)
- **Domain:** Premium atelier "Кружева" — Kemerovo, Russia. Wedding, evening, cocktail dresses, business suits, alterations.
- **Stack:** Next.js 14 · React 18 · Tailwind 3 · Lucide icons · Cormorant Garamond + Inter fonts · MongoDB (unused for the static page)
- **Palette:** Dark emerald (#0a1510 / #111e17) + gold (#c9a84c) + cream white (#f5f0e8) + muted green (#8ab09a)

## User Personas
- **Bride / event attendee** seeking premium hand-tailored dresses
- **Working woman** needing business suits, casual everyday wear
- **Returning client** wanting alterations, repairs, custom upcycling

## Core Requirements (static)
1. Single-page promotional site with sections: Hero · Trust banner · Service Quiz · Services · Process · Additional Services · Why Us · Gallery · Reviews · Pricing · CTA · Contacts · Footer
2. Russian-language content
3. Premium dark-emerald + gold visual identity
4. Direct CTAs to Telegram (`https://t.me/+79235672333`) and phone (`+7 923 567-23-33`)
5. Yandex Maps embed for address (пр. Ленина, 67а)

## What's Been Implemented (2026-01-30)
### Design overhaul
- **AI-generated hero/process/atelier/fabric images** via Gemini Nano Banana (`gemini-3.1-flash-image-preview`) — saved to `/app/frontend/public/ai/*.png`. Generation script: `/app/scripts/generate_images.py` (re-runnable, skips existing files).
- **Lucide icon set** replaces all emoji (Crown, Sparkles, Wine, Briefcase, Shirt, Scissors, Gem, Award, Heart, Phone, Send, MapPin, Clock, Mail, Star, ChevronLeft/Right, CheckCircle2, Zap).
- **Decorative lace SVG ornaments** (LaceOrnament + LaceBgPattern) on every section eyebrow and as subtle background pattern.
- **Ken Burns slow zoom** animation on hero background image (24s ease-in-out alternate).
- **Reveal-on-scroll** animations via IntersectionObserver (62 elements, 900ms fade + slide-up cubic-bezier).
- **Hover micro-interactions** on every card: image scale-1.08, gold border glow, line-width growth, translateY lift, soft shadow.
- **Gold corner accents** on atelier photo and Yandex map embed.
- **Trust banner** preserved with statistics + "Успейте записаться" urgency message.
- **Reconciled pricing**: Service Quiz now shows identical prices to Pricing section (wedding 15k, evening 8k, cocktail 6k, business 7k, casual 3.5k, alterations 2k ₽).
- **Mobile burger menu** fixed (was broken in original CSS — desktop nav now properly hides at ≤768px).
- **Custom scrollbar** + gold text selection.

### Pages tested
- All `data-testid` attributes documented and tested.
- Reviews carousel (prev/next/dots) ✓
- Quiz selection → CTA reveal ✓
- Mobile responsive ✓
- 100% test pass rate (14/14 checks in iteration_1.json)

## Prioritized Backlog
### P1 — Easy wins
- Split `page.js` (1311 lines) into per-section components under `app/components/` for maintainability.
- Add `next/image` with priority loading for hero (currently uses background-image — works but bypasses Next image optimizer).

### P2 — Nice-to-have
- Real photos of actual atelier (when client provides) to replace Unsplash stocks in Services cards.
- Multi-language toggle (RU/EN) if attracting tourists.
- Pull live 2GIS reviews via API instead of hardcoded list.
- Blog/news section for SEO.
- Booking form integrated with Telegram bot or backend.

## Next Tasks (Suggested)
1. Connect a real booking flow (Telegram bot + backend `/api/booking`) to capture leads instead of relying solely on chat links.
2. Replace stock Unsplash service-card images with photos of real client garments.
3. Add structured data (JSON-LD `LocalBusiness`) for SEO on the Russian market.

## Notes for Future Agents
- AI images live in `/app/frontend/public/ai/` — regenerate with `python3 /app/scripts/generate_images.py` (script is idempotent).
- `EMERGENT_LLM_KEY` is required in `/app/backend/.env` for image regeneration only — runtime page does NOT call any LLM.
- `frontend/.env` has both `REACT_APP_BACKEND_URL` (legacy) and `NEXT_PUBLIC_BACKEND_URL` (preferred for Next.js); the static page doesn't currently fetch from any backend.
- Supervisor command for frontend is `yarn start` mapped to `next dev` for hot reload (see `package.json:start`).
