import {Outlet} from "react-router-dom";
import {Notifications} from "../../notifications";
import {useNotifStore} from "../../stores/notifs";
import styles from "./visitor.module.css";

export default function CoreLayout() {
	const notifs = useNotifStore();

	return (
		<>
			<Outlet />

			<div className={styles.notifsWrapper}>
				<Notifications notifs={notifs.list} dismissHandler={(notifId) => notifs.delete(notifId)} />
			</div>
		</>
	);
}
