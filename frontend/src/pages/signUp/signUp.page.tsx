import {Agent, Org, type OrgAgentCreationDuo} from "../../../../shared/objects/org";
import {apiFetch} from "../../helpers/apiFetch";
import {useState} from "react";
import {InputState, recursiveInputStateRecordIsValid} from "../../helpers/inputState";
import {InviteCard} from "../../components/inviteCard";
import * as regex from "../../../../shared/objects/validationRegex";
import {useNotifStore} from "../../stores/notifs";
import {useNavigate} from "react-router-dom";
import {recursiveRecord} from "../../../../shared/helpers/dataRecord";
import {AgentForm} from "../../components/forms/agentForm";
import {OrgForm} from "../../components/forms/orgForm";
import coreStyles from "../../core.module.css";
import styles from "./signUp.module.css";

export default function SignUp() {
	const notifs = useNotifStore();
	const navigate = useNavigate();

	type pages = Omit<OrgAgentCreationDuo, "agent"> & {agent: Omit<OrgAgentCreationDuo["agent"], "internals">};
	type pageKey = keyof pages;

	const [page, setPage] = useState<pageKey>("org");

	const [previewOpen, setPreviewOpen] = useState(false);

	const [orgState, setOrgState] = useState<recursiveRecord<Omit<Org, "id" | "internals">, InputState>>({
		name: new InputState("", regex.org.name, 30),
		color: new InputState(
			getComputedStyle(document.body).getPropertyValue("--backgroundColor").slice(1),
			regex.org.color,
			7,
			true,
		),
		customInvCss: new InputState("", regex.org.customInvCss, null, true),
		customInvCssOverrides: new InputState("false", /true|false/, null, true),
	} as const);

	const [agentState, setAgentState] = useState<recursiveRecord<Omit<Agent, "id" | "orgId" | "internals">, InputState>>({
		name: new InputState("", regex.agent.name, 30),
		department: new InputState("", regex.agent.department, 50),
		countryCode: new InputState("", regex.agent.countryCode, 3),
		timezone: new InputState(Intl.DateTimeFormat().resolvedOptions().timeZone, regex.agent.timezone, null, true),
	} as const);

	async function submit() {
		const formDataValid = recursiveInputStateRecordIsValid(orgState) && recursiveInputStateRecordIsValid(agentState);
		if (!formDataValid) {
			notifs.create({
				text: "Please fill all fields correctly",
				desirability: false,
			});
			return;
		}

		const formData: OrgAgentCreationDuo = {
			org: {
				name: orgState.name.value,
				color: orgState.color.value,
				customInvCss: orgState.customInvCss.value,
				customInvCssOverrides: orgState.customInvCssOverrides.value === "true",
			},
			agent: {
				name: agentState.name.value,
				department: agentState.department.value,
				countryCode: agentState.countryCode.value,
				timezone: agentState.timezone.value,
				internals: {permissions: {}},
			},
		};
		const response = await apiFetch("POST", "/orgs", formData);

		response.error?.message
			? notifs.create({
					text: response.error.message,
					desirability: false,
					manualDismiss: true,
			  })
			: navigate("/dashboard");
	}

	return (
		<section id={styles.signUpWrapper}>
			<h2>Sign Up</h2>
			<form id={styles.signUpForm} onSubmit={(event) => event.preventDefault()}>
				<div id={styles.pagesWrapper}>
					{page === "org" && (
						<section className={styles.page}>
							<h3>Organization Data</h3>
							<OrgForm formState={orgState} setFormState={setOrgState} />
						</section>
					)}
					{page === "agent" && (
						<section className={styles.page}>
							<h3>Your Data</h3>
							<AgentForm formState={agentState} setFormState={setAgentState} />
						</section>
					)}
				</div>
				<div id={styles.buttonsWrapper}>
					{page === "org" ? (
						<button
							data-testid="nextSignUpPage"
							className={coreStyles.borderButton}
							onClick={() =>
								recursiveInputStateRecordIsValid(orgState)
									? setPage("agent")
									: notifs.create({text: "Please fill all fields correctly", desirability: false})
							}
						>
							Next
						</button>
					) : (
						<>
							<button data-testid="prevSignUpPage" className={coreStyles.borderButton} onClick={() => setPage("org")}>
								Previous
							</button>
							<button data-testid="submitSignUp" className={coreStyles.backgroundButton} onClick={() => submit()}>
								Submit
							</button>
						</>
					)}
				</div>
			</form>
			<section id={styles.invitePreview} className={previewOpen ? styles.previewOpen : ""}>
				<button
					className={coreStyles.backgroundButton + " " + styles.previewToggle}
					onClick={() => setPreviewOpen(!previewOpen)}
				>
					Invite Preview
				</button>
				<h3>Invite Preview</h3>
				<section>
					<InviteCard
						invite={{
							id: "3512c283-sample_id-b01c-dc2ede118f7a",
							org: {
								name: orgState.name.value || "[Company]",
								color: orgState.color.value,
								customInvCss: orgState.customInvCss.value,
								customInvCssOverrides: orgState.customInvCssOverrides.value === "true",
							},
							agent: {
								name: agentState.name.value || "[Agent]",
								department: agentState.department.value || "[Department]",
							},
							recipient: {
								name: "[Recipient Name]",
								phone: {
									countryCode: "0",
									number: "12345678",
								},
							},
							secCallDuration: 1234,
							expiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
							message: "[Message to the invite recipient, optional]",
						}}
						handler={(call) => {
							if (!call.time) {
								notifs.create({
									text: "No call time selected, you'd be able allow this (if the recipient types a message) through your org's settings",
									desirability: false,
									manualDismiss: true,
								});
								return;
							}
							notifs.create({text: "Call would be added to your org's and agent's schedule", desirability: true});
						}}
					/>
				</section>
			</section>
		</section>
	);
}
