import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Javier Diaz | Software Developer',
  description: 'Desarrollador de Software, Backend .NET y Frontend Next.js. Creando soluciones eficientes y bien estructuradas.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html 
      lang="es" 
      className="bg-background" 
      suppressHydrationWarning
      data-scroll-behavior="smooth" 
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // 1. Configuración de colores dinámicos del LocalStorage
                  const colorMap = {
                    cyan: '0 240 255',
                    violet: '139 92 246',
                    emerald: '16 185 129',
                    amber: '245 158 11',
                    rose: '244 63 94'
                  };
                  const savedColor = localStorage.getItem('portfolio_accent_color') || 'cyan';
                  const rgbValue = colorMap[savedColor] || colorMap.cyan;
                  document.documentElement.style.setProperty('--accent-color', rgbValue);

                  // 2. 🚀 Limpieza fulminante del círculo flotante N en desarrollo
                  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                    const cleanNextIndicators = () => {
                      const selectors = 'next-route-announcer, [next-page-development-indicator], #__next-build-watcher, .nextjs-static-indicator';
                      document.querySelectorAll(selectors).forEach(el => el.remove());
                      
                      // Remueve cualquier portal rebelde inyectado al final del body
                      Array.from(document.body?.children || []).forEach(child => {
                        if (child.tagName.toLowerCase().includes('next') || child.shadowRoot?.innerHTML.includes('Turbopack')) {
                          child.remove();
                        }
                      });
                    };

                    // Ejecutar al cargar y mantener un intervalo para ganarle al re-render de Turbopack
                    document.addEventListener('DOMContentLoaded', cleanNextIndicators);
                    setInterval(cleanNextIndicators, 500);
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}