import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Footer } from '@/components/layout/Footer';
import WhatsappFloat from '@/components/layout/Whatsapp';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  preload: true,
});

export const metadata = {
  title: 'Uniconnect | Cursos Técnicos EAD',
  description: 'Cursos técnicos de alta qualidade na modalidade EAD. Transforme sua carreira com a Uniconnect.',
  keywords: 'cursos técnicos, EAD, educação a distância, cursos profissionalizantes, Uniconnect',
  authors: [{ name: 'Uniconnect' }],
  openGraph: {
    type: 'website',
    title: 'Uniconnect | Cursos Técnicos EAD',
    description: 'Cursos técnicos de alta qualidade na modalidade EAD. Transforme sua carreira com a Uniconnect.',
    url: 'https://www.uniconnectead.com.br',
    siteName: 'Uniconnect',
    images: [{ url: '/og-image.jpeg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Uniconnect | Cursos Técnicos EAD',
    description: 'Cursos técnicos de alta qualidade na modalidade EAD. Transforme sua carreira com a Uniconnect.',
    images: ['/og-image.jpeg'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/site.webmanifest',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={` ${poppins.className} scroll-smooth`}
      style={{ scrollBehavior: 'smooth' }}
    >
      <head>
        <meta name="facebook-domain-verification" content="3ik9cwmm7vshne9568jnex2rr968zv" />
      </head>
      <body className="min-h-screen w-full bg-white antialiased  overflow-x-hidden">
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NM6JQVDX"
          height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}></iframe></noscript>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col w-full">
            {/* <Header /> */}
            <main className="flex-1 w-full">
              <div className="w-full">
                {children}
              </div>
            </main>
            <Footer />
            <WhatsappFloat />
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </div>
        </ThemeProvider>
        {/* GTM no final do body para não bloquear renderização */}
        <script dangerouslySetInnerHTML={{
          __html: `setTimeout(function(){(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NM6JQVDX')},0)`
        }} />
      </body>
    </html>
  );
}
