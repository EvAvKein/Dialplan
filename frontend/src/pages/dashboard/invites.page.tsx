import {type recursiveRecord} from "../../../../shared/helpers/dataRecord";
import {type InviteCreationRequest, type Invite} from "../../../../shared/objects/inv";
import {useEffect, useState} from "react";
import {apiFetch} from "../../helpers/apiFetch";
import {secsToReadableDuration} from "../../helpers/secsToReadableDuration";
import {LabelledInput} from "../../components/inputs";
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

	const [formData, setFormData] = useState<InviteCreationRequest>({
		recipient: {
			name: "",
			phone: {
				countryCode: "" /* TODO: when implementing SSR, make the default the agent's code */,
				number: "",
			},
		},
		callDuration: NaN, // i wanted to avoid declaring a default value, and this is an easy type-safe alternative
		expiry: "",
		notes: {
			forRecipient: "",
			forOrg: "",
		},
	});

	const [dataValidity, setDataValidity] = useState<recursiveRecord<InviteCreationRequest, boolean>>({
		recipient: {
			name: false,
			phone: {
				countryCode: false,
				number: false,
			},
		},
		callDuration: false,
		expiry: false,
		notes: {
			forRecipient: true,
			forOrg: true,
		},
	});

	async function submit() {
		if (
			[
				regex.recipient.name.test(formData.recipient.name),
				regex.recipient.phone.countryCode.test(formData.recipient.phone.countryCode),
				regex.recipient.phone.number.test(formData.recipient.phone.number),
				formData.callDuration,
				formData.expiry,
			].some((value) => !value)
		) {
			notifs.create({text: "Invalid data", desirability: false});
			return;
		}
		await apiFetch<Invite>("POST", "/invites", formData)
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
						<tr>
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
								Invite <br /> Expiry
							</th>
							<th>Notes</th>
						</tr>
						{invites.map((invite) => (
							<tr key={invite.id}>
								<td>{invite.recipient.name}</td>
								<td>+{invite.recipient.phone.countryCode + " " + invite.recipient.phone.number}</td>
								{/* TODO when adding SSR, replace countryCode and space with 0 if it matches the agent's countryCode */}
								<td>{secsToReadableDuration(invite.callDuration)}</td>
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
						<LabelledInput
							label={"Recipient name"}
							id={"recipientName"}
							data-testid={"newRecipientName"}
							autoFocus={true}
							aria-invalid={!dataValidity.recipient.name}
							defaultValue={formData.recipient.name}
							handler={(value) => {
								setFormData({...formData, recipient: {...formData.recipient, name: value}});
								setDataValidity({
									...dataValidity,
									recipient: {...dataValidity.recipient, name: regex.recipient.name.test(value)},
								});
							}}
						/>
						<section id={styles.recipientPhoneWrapper}>
							<LabelledInput
								label={"Prefix"}
								id={"countryCode"}
								data-testid={"newCountryCode"}
								type={"number"}
								aria-invalid={!dataValidity.recipient.phone.countryCode}
								defaultValue={formData.recipient.phone.countryCode}
								handler={(value) => {
									setFormData({
										...formData,
										recipient: {...formData.recipient, phone: {...formData.recipient.phone, countryCode: value}},
									});
									setDataValidity({
										...dataValidity,
										recipient: {
											...dataValidity.recipient,
											phone: {
												...dataValidity.recipient.phone,
												countryCode: regex.recipient.phone.countryCode.test(value),
											},
										},
									});
								}}
							/>
							|
							<LabelledInput
								label={"Phone number"}
								id={"phoneNumber"}
								data-testid={"newPhoneNumber"}
								type={"number"} // avoiding "tel" because it allows non-number characters
								aria-invalid={!dataValidity.recipient.phone.number}
								defaultValue={formData.recipient.phone.number}
								handler={(value) => {
									setFormData({
										...formData,
										recipient: {...formData.recipient, phone: {...formData.recipient.phone, number: value}},
									});
									setDataValidity({
										...dataValidity,
										recipient: {
											...dataValidity.recipient,
											phone: {
												...dataValidity.recipient.phone,
												number: regex.recipient.phone.number.test(value),
											},
										},
									});
								}}
							/>
						</section>
						<LabelledInput
							label={"Call duration (minutes)"}
							id={"callDuration"}
							data-testid={"newCallDuration"}
							type={"number"}
							aria-invalid={!dataValidity.callDuration}
							defaultValue={formData.callDuration.toString()}
							handler={(value) => {
								setFormData({...formData, callDuration: parseInt(value)});
								setDataValidity({...dataValidity, callDuration: regex.callDuration.test(value)});
							}}
						/>
						<LabelledInput
							label={"Invite Expiry"}
							id={"expiry"}
							data-testid={"newExpiry"}
							type={"datetime-local"}
							aria-invalid={!dataValidity.expiry}
							defaultValue={formData.expiry.replace(":00Z", "")}
							handler={(value) => {
								setFormData({...formData, expiry: value + ":00Z"}); // adding ":00Z" to make it a valid ISO string for backend's Zod validation
								setDataValidity({...dataValidity, expiry: true}); // no need to validate, the datetime-local type ensures it's valid (for frontend)
							}}
						/>
						<LabelledInput
							label={"Notes for recipient"}
							id={"notesForRecipient"}
							data-testid={"newNotesForRecipient"}
							aria-invalid={!dataValidity.notes.forRecipient}
							defaultValue={formData.notes.forRecipient}
							handler={(value) => {
								setFormData({...formData, notes: {...formData.notes, forRecipient: value}});
								setDataValidity({
									...dataValidity,
									notes: {...dataValidity.notes, forRecipient: notesRegex.forRecipient.test(value)},
								});
							}}
						/>
						<LabelledInput
							label={"Notes for organization"}
							id={"notesForOrg"}
							data-testid={"newNotesForOrg"}
							type={"textarea"}
							aria-invalid={!dataValidity.notes.forOrg}
							defaultValue={formData.notes.forOrg}
							handler={(value) => {
								setFormData({...formData, notes: {...formData.notes, forOrg: value}});
								setDataValidity({
									...dataValidity,
									notes: {...dataValidity.notes, forOrg: notesRegex.forOrg.test(value)},
								});
							}}
						/>
						<button className={coreStyles.backgroundButton} data-testid={"newInviteSubmit"} onClick={submit}>
							Send Invite
						</button>
					</form>
				</Modal>
			</section>
		</div>
	);
}
