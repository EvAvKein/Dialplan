import {Link, Outlet, useLocation} from "react-router-dom";
import {useState} from "react";
import coreStyles from "../../core.module.css";
import styles from "./dashboard.module.css";

export default function DashboardLayout() {
	const location = useLocation();

	const [navExpanded, setNavExpanded] = useState(false);

	return (
		<div id={styles.dashboardLayoutWrapper}>
			<section id={styles.dashboardNavWrapper} className={navExpanded ? " " + styles.navExpanded : ""}>
				<nav>
					<ul id={styles.dashboardNavList}>
						{[
							["/invites", "Invites"],
							["/calls", "Calls"],
						].map((navItem) => (
							<li key={navItem[0]} onClick={() => setNavExpanded(false)}>
								<Link
									to={"/dashboard" + navItem[0]}
									className={
										coreStyles.contentButton + (location.pathname.includes(navItem[0]) ? " " + styles.currentRoute : "")
									}
								>
									{navItem[1]}
								</Link>
							</li>
						))}
					</ul>
				</nav>
				<button
					id={styles.dashboardNavButton}
					className={coreStyles.contentButton}
					onClick={() => setNavExpanded(!navExpanded)}
				>
					<div>V</div>
				</button>
			</section>
			<section id={styles.dashboardPageSection}>
				<Outlet />
			</section>
		</div>
	);
}
