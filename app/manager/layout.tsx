import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Кабинет менеджера | СИМОНА',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
