import { create } from 'zustand';
import { Indicator } from '../lib/definitions';


interface Selected {
  clicked?: number;
  first?: Indicator;
  second?: Indicator;
}

interface IndicatorStore {
  selected: Selected;
  setSelected: (partial: Partial<Selected>) => void;
  resetSelected: () => void;
}

export const useIndicatorStore = create<IndicatorStore>((set) => ({
  selected: {},
  setSelected: (partial) =>
    set((state) => ({
      selected: {
        ...state.selected,
        ...partial,
      },
    })),
  resetSelected: () => set({ selected: {} }),
}));