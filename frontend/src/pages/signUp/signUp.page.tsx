import {OrgCreationRequest, AgentCreationRequest} from "../../../../shared/objects/org";
import {apiFetch} from "../../helpers/apiFetch";
import {useState} from "react";
import {Input} from "../../components/inputs";
import styles from "./signUp.module.css";

export default function SignUp() {
	const [org, setOrg] = useState<OrgCreationRequest>({name: "", color: "", timezone: ""});
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
					window.alert(response.error ? response.error.message : "Success!"); // just for testing ofc
				}}
			>
				<section id="org">
					<h3>Organization data</h3>
					<Input placeholder="Name" handler={(val) => setOrg({...org, name: val})} />
					<Input placeholder="Color" handler={(val) => setOrg({...org, color: val})} />
					<Input placeholder="Timezone" handler={(val) => setOrg({...org, timezone: val})} />
				</section>

				<section id="agent">
					<h3>Your agent data</h3>
					<Input placeholder="Name" handler={(val) => setAgent({...agent, name: val})} />
					<Input placeholder="Department" handler={(val) => setAgent({...agent, department: val})} />
					<Input placeholder="Country Code" handler={(val) => setAgent({...agent, countryCode: val})} />
				</section>
				<button type="submit">Submit</button>
			</form>
			<section id="invitePreview">
				{/* will be replaced with the same component as the recipient-view invite, for preview during registration */}
			</section>
		</section>
	);
}
