import {OrgCreationRequest, AgentCreationRequest} from "../../../../shared/objects/org";
import {apiFetch} from "../../helpers/apiFetch";
import {useState} from "react";
import {LabelledInput, SearchableInput} from "../../components/inputs";
import {timezones} from "../../../../shared/objects/timezones";
import {regex, length} from "../../../../shared/objects/validation";
import {useNotifStore} from "../../stores/notifs";
import {useNavigate} from "react-router-dom";
import coreStyles from "../../core.module.css";
import styles from "./signUp.module.css";

export default function SignUp() {
	const notifs = useNotifStore();
	const navigate = useNavigate();

	const defaultColor = getComputedStyle(document.body).getPropertyValue("--backgroundColor");
	const defaultTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	const [page, setPage] = useState<number>(1);
	const pageLabelledInputValidators: (() => boolean)[] = [
		() => Boolean(org.name && org.color && org.timezone),
		() => Boolean(agent.name && agent.department && agent.countryCode),
	];
	const pageCount = pageLabelledInputValidators.length;

	const [org, setOrg] = useState<OrgCreationRequest>({
		name: "",
		color: defaultColor,
		timezone: defaultTimezone,
	});
	const [agent, setAgent] = useState<AgentCreationRequest>({
		name: "",
		department: "",
		countryCode: "",
		internals: {permissions: {}},
	});

	function validatePageLabelledInputs() {
		const validation = pageLabelledInputValidators[page - 1]();

		if (!validation) {
			notifs.create({
				text: "Please ensure all fields are filled",
				desirability: false,
				manualDismiss: true,
			});
		}

		return validation;
	}

	async function submit() {
		const response = await apiFetch("POST", "/orgs", {agent, org: {...org, color: org.color.slice(1)}});

		if (response.error?.message) {
			notifs.create({
				text: response.error.message,
				desirability: false,
				manualDismiss: true,
			});
			return;
		}

		navigate("/dashboard");
	}

	return (
		<section id={styles.signUpWrapper}>
			<h2>Sign Up</h2>
			<form>
				<div id={styles.pagesWrapper}>
					{page === 1 && (
						<section className={styles.page}>
							<h3>Organization Data</h3>
							<h4></h4>
							<LabelledInput
								id={"orgNameInput"}
								label={"Name"}
								collapsedLabel={true}
								defaultValue={org.name}
								minLength={length.orgName.min}
								maxLength={length.orgName.max}
								required={true}
								handler={(val) => setOrg({...org, name: val})}
							/>
							<LabelledInput
								id={"orgColorInput"}
								type={"color"}
								defaultValue={org.color}
								label={"Color"}
								pattern={regex.color}
								required={true}
								handler={(val) => setOrg({...org, color: val})}
							/>
							<SearchableInput
								id={"orgTimezoneInput"}
								defaultValue={org.timezone}
								collapsedLabel={true}
								type={"search"}
								labelled={true}
								label={"Timezone"}
								pattern={regex.timezone} // has hilariously large HTML output, but i think it's worth it
								required={true}
								handler={(zone) => {
									try {
										new Date().toLocaleString([], {timeZone: zone});
									} catch (err) {
										return;
									}
									setOrg({...org, timezone: zone});
								}}
								options={timezones}
							/>
						</section>
					)}
					{page === 2 && (
						<section className={styles.page}>
							<h3>Your Data</h3>
							<LabelledInput
								id={"agentNameInput"}
								label={"Name"}
								collapsedLabel={true}
								defaultValue={agent.name}
								minLength={length.agentName.min}
								maxLength={length.agentName.max}
								required={true}
								handler={(val) => setAgent({...agent, name: val})}
							/>
							<LabelledInput
								id={"agentDepartmentInput"}
								label={"Department"}
								collapsedLabel={true}
								defaultValue={agent.department}
								minLength={length.agentDepartment.min}
								maxLength={length.agentDepartment.max}
								required={true}
								handler={(val) => setAgent({...agent, department: val})}
							/>
							<LabelledInput
								id={"agentCountryCodeInput"}
								label={"Country Code (Phone)"}
								type={"number"}
								collapsedLabel={true}
								defaultValue={agent.countryCode}
								pattern={regex.countryCode}
								required={true}
								handler={(val) => setAgent({...agent, countryCode: val})}
							/>
						</section>
					)}
				</div>
				<div id={styles.buttonsWrapper}>
					{page > 1 && (
						<button className={coreStyles.borderButton} type="button" onClick={() => setPage(page - 1)}>
							Previous
						</button>
					)}
					{page < pageCount ? (
						<button
							className={coreStyles.borderButton}
							type="button"
							onClick={() => validatePageLabelledInputs() && setPage(page + 1)}
						>
							Next
						</button>
					) : (
						<button
							className={coreStyles.backgroundButton}
							type="button"
							onClick={() => validatePageLabelledInputs() && submit()}
						>
							Submit
						</button>
					)}
				</div>
			</form>
			<section id="invitePreview">
				{/* will be replaced with the same component as the recipient-view invite, for preview during registration */}
			</section>
		</section>
	);
}
