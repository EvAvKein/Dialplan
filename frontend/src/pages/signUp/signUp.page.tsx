import {type nestedRecord} from "../../../../shared/helpers/dataRecord";
import {type OrgAgentCreationDuo} from "../../../../shared/objects/org";
import {apiFetch} from "../../helpers/apiFetch";
import {useState} from "react";
import {LabelledInput, SearchableInput} from "../../components/inputs";
import {timezones} from "../../../../shared/objects/timezones";
import * as regex from "../../../../shared/objects/validationRegex";
import {useNotifStore} from "../../stores/notifs";
import {useNavigate} from "react-router-dom";
import coreStyles from "../../core.module.css";
import styles from "./signUp.module.css";

export default function SignUp() {
	const notifs = useNotifStore();
	const navigate = useNavigate();

	type pages = Omit<OrgAgentCreationDuo, "agent"> & {agent: Omit<OrgAgentCreationDuo["agent"], "internals">};
	type pageKey = keyof pages;
	type formRecord<T = unknown> = nestedRecord<pages, T>;

	const [page, setPage] = useState<pageKey>("org");

	const [formData, setFormData] = useState<formRecord<string>>({
		org: {
			name: "",
			color: getComputedStyle(document.body).getPropertyValue("--backgroundColor").slice(1),
		},
		agent: {
			name: "",
			department: "",
			countryCode: "",
			timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		},
	});

	const [dataValidity, setDataValidity] = useState<formRecord<boolean>>({
		org: {
			name: false,
			color: true,
		},
		agent: {
			name: false,
			department: false,
			countryCode: false,
			timezone: true,
		},
	});
	const patterns: formRecord<RegExp> = {
		org: {
			name: regex.org.name,
			color: regex.org.color,
		},
		agent: {
			name: regex.agent.name,
			department: regex.agent.department,
			countryCode: regex.agent.countryCode,
			timezone: regex.agent.timezone,
		},
	};

	function processNewInput<
		K extends keyof typeof patterns,
		K2 extends keyof (typeof patterns)[K] = keyof (typeof patterns)[K],
	>(pageKey: K, fieldKey: K2, newValue: string) {
		const pattern = patterns[pageKey][fieldKey];
		const validity = pattern.test(newValue);

		setFormData({...formData, [pageKey]: {...formData[pageKey], [fieldKey]: newValue}});
		setDataValidity({...dataValidity, [pageKey]: {...dataValidity[pageKey], [fieldKey]: validity}});
	}

	async function submit() {
		const formDataValid = Object.values(dataValidity).every((page) => Object.values(page).every((field) => field));

		if (!formDataValid) {
			notifs.create({
				text: "Please fill all fields correctly",
				desirability: false,
			});
			return;
		}

		const response = await apiFetch("POST", "/orgs", {
			...formData,
			agent: {...formData.agent, internals: {permissions: {}}},
		} satisfies OrgAgentCreationDuo);

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
			<form onSubmit={(event) => event.preventDefault()}>
				<div id={styles.pagesWrapper}>
					{page === "org" && (
						<section className={styles.page}>
							<h3>Organization Data</h3>
							<h4></h4>
							<LabelledInput
								label={"Name"}
								id={"orgNameInput"}
								data-testId={"orgNameInput"}
								aria-invalid={!dataValidity.org.name}
								autoFocus={true}
								collapsedLabel={true}
								defaultValue={formData.org.name}
								handler={(value) => processNewInput("org", "name", value)}
							/>
							<LabelledInput
								label={"Color"}
								id={"orgColorInput"}
								data-testId={"orgColorInput"}
								aria-invalid={!dataValidity.org.color}
								type={"color"}
								collapsedLabel={true}
								defaultValue={"#" + formData.org.color}
								handler={(value) => processNewInput("org", "color", value.slice(1))}
							/>
						</section>
					)}
					{page === "agent" && (
						<section className={styles.page}>
							<h3>Your Data</h3>
							<LabelledInput
								label={"Name"}
								id={"agentNameInput"}
								data-testId={"agentNameInput"}
								aria-invalid={!dataValidity.agent.name}
								autoFocus={true}
								collapsedLabel={true}
								defaultValue={formData.agent.name}
								handler={(value) => processNewInput("agent", "name", value)}
							/>
							<LabelledInput
								label={"Department"}
								id={"agentDepartmentInput"}
								data-testId={"agentDepartmentInput"}
								aria-invalid={!dataValidity.agent.department}
								collapsedLabel={true}
								defaultValue={formData.agent.department}
								handler={(value) => processNewInput("agent", "department", value)}
							/>
							<LabelledInput
								label={"Country Code (Phone)"}
								id={"agentCountryCodeInput"}
								data-testId={"agentCountryCodeInput"}
								aria-invalid={!dataValidity.agent.countryCode}
								type={"number"}
								collapsedLabel={true}
								defaultValue={formData.agent.countryCode}
								handler={(value) => processNewInput("agent", "countryCode", value)}
							/>
							<SearchableInput
								label={"Timezone"}
								id={"agentTimezoneInput"}
								data-testId={"agentTimezoneInput"}
								aria-invalid={!dataValidity.agent.timezone}
								type={"search"}
								labelled={true}
								collapsedLabel={true}
								defaultValue={formData.agent.timezone}
								options={timezones}
								handler={(value) => processNewInput("agent", "timezone", value)}
							/>
						</section>
					)}
				</div>
				<div id={styles.buttonsWrapper}>
					{page === "org" ? (
						<button
							data-testid="nextSignUpPage"
							className={coreStyles.borderButton}
							onClick={() => {
								Object.values(dataValidity.org).every((valid) => valid)
									? setPage("agent")
									: notifs.create({
											text: "Please fill all fields correctly",
											desirability: false,
									  });
							}}
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
			<section id="invitePreview">
				{/* will be replaced with the same component as the recipient-view invite, for preview during registration */}
			</section>
		</section>
	);
}
