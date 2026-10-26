import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Сотрудничество с дизайнерами интерьера и архитекторами в Нижнем Новгороде | СИМОНА',
  description:
    'Партнерская программа сети салонов бытовой техники «СИМОНА» для дизайнеров, архитекторов и кухонных студий: техническая проверка ниш, 3D-модели и схемы встройки, персональный менеджер и прозрачные условия.',
  alternates: {
    canonical: 'https://www.simona-bt.ru/designers',
  },
  openGraph: {
    title: 'Дизайнерам и архитекторам — партнерский клуб «СИМОНА»',
    description:
      'Комплектация интерьерных проектов бытовой техникой в Нижнем Новгороде с инженерным сопровождением.',
    url: 'https://www.simona-bt.ru/designers',
  },
};

export default function DesignersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
