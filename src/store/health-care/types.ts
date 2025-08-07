export interface HealthCareState {
  id: number | null;
  url: string | null;
  setHealthCare: (data: { id: number | null; url: string | null }) => void;
  resetHealthCare: () => void;
}
