import {create} from "zustand";

export interface notif {
	id: string;
	text: string;
	desirability: boolean;
	manualDismiss?: true;
}

export interface notifStore {
	list: notif[];
	create: (notif: Omit<notif, "id">) => void;
	delete: (notifId: notif["id"]) => void;
}

export const useNotifStore = create<notifStore>((set) => ({
	list: [],

	create: (notif) =>
		set((store) => {
			const id = crypto.randomUUID(); // excessive but concise. replace with custom function if facing performance issues
			const list = store.list.concat({id, ...notif});
			if (!notif.manualDismiss) setTimeout(() => store.delete(id), notif.text.length * 200 + 3000);
			return {list};
		}),

	delete: (id) =>
		set((prevState) => {
			return {list: prevState.list.filter((notif) => notif.id !== id)};
		}),
}));
