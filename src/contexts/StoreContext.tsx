import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

export type MyJSON =
  | string
  | number
  | boolean
  | null
  | MyJSON[]
  | { [key: string]: MyJSON };

export class Store {
  public readonly availableStores: Record<string, Store>;
  private states: Record<string, MyJSON>;
  private listeners: Record<string, Set<(value: MyJSON) => void>>;

  constructor(
    private id: string,
    initialState?: Record<string, MyJSON>,
    _upperLayerStores?: Record<string, Store>
  ) {
    if (id === "__VACANT__") {
      this.availableStores = {};
      this.states = {};
      this.listeners = {};
      return;
    }
    if (_upperLayerStores?.hasOwnProperty(id)) {
      throw new Error(`Store ${id} is already defined`);
    }
    this.availableStores = { ..._upperLayerStores, [id]: this };
    this.states = { ...initialState };
    this.listeners = Object.keys(initialState ?? {}).reduce((acc, key) => {
      acc[key] = new Set();
      return acc;
    }, {} as Record<string, Set<(value: MyJSON) => void>>);
  }

  public getState(key: string) {
    const state = this.states[key];

    if (state === undefined) {
      throw new Error(`State ${key} is not defined`);
    }

    return state;
  }

  public setState(key: string, value: MyJSON | ((prev: MyJSON) => MyJSON)) {
    const newValue =
      typeof value === "function" ? value(this.states[key]) : value;
    this.states[key] = newValue;

    if (this.listeners[key] === undefined) {
      this.listeners[key] = new Set();
      return;
    }

    this.listeners[key].forEach((listener) => listener(newValue));
  }

  public addStateChangeListener(
    key: string,
    listener: (value: MyJSON) => void
  ) {
    const state = this.states[key];

    if (state === undefined) {
      throw new Error(`State ${key} is not defined`);
    }

    this.listeners[key].add(listener);
  }

  public removeStateChangeListener(
    key: string,
    listener: (value: MyJSON) => void
  ) {
    this.listeners[key].delete(listener);
  }
}

const storeContext = createContext<Store>(new Store("__VACANT__"));

export const StoreProvider: React.FC<{
  id: string;
  initialState?: Record<string, MyJSON>;
  children: React.ReactNode;
}> = ({ id, initialState, children }) => {
  const upperLayerStores = useStore().availableStores;
  const store = useMemo(
    () => new Store(id, initialState, upperLayerStores),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  return (
    <storeContext.Provider value={store}>{children}</storeContext.Provider>
  );
};

export function useStore() {
  return useContext(storeContext);
}

export function useStoreState(storeID: string, key: string) {
  const { availableStores } = useStore();
  const store = availableStores[storeID];

  const setter = useCallback((value: MyJSON) => store.setState(key, value), []);
  const [state, setState] = useState<MyJSON>(store.getState(key));

  useLayoutEffect(() => {
    const store = availableStores[storeID];
    if (store === undefined) {
      throw new Error(`Store ${storeID} is not defined`);
    }
    store.addStateChangeListener(key, setState);
    return () => {
      store.removeStateChangeListener(key, setState);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [state, setter] as const;
}
