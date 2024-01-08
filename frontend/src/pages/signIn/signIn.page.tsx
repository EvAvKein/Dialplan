import {apiFetch} from "../../helpers/apiFetch";
import {useState} from "react";
import {LabelledInput} from "../../components/inputs";
import {useNotifStore} from "../../stores/notifs";
import {useNavigate} from "react-router-dom";
import coreStyles from "../../core.module.css";
import styles from "./signIn.module.css";

export default function SignIn() {
	const notifs = useNotifStore();
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		agentId: "",
		sessionId: "",
	});

	async function submit() {
		const response = await apiFetch("POST", "/sessions", formData);

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
		<section id={styles.signInWrapper}>
			<h2>Sign In</h2>
			<h3>(Temporary, will change to a proper procedure)</h3>
			<form>
				<div id={styles.inputsWrapper}>
					<LabelledInput
						id={"agentIdInput"}
						testId={"agentIdInput"}
						label={"AgentId"}
						collapsedLabel={true}
						defaultValue={formData.agentId}
						required={true}
						handler={(val) => setFormData({...formData, agentId: val})}
					/>
					<LabelledInput
						id={"sessionIdInput"}
						testId={"sessionIdInput"}
						label={"SessionId"}
						collapsedLabel={true}
						defaultValue={formData.sessionId}
						required={true}
						handler={(val) => setFormData({...formData, sessionId: val})}
					/>
				</div>
				<button onClick={submit} className={coreStyles.backgroundButton}>
					Submit
				</button>
			</form>
		</section>
	);
}
