import {
  StoreProvider,
  useStore,
  useStoreState,
} from "@/contexts/StoreContext";

export const B: React.FC = () => {
  const store = useStore();
  const [globalStoreFooState, setGlobalStoreFooState] = useStoreState(
    "Global",
    "foo"
  );
  const [globalStoreBarState, setGlobalStoreBarState] = useStoreState(
    "Global",
    "bar"
  );
  const [aStoreHiState, setAStoreHiState] = useStoreState("A", "hi");

  console.log("B", {
    store,
    globalStoreFooState,
    globalStoreBarState,
    aStoreHiState,
  });

  console.log("B rerendered");

  return (
    <div
      style={{
        border: "5px solid white",
        display: "flex",
        gap: 8,
        padding: 16,
        margin: 16,
      }}
    >
      Hi I am B
      <button
        onClick={() => {
          setGlobalStoreFooState(Date.now());
        }}
      >{`Update Global Store's Foo`}</button>
      <button
        onClick={() => {
          setGlobalStoreBarState(Date.now());
        }}
      >{`Update Global Store's Bar`}</button>
      <button
        onClick={() => {
          setAStoreHiState(Date.now());
        }}
      >{`Update A Store's Hi`}</button>
    </div>
  );
};
