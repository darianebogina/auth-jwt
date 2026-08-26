type Listener = () => void;

export const createStore = <State>(initialState: State) => {
    let state = initialState;
    const listeners = new Set<Listener>();

    const getState = () => state;

    const setState = (updater: State | ((prev: State) => State)) => {
        state =
            typeof updater === 'function'
                ? (updater as (prev: State) => State)(state)
                : updater;
        listeners.forEach((listener) => listener());
    };

    const subscribe = (listener: Listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
    };

    return { getState, setState, subscribe };
};
