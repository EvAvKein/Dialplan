import {Link, Outlet} from "react-router-dom";
import {Notifications} from "../../notifications";
import {useNotifStore} from "../../stores/notifs";
import coreStyles from "../../core.module.css";
import styles from "./visitor.module.css";

export default function layout() {
	const notifs = useNotifStore();

	return (
		<>
			<header id={styles.header}>
				<h1 id={styles.headerTitle}>
					<Link to="/" className={coreStyles.contentButton}>
						Dialplan
					</Link>
				</h1>
				<nav className={styles.nav}>
					<Link to="/signUp" className={coreStyles.contentButton}>
						Sign Up
					</Link>
				</nav>
			</header>

			<main>
				<Outlet />
			</main>

			<div className={styles.notifsWrapper}>
				<Notifications notifs={notifs.list} dismissHandler={(notifId) => notifs.delete(notifId)} />
			</div>
		</>
	);
}
