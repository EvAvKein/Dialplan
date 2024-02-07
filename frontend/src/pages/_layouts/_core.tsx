import {Outlet} from "react-router-dom";
import {Notifications} from "../../notifications";
import {useNotifStore} from "../../stores/notifs";
import styles from "./_core.module.css";

export default function CoreLayout() {
	const notifs = useNotifStore();

	return (
		<>
			<Outlet />

			<div id={styles.notifsWrapper}>
				<Notifications notifs={notifs.list} dismissHandler={(notifId) => notifs.delete(notifId)} />
			</div>
		</>
	);
}
