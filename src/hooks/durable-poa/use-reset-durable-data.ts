import {
  useDurablePOAAgentPowersStore,
  useDurablePOAdesignatedAgentStore,
} from '@/store/durable-poa';
import { useProgressStepStore } from '@/store/progress-steps';

const useResetDurableData = () => {
  const { resetPowersState } = useDurablePOAAgentPowersStore();
  const { resetDurableAgentState } = useDurablePOAdesignatedAgentStore();
  const { resetDurableStep } = useProgressStepStore();

  const resetAllDurableSectionData = () => {
    resetPowersState();
    resetDurableAgentState();
    resetDurableStep();
  };

  return { resetAllDurableSectionData };
};

export default useResetDurableData;
