import {Link, Outlet} from "react-router-dom";
import HeaderDropdown from "./headerDropdown";
import coreStyles from "../../core.module.css";
import styles from "./visitor.module.css";

export default function VisitorLayout() {
	return (
		<div id={styles.pageWrapper}>
			<nav id={styles.nav}>
				<h1 id={styles.title}>
					<Link to="/" className={coreStyles.contentButton}>
						Dialplan
					</Link>
				</h1>

				<ul>
					<li>
						<HeaderDropdown buttonText="Account">
							<Link to="/signIn" className={coreStyles.contentButton}>
								Sign In
							</Link>
							<Link to="/signUp" className={coreStyles.contentButton}>
								Sign Up
							</Link>
						</HeaderDropdown>
					</li>
				</ul>
			</nav>

			<main id={styles.main}>
				<Outlet />
			</main>
		</div>
	);
}
