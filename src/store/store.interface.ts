export interface StoreState {
  isLoading: boolean;
  error: string | null;
}

export interface StoreActions {
  clearError: () => void;
}
