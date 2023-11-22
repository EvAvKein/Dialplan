import {create} from "zustand";

type T = unknown;

const useThingStore = create<T>(() => true);
useThingStore.subscribe(
	(newState) =>
		function sideEffects() {
			newState;
		},
);

export {useThingStore};
