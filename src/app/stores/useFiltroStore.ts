// stores/useFiltroStore.ts
import { create } from 'zustand';

type FiltroStore = {
  filtro: string;
  setFiltro: (value: string) => void;
};

export const useFiltroStore = create<FiltroStore>((set) => ({
  filtro: '',
  setFiltro: (value) => set({ filtro: value }),
}));
