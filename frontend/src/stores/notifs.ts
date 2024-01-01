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
			const id = crypto.randomUUID(); // excessive but concise. replace if facing performance issues
			const list = store.list.concat({id, ...notif});
			const duration = notif.text.length * 75 + 3000; // *loosely* based on: https://ux.stackexchange.com/questions/11203/how-long-should-a-temporary-notification-toast-appear/85898#85898
			if (!notif.manualDismiss) setTimeout(() => store.delete(id), duration);
			return {list};
		}),

	delete: (id) =>
		set((prevState) => {
			return {list: prevState.list.filter((notif) => notif.id !== id)};
		}),
}));
