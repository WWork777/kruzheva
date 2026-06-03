import { NextResponse } from 'next/server'

// Этот код выполняется только на сервере — токен и chat_id в браузер не попадают.
// Telegram заблокирован в РФ, поэтому обращаемся к Bot API через Cloudflare-прокси.
const TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CHAT_ID = process.env.TELEGRAM_CHAT_ID
const PROXY = process.env.TELEGRAM_PROXY || 'https://tg-proxy.parsikovevgenij470.workers.dev'

function esc(s = '') {
  return String(s).replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]))
}

export async function POST(req) {
  try {
    if (!TOKEN || !CHAT_ID) {
      return NextResponse.json({ ok: false, error: 'not_configured' }, { status: 500 })
    }

    const { name, phone, service } = await req.json()

    if (!name || !phone) {
      return NextResponse.json({ ok: false, error: 'missing_fields' }, { status: 400 })
    }

    const lines = [
      '🧵 <b>Новая заявка с сайта «Кружева»</b>',
      '',
      `👤 <b>Имя:</b> ${esc(name)}`,
      `📞 <b>Телефон:</b> ${esc(phone)}`,
    ]
    if (service) lines.push(`✂️ <b>Услуга:</b> ${esc(service)}`)

    const tgRes = await fetch(`${PROXY}/bot${TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: lines.join('\n'),
        parse_mode: 'HTML',
      }),
      // не кэшировать
      cache: 'no-store',
    })

    const data = await tgRes.json().catch(() => ({}))

    if (!tgRes.ok || !data.ok) {
      return NextResponse.json({ ok: false, error: 'telegram_error' }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 })
  }
}
