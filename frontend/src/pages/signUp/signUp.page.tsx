import {OrgCreationRequest, AgentCreationRequest} from "../../../../shared/objects/org";
import {apiFetch} from "../../helpers/apiFetch";
import {useState} from "react";
import {Input, SearchableInput} from "../../components/inputs";
import {timezones, timezoneValuesRegex} from "../../helpers/timezones";
import {useNotifStore} from "../../stores/notifs";
import coreStyles from "../../core.module.css";
import styles from "./signUp.module.css";

export default function SignUp() {
	const notifs = useNotifStore();

	const [org, setOrg] = useState<OrgCreationRequest>({
		name: "",
		color: getComputedStyle(document.body).getPropertyValue("--backgroundColor"),
		timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
	});
	const [agent, setAgent] = useState<AgentCreationRequest>({
		name: "",
		department: "",
		countryCode: "",
		internals: {permissions: {}},
	});

	return (
		<section className={styles.signUpWrapper}>
			<h2>Sign Up</h2>
			<form
				onSubmit={async (e) => {
					e.preventDefault();
					const response = await apiFetch("POST", "/orgs", {org, agent});
					notifs.create({
						text: response.error?.message ?? "Success!",
						desirability: !response.error,
						manualDismiss: true,
					});
				}}
			>
				<section id="org">
					<h3>Organization data</h3>
					<Input placeholder="Name" handler={(val) => setOrg({...org, name: val})} />
					<Input placeholder="Color" handler={(val) => setOrg({...org, color: val})} />
					<SearchableInput
						id={"timezoneInput"}
						type={"search"}
						label={"Timezone"}
						pattern={timezoneValuesRegex} // has hilariously large HTML output, but i think it's worth it
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

				<section id="agent">
					<h3>Your personnel data</h3>
					<Input placeholder="Name" handler={(val) => setAgent({...agent, name: val})} />
					<Input placeholder="Department" handler={(val) => setAgent({...agent, department: val})} />
					<Input placeholder="Country Code" handler={(val) => setAgent({...agent, countryCode: val})} />
				</section>
				<button className={coreStyles.backgroundButton} type="submit">
					Submit
				</button>
			</form>
			<section id="invitePreview">
				{/* will be replaced with the same component as the recipient-view invite, for preview during registration */}
			</section>
		</section>
	);
}
