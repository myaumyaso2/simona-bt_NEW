import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Политика конфиденциальности и обработки персональных данных | СИМОНА',
  description:
    'Официальная политика в отношении обработки персональных данных и соглашение об использовании файлов cookie интернет-магазина бытовой техники «СИМОНА» (simona-bt.ru).',
  alternates: {
    canonical: 'https://www.simona-bt.ru/policy',
  },
};

export default function PolicyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
