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

	async function logout() {
		const response = await apiFetch("DELETE", "/sessions");
		if (response.error) {
			notifs.create({text: "Error while logging out", desirability: false, manualDismiss: true});
			return;
		}
		navigate("/signIn");
	}

	return (
		<>
			<nav id={styles.nav}>
				<div id={styles.leftPart}>
					<Link to="/" className={coreStyles.contentButton}>
						<DialplanLogo />
					</Link>
					/ {org?.name || "[Loading]"}
				</div>

				<button onClick={logout} className={coreStyles.contentButton}>
					Log Out
				</button>
			</nav>

			<main>
				<Outlet />
			</main>
		</>
	);
}
