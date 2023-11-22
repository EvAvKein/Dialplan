import {Link, Outlet} from "react-router-dom";
import {Notifications} from "../../notifications";
import styles from "./visitor.module.css";
import {useNotifStore} from "../../stores/notifs";

export default function layout() {
	const notifs = useNotifStore();

	return (
		<>
			<header id={styles.header}>
				<h1 id={styles.headerTitle}>
					<Link to="/" className={styles.headerLink}>
						Dialplan
					</Link>
				</h1>
				<nav className={styles.nav}>
					<Link to="/signUp" className={styles.headerLink}>
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
