// app/filtro/[uid]/layout.tsx
import FiltroClientWrapper from "@/app/components/FiltroClienteWrapper";
import { useAgenda } from '@/app/components/AgendaProvider';

export default function FiltroLayout({ children }: { children: React.ReactNode }) {
  return (
    <FiltroClientWrapper>
      {children}
    </FiltroClientWrapper>
  );
}
