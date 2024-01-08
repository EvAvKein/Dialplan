import {Link, Outlet} from "react-router-dom";
import HeaderDropdown from "./headerDropdown";
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
					<HeaderDropdown buttonText="Account">
						<Link to="/signIn" className={coreStyles.contentButton}>
							Sign In
						</Link>
						<Link to="/signUp" className={coreStyles.contentButton}>
							Sign Up
						</Link>
					</HeaderDropdown>
				</nav>
			</header>

			<main>
				<Outlet />
			</main>
		</>
	);
}
