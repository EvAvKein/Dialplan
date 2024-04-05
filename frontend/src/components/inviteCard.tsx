import {InvitePayload} from "../../../shared/objects/inv";
import {secsToReadableDuration} from "../helpers/secsToReadableDuration";
import {useState} from "react";
import styles from "./inviteCard.module.css";

export function InviteCard({invite}: {invite: InvitePayload}) {
	document.documentElement.style.setProperty("--orgColor", invite.org.color ? "#" + invite.org.color : "#000000");

	const [selectedCallTime, setSelectedCallTime] = useState("");
	const [messageToOrg, setMessageToOrg] = useState("");

	async function submitInviteAccept() {
		messageToOrg;
		window.alert("Call creation endpoint not yet implemented");
	}

	return (
		<section className={styles.invCard + (selectedCallTime ? " " + styles.timeSelected : "")}>
			<section className={styles.orgSection}>
				<div className={styles.orgLogoPlaceholder}>📷</div>
				<h1 className={styles.orgName}>{invite.org.name}</h1>
			</section>

			<section className={styles.agentSection}>
				<div className={styles.agentDepartment}>{invite.agent.department}</div>
				<div className={styles.agentName}>{invite.agent.name}</div>
			</section>

			{invite.message && <p className={styles.message}>{invite.message}</p>}

			<section className={styles.recipientAndCallSection}>
				<div className={styles.recipientSection}>
					<div className={styles.recipientName}>{invite.recipient.name}</div>
					<div className={styles.recipientNumber}>
						<span>{invite.recipient.phone.countryCode}</span>
						<span>{invite.recipient.phone.number}</span>
					</div>
				</div>

				<div aria-description="Duration of phone call" className={styles.callDuration}>
					{secsToReadableDuration(invite.callDuration)}
				</div>
			</section>

			<section className={styles.schedulingSection}>
				<button
					className={styles.schedulingComponentPlaceholder}
					onClick={() => setSelectedCallTime(selectedCallTime ? "" : "timestamp")}
				>
					{selectedCallTime ? "Clear" : "🗓️"}
				</button>
				<p aria-description="Call invitation's expiration time" className={styles.schedulingExpiry}>
					{new Date(invite.expiry).toLocaleDateString()}
				</p>
			</section>

			<section className={styles.submitSection}>
				<textarea
					aria-label={"Optional message to " + invite.org.name}
					placeholder={"Add message?"}
					className={styles.submitNoteInput}
					onInput={(event) => setMessageToOrg(event.currentTarget.value)}
				/>

				<button className={styles.submitButton} onClick={submitInviteAccept}>
					Submit
				</button>
			</section>

			<div className={styles.inviteId}>{invite.id}</div>
		</section>
	);
}
