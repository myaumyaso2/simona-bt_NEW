import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/components/providers/StoreContext';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';
import { UmbrellaBar } from '@/components/layout/UmbrellaBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { GlobalModalContainer } from '@/components/modals/GlobalModalContainer';

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'СИМОНА — Премиальная бытовая техника в Нижнем Новгороде | Miele, ASKO, Liebherr, SMEG',
  description: 'Премиальный интернет-бутик и digital-витрина салонов бытовой техники «СИМОНА» на ул. Белинского, 15 и 11/66. Подбор под дизайн-проекты, тест-драйв на Активной кухне, официальная гарантия.',
  keywords: 'бытовая техника Нижний Новгород, Miele, ASKO, Liebherr, SMEG, OMOIKIRI, кухни Белинского, активная кухня, премиум встройка',
  openGraph: {
    title: 'СИМОНА — Премиальная бытовая техника в Нижнем Новгороде',
    description: 'Официальный партнер ведущих мировых брендов. Флагманские салоны на ул. Белинского.',
    url: 'https://simona-bt.ru',
    siteName: 'СИМОНА',
    locale: 'ru_RU',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={montserrat.variable}>
      <body className="bg-[#111315] text-white font-sans min-h-screen flex flex-col antialiased selection:bg-simona-teal/30 selection:text-white">
        <SmoothScrollProvider>
          <StoreProvider>
            <UmbrellaBar />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <GlobalModalContainer />
          </StoreProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
