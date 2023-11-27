import {Link, Outlet} from "react-router-dom";
import coreStyles from "../../core.module.css";
import styles from "./visitor.module.css";

export default function VisitorLayout() {
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
		</>
	);
}
