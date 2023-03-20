import { StoreProvider, useStore } from "@/contexts/StoreContext";

export const B: React.FC = () => {
  const store = useStore();
  console.log("B", store.availableStores);

  return <>Hi</>;
};
