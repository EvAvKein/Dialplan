import {useState, useEffect} from "react";
import {Link, Outlet, useNavigate} from "react-router-dom";
import {Org} from "../../../../shared/objects/org";
import {apiFetch} from "../../helpers/apiFetch";
import {useNotifStore} from "../../stores/notifs";
import DialplanLogo from "../../components/icons/dialplanLogo";
import coreStyles from "../../core.module.css";
import styles from "./agent.module.css";

export default function AgentLayout() {
	const navigate = useNavigate();
	const notifs = useNotifStore();

	const [org, setOrg] = useState<Org | null>(null);

	useEffect(() => {
		apiFetch<Org>("GET", "/orgs")
			.then((fetched) => (fetched.error ? navigate("/signIn") : setOrg(fetched.data!)))
			.catch(() => {
				notifs.create({text: "Error while fetching org data", desirability: false, manualDismiss: true});
			});
	}, []);

	return (
		<>
			<nav id={styles.nav}>
				<div id={styles.leftPart}>
					<Link to="/" className={coreStyles.contentButton}>
						<DialplanLogo />
					</Link>
					/ {org?.name || "[Loading]"}
				</div>

				<Link to="/signUp" className={coreStyles.contentButton}>
					Sign Up
				</Link>
			</nav>

			<main>
				<Outlet />
			</main>
		</>
	);
}
