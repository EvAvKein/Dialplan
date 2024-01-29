import {OrgCreationRequest, AgentCreationRequest} from "../../../../shared/objects/org";
import {apiFetch} from "../../helpers/apiFetch";
import {useState} from "react";
import {LabelledInput, SearchableInput} from "../../components/inputs";
import {timezones} from "../../../../shared/objects/timezones";
import {org as orgRegex, agent as agentRegex} from "../../../../shared/objects/validationRegex";
import {useNotifStore} from "../../stores/notifs";
import {useNavigate} from "react-router-dom";
import coreStyles from "../../core.module.css";
import styles from "./signUp.module.css";

export default function SignUp() {
	const notifs = useNotifStore();
	const navigate = useNavigate();

	const [page, setPage] = useState<number>(1);
	const pageLabelledInputValidators: (() => boolean)[] = [
		() => orgRegex.name.test(org.name) && orgRegex.color.test(org.color),
		() =>
			agentRegex.name.test(agent.name) &&
			agentRegex.department.test(agent.department) &&
			agentRegex.countryCode.test(agent.countryCode) &&
			agentRegex.timezone.test(agent.timezone),
	];
	const pageCount = pageLabelledInputValidators.length;

	const [org, setOrg] = useState<OrgCreationRequest>({
		name: "",
		color: getComputedStyle(document.body).getPropertyValue("--backgroundColor").slice(1),
	});
	const [agent, setAgent] = useState<AgentCreationRequest>({
		name: "",
		department: "",
		countryCode: "",
		timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		internals: {permissions: {}},
	});

	function validatePageLabelledInputs() {
		const validation = pageLabelledInputValidators[page - 1]();

		console.log(validation);

		if (!validation) {
			notifs.create({
				text: "Please fill all fields",
				desirability: false,
			});
		}

		return validation;
	}

	async function submit() {
		const response = await apiFetch("POST", "/orgs", {agent, org: {...org, color: org.color}});

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
								data-testId={"orgNameInput"}
								label={"Name"}
								collapsedLabel={true}
								defaultValue={org.name}
								pattern={orgRegex.name.source}
								required={true}
								handler={(val) => setOrg({...org, name: val})}
							/>
							<LabelledInput
								id={"orgColorInput"}
								data-testId={"orgColorInput"}
								type={"color"}
								defaultValue={"#" + org.color}
								pattern={orgRegex.color.source}
								label={"Color"}
								required={true}
								handler={(val) => setOrg({...org, color: val.slice(1)})}
							/>
						</section>
					)}
					{page === 2 && (
						<section className={styles.page}>
							<h3>Your Data</h3>
							<LabelledInput
								id={"agentNameInput"}
								data-testId={"agentNameInput"}
								label={"Name"}
								collapsedLabel={true}
								defaultValue={agent.name}
								pattern={agentRegex.name.source}
								required={true}
								handler={(val) => setAgent({...agent, name: val})}
							/>
							<LabelledInput
								id={"agentDepartmentInput"}
								data-testId={"agentDepartmentInput"}
								label={"Department"}
								collapsedLabel={true}
								defaultValue={agent.department}
								pattern={agentRegex.department.source}
								required={true}
								handler={(val) => setAgent({...agent, department: val})}
							/>
							<LabelledInput
								id={"agentCountryCodeInput"}
								data-testId={"agentCountryCodeInput"}
								label={"Country Code (Phone)"}
								type={"number"}
								collapsedLabel={true}
								defaultValue={agent.countryCode}
								pattern={agentRegex.countryCode.source}
								required={true}
								handler={(val) => setAgent({...agent, countryCode: val})}
							/>
							<SearchableInput
								id={"agentTimezoneInput"}
								data-testId={"agentTimezoneInput"}
								defaultValue={agent.timezone}
								collapsedLabel={true}
								type={"search"}
								labelled={true}
								label={"Timezone"}
								pattern={agentRegex.timezone.source} // has hilariously large HTML output, but i think it's worth it
								required={true}
								handler={(zone) => setAgent({...agent, timezone: zone})}
								options={timezones}
							/>
						</section>
					)}
				</div>
				<div id={styles.buttonsWrapper}>
					{page > 1 && (
						<button
							data-testid="prevSignUpPage"
							className={coreStyles.borderButton}
							type="button"
							onClick={() => setPage(page - 1)}
						>
							Previous
						</button>
					)}
					{page < pageCount ? (
						<button
							data-testid="nextSignUpPage"
							className={coreStyles.borderButton}
							type="button"
							onClick={() => validatePageLabelledInputs() && setPage(page + 1)}
						>
							Next
						</button>
					) : (
						<button
							data-testid="submitSignUp"
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
