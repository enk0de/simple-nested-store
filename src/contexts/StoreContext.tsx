import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

export class Store {
  public readonly availableStores: Record<string, Store>;
  private states: Record<string, JSON | Record<string, JSON>>;
  private listeners: Record<
    string,
    (value: JSON | Record<string, JSON>) => void
  > = {};

  constructor(
    private id: string,
    initialState?: Record<string, JSON | Record<string, JSON>>,
    _upperLayerStores?: Record<string, Store>
  ) {
    if (id === "__VACANT__") {
      this.availableStores = {};
      this.states = {};
      return;
    }
    if (_upperLayerStores?.hasOwnProperty(id)) {
      throw new Error(`Store ${id} is already defined`);
    }
    this.availableStores = { ..._upperLayerStores, [id]: this };
    this.states = { ...initialState };
  }

  public getState(key: string) {
    const state = this.states[key];

    if (state === undefined) {
      throw new Error(`State ${key} is not defined`);
    }

    return state;
  }

  public setState(key: string, value: JSON | Record<string, JSON>) {
    this.states[key] = value;
  }

  public addStateChangeListener(
    key: string,
    listener: (value: JSON | Record<string, JSON>) => void
  ) {
    const state = this.states[key];

    if (state === undefined) {
      throw new Error(`State ${key} is not defined`);
    }

    const listenerKey = `${this.id}__${key}__LISTENER__${listener.toString()}`;
    this.listeners = { ...this.listeners, [listenerKey]: listener };
  }

  public removeStateChangeListener(
    key: string,
    listener: (value: JSON | Record<string, JSON>) => void
  ) {
    const listenerKey = `${this.id}__${key}__LISTENER__${listener.toString()}`;
    const { [listenerKey]: _, ...listeners } = this.listeners;
    this.listeners = listeners;
  }
}

const storeContext = createContext<Store>(new Store("__VACANT__"));

export const StoreProvider: React.FC<{
  id: string;
  initialState?: Record<string, JSON | Record<string, JSON>>;
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
  const [state, setState] = useState<JSON | Record<string, JSON>>();
  const { availableStores } = useStore();

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

  return [state, setState] as const;
}
