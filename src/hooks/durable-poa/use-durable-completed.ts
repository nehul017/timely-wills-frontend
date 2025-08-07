import {
  useDurablePOAAgentPowersStore,
  useDurablePOAdesignatedAgentStore,
} from '@/store/durable-poa';

const useDurableCompleted = () => {
  const { isCompletedAgentPowersSection, isCompletedSigningSection } =
    useDurablePOAAgentPowersStore();
  const { isCompletedAgentSection } = useDurablePOAdesignatedAgentStore();

  return {
    isCompletedAgentPowersSection,
    isCompletedAgentSection,
    isCompletedSigningSection,
  };
};

export default useDurableCompleted;
