import {type recursiveRecord} from "../../../../shared/helpers/dataRecord";
import {type InviteCreationRequest, type Invite} from "../../../../shared/objects/inv";
import {useEffect, useState} from "react";
import {apiFetch} from "../../helpers/apiFetch";
import {secsToReadableDuration} from "../../helpers/secsToReadableDuration";
import {
	InputState,
	recursiveInputStateRecordIsValid,
	recursiveInputStateRecordToValues,
} from "../../helpers/inputState";
import {InviteCreation} from "../../components/forms/inviteCreation";
import {useNotifStore} from "../../stores/notifs";
import {invite as regex, inviteNotes as notesRegex} from "../../../../shared/objects/validationRegex";
import Modal from "../../components/modal";
import coreStyles from "../../core.module.css";
import styles from "./invites.module.css";

export default function Invites_Dashboard() {
	const notifs = useNotifStore();

	const [invites, setInvites] = useState<Invite[] | undefined>(undefined);
	const [invitesFetchError, setInvitesFetchError] = useState<string | null>(null);
	const [inviteCreationModal, setInviteCreationModal] = useState<boolean>(false);

	const [formState, setFormState] = useState<recursiveRecord<InviteCreationRequest, InputState>>({
		recipient: {
			name: new InputState("", regex.recipient.name, 30),
			phone: {
				countryCode: new InputState(
					"",
					regex.recipient.phone.countryCode,
					3,
				) /* TODO: when implementing SSR, make the default the agent's code */,
				number: new InputState("", regex.recipient.phone.number, 9),
			},
		},
		secCallDuration: new InputState("", regex.secCallDuration, 3),
		expiry: new InputState("", /\\*/),
		notes: {
			forRecipient: new InputState("", notesRegex.forRecipient, 250, true),
			forOrg: new InputState("", notesRegex.forOrg, 500, true),
		},
	});

	function copyIdToClipboard(id: string) {
		navigator.clipboard
			.writeText(id)
			.then(() => {
				notifs.create({text: "Invite ID copied", desirability: true});
			})
			.catch(() => {
				notifs.create({text: "Failed to copy invite ID", desirability: false});
			});
	}

	async function submit() {
		if (!recursiveInputStateRecordIsValid(formState)) {
			notifs.create({text: "Invalid data", desirability: false});
			return;
		}

		await apiFetch<Invite>("POST", "/invites", {
			...recursiveInputStateRecordToValues(formState),
			secCallDuration: Number(formState.secCallDuration.value),
		})
			.then((response) => {
				if (response.error) {
					notifs.create({text: response.error.message, desirability: false});
					return;
				}

				notifs.create({text: "Invite created!", desirability: true});
				setInvites(invites ? [response.data!, ...invites] : [response.data!]);
				setInviteCreationModal(false);
			})
			.catch(() => {
				notifs.create({text: "Failed to create invite", desirability: false});
			});
	}

	useEffect(() => {
		apiFetch<Invite[]>("GET", "/invites")
			.then((response) => (response.error ? setInvitesFetchError(response.error.message) : setInvites(response.data!)))
			.catch(() => {
				setInvitesFetchError("Failed to fetch invites");
			});
	}, []);

	return (
		<div id={styles.pageWrapper}>
			<section>
				<button
					id={styles.inviteCreationButton}
					data-testid={"openInviteCreationForm"}
					className={coreStyles.backgroundButton}
					onClick={() => setInviteCreationModal(true)}
				>
					Create Invite
				</button>
			</section>
			<section id={styles.invitesWrapper}>
				{invites === undefined ? (
					<p className={styles.invitesPlaceholder}>Loading...</p>
				) : invitesFetchError ? (
					<p className={styles.invitesPlaceholder}>{invitesFetchError}</p>
				) : !invites.length ? (
					<p className={styles.invitesPlaceholder}>No pending invites!</p>
				) : (
					<table data-testid={"invitesTable"} id={styles.invitesTable}>
						{/* TODO: replace this with a <ul> of collapsible items */}
						<tr>
							<th>ID</th>
							<th>
								Client <br /> Name
							</th>
							<th>
								Phone <br /> Number
							</th>
							<th>
								Call <br /> Duration
							</th>
							<th>
								Invitation <br /> Expiry
							</th>
							<th>Notes</th>
						</tr>
						{invites.map((invite) => (
							<tr key={invite.id}>
								<td>
									<button className={coreStyles.contentButton} onClick={() => copyIdToClipboard(invite.id)}>
										📋
									</button>
								</td>
								<td>{invite.recipient.name}</td>
								<td>
									+{invite.recipient.phone.countryCode + " " + invite.recipient.phone.number}{" "}
									<a
										className={coreStyles.contentButton}
										href={"tel:" + invite.recipient.phone.countryCode + invite.recipient.phone.number}
									>
										☎️
									</a>
								</td>
								{/* TODO when adding SSR, replace countryCode and space with 0 if it matches the agent's countryCode */}
								<td>{secsToReadableDuration(invite.secCallDuration)}</td>
								<td>{new Date(invite.expiry).toLocaleString().replace(":00", "")}</td>
								<td>
									{invite.notes.forOrg || invite.notes.forRecipient ? (
										<details>
											<summary>View</summary>
											<section>
												{invite.notes.forOrg && (
													<>
														<div>Internal:</div>
														<p>{invite.notes.forOrg}</p>
													</>
												)}
												{invite.notes.forOrg && invite.notes.forRecipient && <hr />}
												{invite.notes.forRecipient && (
													<>
														<div>Client:</div>
														<p>{invite.notes.forRecipient}</p>
													</>
												)}
											</section>
										</details>
									) : (
										"None"
									)}
								</td>
							</tr>
						))}
					</table>
				)}

				<Modal visibleTruthiness={inviteCreationModal} dismissHandler={() => setInviteCreationModal(false)}>
					<form id={styles.inviteForm} onSubmit={(e) => e.preventDefault()}>
						<InviteCreation formState={formState} setFormState={setFormState} />
						<button className={coreStyles.backgroundButton} data-testid={"newInviteSubmit"} onClick={submit}>
							Send Invite
						</button>
					</form>
				</Modal>
			</section>
		</div>
	);
}
