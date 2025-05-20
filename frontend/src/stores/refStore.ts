import { create } from "zustand";

type RefMap = {
  [key: string]: React.RefObject<HTMLElement> | null;
};

type StoreState = {
  refs: RefMap;
  setRef: (key: string, ref: React.RefObject<HTMLElement>) => void;
};

export const useRefStore = create<StoreState>((set) => ({
  refs: {},
  setRef: (key, ref) =>
    set((state) => ({
      refs: { ...state.refs, [key]: ref },
    })),
}));
