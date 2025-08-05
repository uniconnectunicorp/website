import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Footer } from '@/components/layout/Footer';
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
  title: {
    default: "Uniconnect - Cursos Técnicos EAD",
    template: "%s | Uniconnect"
  },
  description: "Cursos técnicos de alta qualidade na modalidade EAD. Transforme sua carreira com a Uniconnect.",
  keywords: ["cursos técnicos", "EAD", "educação a distância", "cursos profissionalizantes", "Uniconnect"],
  authors: [{ name: "Uniconnect" }],
  creator: "Uniconnect",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://uniconnect.com.br",
    siteName: "Uniconnect",
    title: "Uniconnect - Cursos Técnicos EAD",
    description: "Cursos técnicos de alta qualidade na modalidade EAD. Transforme sua carreira com a Uniconnect.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Uniconnect - Cursos Técnicos EAD",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Uniconnect - Cursos Técnicos EAD",
    description: "Cursos técnicos de alta qualidade na modalidade EAD. Transforme sua carreira com a Uniconnect.",
    images: ["/images/og-image.jpg"],
    creator: "@uniconnect",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#3b82f6' },
    ],
  },
  manifest: "/site.webmanifest",
  metadataBase: new URL('https://uniconnect.com.br'),
};

// Configuração da viewport
export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: 'light dark',
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
        {/* Preload de recursos críticos */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap" 
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen w-full bg-white antialiased  overflow-x-hidden">
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
      </body>
    </html>
  );
}
