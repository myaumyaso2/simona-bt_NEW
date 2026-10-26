import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Сравнение бытовой техники | СИМОНА',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return children;
}
