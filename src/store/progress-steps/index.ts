import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { ProgressStepState } from './type';

export const useProgressStepStore = create(
  persist<ProgressStepState>(
    (set) => ({
      medicalStep: 0,
      durableStep: 0,
      willMainStep: 0,
      wishesStep: 0,
      subStep: 0,
      aboutStep: 0,
      livingWillStep: 0,
      setSubStep: (step: number) => set({ subStep: step }),
      increaseSubStep: () => set((state) => ({ subStep: state.subStep + 1 })),
      decreaseSubStep: () => set((state) => ({ subStep: state.subStep - 1 })),

      increaseAboutStep: () =>
        set((state) => ({ aboutStep: state.aboutStep + 1 })),
      decreaseAboutStep: () =>
        set((state) => ({ aboutStep: state.aboutStep - 1 })),
      setCurrentAboutStep: (step: number) => set({ aboutStep: step }),

      increaseWishesStep: () =>
        set((state) => ({ wishesStep: state.wishesStep + 1 })),
      decreaseWishesStep: () =>
        set((state) => ({ wishesStep: state.wishesStep - 1 })),
      setCurrentWishesStep: (step: number) => set({ wishesStep: step }),

      setMedicalStep: (step: number) => set({ medicalStep: step }),
      increaseMedicalStep: () =>
        set((state) => ({ medicalStep: state.medicalStep + 1 })),
      decreaseMedicalStep: () =>
        set((state) => ({ medicalStep: state.medicalStep - 1 })),
      resetMedicalStep: () => set({ medicalStep: 0 }),

      increaseWillMainStep: () =>
        set((state) => ({ willMainStep: state.willMainStep + 1 })),
      decreaseWillMainStep: () =>
        set((state) => ({ willMainStep: state.willMainStep - 1 })),
      setWillMainStep: (step: number) => set({ willMainStep: step }),

      increaseDurableStep: () =>
        set((state) => ({ durableStep: state.durableStep + 1 })),
      decreaseDurableStep: () =>
        set((state) => ({ durableStep: state.durableStep - 1 })),
      setDurableStep: (step: number) => set({ durableStep: step }),
      resetDurableStep: () => set({ durableStep: 0 }),
    }),
    {
      name: 'progress-step-storage',
      getStorage: () => localStorage,
    },
  ),
);
