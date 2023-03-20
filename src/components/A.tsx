import { StoreProvider, useStore } from "@/contexts/StoreContext";
import { B } from "./B";

export const A: React.FC = () => {
  const store = useStore();
  console.log("A", store.availableStores);

  return (
    <StoreProvider id="A">
      <B />
    </StoreProvider>
  );
};
