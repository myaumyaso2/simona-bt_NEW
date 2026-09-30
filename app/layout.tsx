import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/components/providers/StoreContext';
import { ContentProvider } from '@/components/providers/ContentContext';
import { getSiteContent } from '@/lib/content';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';
import { HeaderContainer } from '@/components/layout/HeaderContainer';
import { Footer } from '@/components/layout/Footer';
import { GlobalModalContainer } from '@/components/modals/GlobalModalContainer';
import { YandexMetrika } from '@/components/analytics/YandexMetrika';
import { SchemaOrgStore } from '@/components/seo/SchemaOrgStore';

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'СИМОНА — Салоны и интернет-магазин бытовой техники в Нижнем Новгороде | Более 30 лет опыта',
  description: 'Сеть салонов и интернет-магазин бытовой техники «СИМОНА» на ул. Белинского, 15 и 11/66 в Нижнем Новгороде. Надежные решения под любой бюджет, тест-драйв на Активной кухне, официальная гарантия.',
  keywords: 'бытовая техника Нижний Новгород, встраиваемая техника, Miele, ASKO, Liebherr, SMEG, OMOIKIRI, Körting, Midea, кухни Белинского, активная кухня',
  openGraph: {
    title: 'СИМОНА — Салоны и интернет-магазин бытовой техники в Нижнем Новгороде',
    description: 'Официальный партнер ведущих мировых брендов. Салоны на ул. Белинского 15 и 11/66, склад на ул. Коминтерна 27.',
    url: 'https://simona-bt.ru',
    siteName: 'СИМОНА',
    locale: 'ru_RU',
    type: 'website',
  },
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = getSiteContent();

  return (
    <html lang="ru" className={montserrat.variable}>
      <body className="bg-[#111315] text-white font-sans min-h-screen flex flex-col antialiased selection:bg-simona-teal/30 selection:text-white">
        <YandexMetrika />
        <SchemaOrgStore />
        <SmoothScrollProvider>
          <ContentProvider initialContent={content}>
            <StoreProvider>
              <HeaderContainer />
              <main className="flex-1">{children}</main>
              <Footer />
              <GlobalModalContainer />
            </StoreProvider>
          </ContentProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
