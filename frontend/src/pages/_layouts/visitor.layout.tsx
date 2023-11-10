import {Link, Outlet} from "react-router-dom";
import styles from "./visitor.module.css";

export default function layout() {
	return (
		<>
			<header id={styles.header}>
				<h1 id={styles.headerTitle}>
					<Link to="/">Dialplan</Link>
				</h1>
				<nav className={styles.nav}>
					<Link to="/signUp">Sign Up</Link>
				</nav>
			</header>

			<main>
				<Outlet />
			</main>
		</>
	);
}
