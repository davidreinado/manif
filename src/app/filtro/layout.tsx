// app/filtro/[uid]/layout.tsx
import FiltroClientWrapper from '@/app/components/FiltroClientWrapper';

export default function FiltroLayout({ children }: { children: React.ReactNode }) {
  return <FiltroClientWrapper>{children}</FiltroClientWrapper>;
}
