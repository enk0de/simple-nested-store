import {
  StoreProvider,
  useStore,
  useStoreState,
} from "@/contexts/StoreContext";
import { B } from "./B";

export const A: React.FC = () => {
  const store = useStore();
  const [globalStoreFooState, setGlobalStoreFooState] = useStoreState(
    "Global",
    "foo"
  );

  console.log("A", { store, globalStoreFooState });

  console.log("A rerendered");

  return (
    <StoreProvider id="A" initialState={{ hi: "merong", you: "2" }}>
      <div
        style={{
          border: "5px solid white",
          display: "flex",
          gap: 8,
          padding: 16,
          margin: 16,
        }}
      >
        Hi I am A
        <button
          onClick={() => {
            setGlobalStoreFooState(Date.now());
          }}
        >{`Update Global Store's Foo`}</button>
        <B />
      </div>
    </StoreProvider>
  );
};
