// app/filtro/[uid]/layout.tsx
import FiltroClientWrapper from '@/app/components/FiltroClientWrapper';
import 'overlayscrollbars/overlayscrollbars.css';

export default function FiltroLayout({ children }: { children: React.ReactNode }) {
  return <FiltroClientWrapper>{children}</FiltroClientWrapper>;
}
