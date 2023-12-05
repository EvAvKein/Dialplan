import coreStyles from "../../core.module.css";
import styles from "./invites.module.css";

export default function Invites_Dashboard() {
	return (
		<>
			<button
				onClick={() => console.log("invite creation clicked, but not working just yet!")}
				className={coreStyles.backgroundButton}
				id={styles.createInviteButton}
			>
				Create Invite
			</button>
		</>
	);
}
