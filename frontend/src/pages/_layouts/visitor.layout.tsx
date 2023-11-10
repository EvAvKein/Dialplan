import {Outlet} from "react-router-dom";
import styles from "./visitor.module.css";

export default function layout() {
	return (
		<>
			<header className={styles.header}>
				<h1 className={styles.headerTitle}>Dialplan</h1>
			</header>
			<main>
				<Outlet />
			</main>
		</>
	);
}
