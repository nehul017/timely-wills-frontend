export interface ProgressStepState {
  medicalStep: number;
  willMainStep: number;
  durableStep: number;
  wishesStep: number;
  subStep: number;
  aboutStep: number;
  livingWillStep: number;
  increaseAboutStep: () => void;
  decreaseAboutStep: () => void;
  setCurrentAboutStep: (step: number) => void;

  increaseWishesStep: () => void;
  decreaseWishesStep: () => void;
  setCurrentWishesStep: (step: number) => void;

  setSubStep: (step: number) => void;
  increaseSubStep: () => void;
  decreaseSubStep: () => void;
  setWillMainStep: (step: number) => void;
  increaseWillMainStep: () => void;
  decreaseWillMainStep: () => void;

  increaseMedicalStep: () => void;
  decreaseMedicalStep: () => void;
  resetMedicalStep: () => void;
  setMedicalStep: (step: number) => void;

  increaseDurableStep: () => void;
  decreaseDurableStep: () => void;
  setDurableStep: (step: number) => void;
  resetDurableStep: () => void;
}
