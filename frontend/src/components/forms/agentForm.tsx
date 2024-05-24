import {type recursiveRecord} from "../../../../shared/helpers/dataRecord";
import {type Agent} from "../../../../shared/objects/org";
import {type InputState} from "../../helpers/inputState";
import {LabelledInput, SearchableInput} from "../inputs";
import {timezones} from "../../../../shared/objects/timezones";
import styles from "./agentForm.module.css";

type formState = recursiveRecord<Omit<Agent, "id" | "orgId" | "internals">, InputState>;
type props = {
	formState: formState;
	setFormState: (formState: formState) => void;
};
export function AgentForm({formState, setFormState}: props) {
	return (
		<section id={styles.agentFormWrapper}>
			<LabelledInput
				label={"Name"}
				id={"agentNameInput"}
				data-testId={"agentNameInput"}
				aria-invalid={!formState.name.valid}
				autoFocus={true}
				collapsedLabel={true}
				value={formState.name.value}
				handler={(value) => (formState.name.set(value), setFormState({...formState}))}
			/>
			<LabelledInput
				label={"Department"}
				id={"agentDepartmentInput"}
				data-testId={"agentDepartmentInput"}
				aria-invalid={!formState.department.valid}
				collapsedLabel={true}
				value={formState.department.value}
				handler={(value) => (formState.department.set(value), setFormState({...formState}))}
			/>
			<LabelledInput
				label={"Country Code (Phone)"}
				id={"agentCountryCodeInput"}
				data-testId={"agentCountryCodeInput"}
				aria-invalid={!formState.countryCode.valid}
				type={"number"}
				collapsedLabel={true}
				value={formState.countryCode.value}
				handler={(value) => (formState.countryCode.set(value), setFormState({...formState}))}
			/>
			<SearchableInput
				label={"Timezone"}
				id={"agentTimezoneInput"}
				data-testId={"agentTimezoneInput"}
				aria-invalid={!formState.timezone.valid}
				type={"search"}
				labelled={true}
				collapsedLabel={true}
				value={formState.timezone.value}
				options={timezones}
				handler={(value) => (formState.timezone.set(value), setFormState({...formState}))}
			/>
		</section>
	);
}
