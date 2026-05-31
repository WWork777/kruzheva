import './globals.css'

export const metadata = {
  metadataBase: new URL('https://kruzheva-atelier.ru'),
  title: 'Кружева — Студия индивидуального пошива',
  description: 'Индивидуальный пошив платьев, жакетов в стиле Шанель, шуб из натурального меха и изделий из кожи. 85% ручной работы. Стаж мастера — 25 лет. Кемерово, пр. Ленина 67а.',
  keywords: 'ателье Кемерово, пошив платьев Кемерово, жакет Шанель, шубы на заказ, индивидуальный пошив, свадебные платья Кемерово, Инна Крузель',
  openGraph: {
    title: 'Кружева — Студия индивидуального пошива',
    description: 'Индивидуальный пошив платьев, жакетов в стиле Шанель, шуб из натурального меха. 85% ручной работы. Стаж 25 лет.',
    url: 'https://kruzheva-atelier.ru',
    siteName: 'Ателье Кружева',
    locale: 'ru_RU',
    type: 'website',
    images: [{ url: '/real/photo_94.jpg', width: 1200, height: 630, alt: 'Ателье Кружева — премиальный пошив в Кемерово' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Кружева — Студия индивидуального пошива',
    description: 'Индивидуальный пошив платьев, жакетов в стиле Шанель, шуб из натурального меха. 85% ручной работы.',
    images: ['/real/photo_94.jpg'],
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
        <meta name="theme-color" content="#0a1510" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Great+Vibes&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: 'Inter, system-ui, sans-serif' }}>
        {children}
        {/* Яндекс.Метрика */}
        <script dangerouslySetInnerHTML={{ __html: `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,'script','https://mc.yandex.ru/metrika/tag.js?id=109539910','ym');ym(109539910,'init',{ssr:true,webvisor:true,clickmap:true,ecommerce:"dataLayer",referrer:document.referrer,url:location.href,accurateTrackBounce:true,trackLinks:true});` }} />
        <noscript><div><img src="https://mc.yandex.ru/watch/109539910" style={{position:'absolute',left:'-9999px'}} alt=""/></div></noscript>
      </body>
    </html>
  )
}
