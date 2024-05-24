import {recursiveRecord} from "../../../../shared/helpers/dataRecord";
import {InviteCreationRequest} from "../../../../shared/objects/inv";
import {InputState} from "../../helpers/inputState";
import {LabelledInput} from "../inputs";
import styles from "./inviteCreation.module.css";

type formData = recursiveRecord<InviteCreationRequest, InputState>;
type props = {
	formState: formData;
	setFormState: (formState: formData) => void;
};
export function InviteCreation({formState, setFormState}: props) {
	return (
		<section id={styles.inviteCreationWrapper}>
			<LabelledInput
				label={"Recipient name"}
				id={"recipientName"}
				data-testid={"newRecipientName"}
				autoFocus={true}
				aria-invalid={!formState.recipient.name.valid}
				value={formState.recipient.name.value}
				handler={(value) => (formState.recipient.name.set(value), setFormState({...formState}))}
			/>
			<section id={styles.recipientPhoneWrapper}>
				<LabelledInput
					label={"Prefix"}
					id={"countryCode"}
					data-testid={"newCountryCode"}
					type={"number"}
					aria-invalid={!formState.recipient.phone.countryCode.valid}
					value={formState.recipient.phone.countryCode.value}
					handler={(value) => (formState.recipient.phone.countryCode.set(value), setFormState({...formState}))}
				/>
				|
				<LabelledInput
					label={"Phone number"}
					id={"phoneNumber"}
					data-testid={"newPhoneNumber"}
					type={"number"} // avoiding "tel" because it allows non-number characters
					aria-invalid={!formState.recipient.phone.number.valid}
					value={formState.recipient.phone.number.value}
					handler={(value) => (formState.recipient.phone.number.set(value), setFormState({...formState}))}
				/>
			</section>
			<LabelledInput
				label={"Call duration (minutes)"}
				id={"callDuration"}
				data-testid={"newCallDuration"}
				type={"number"}
				aria-invalid={!formState.secCallDuration.valid}
				value={formState.secCallDuration.value}
				handler={(value) => (formState.secCallDuration.set(value), setFormState({...formState}))}
			/>
			<LabelledInput
				label={"Invite Expiry"}
				id={"expiry"}
				data-testid={"newExpiry"}
				type={"datetime-local"}
				aria-invalid={!formState.expiry.valid}
				value={formState.expiry.value.replace(":00Z", "")}
				handler={
					(value) => (formState.expiry.set(value + ":00Z"), setFormState({...formState})) // adding ":00Z" to make it a valid ISO string for backend's Zod validation
				}
			/>
			<LabelledInput
				label={"Notes for recipient"}
				id={"notesForRecipient"}
				data-testid={"newNotesForRecipient"}
				aria-invalid={!formState.notes.forRecipient!.valid}
				value={formState.notes.forRecipient!.value}
				handler={(value) => (formState.notes.forRecipient!.set(value), setFormState({...formState}))}
			/>
			<LabelledInput
				label={"Notes for organization"}
				id={"notesForOrg"}
				data-testid={"newNotesForOrg"}
				type={"textarea"}
				aria-invalid={!formState.notes.forOrg!.valid}
				value={formState.notes.forOrg!.value}
				handler={(value) => (formState.notes.forOrg!.set(value), setFormState({...formState}))}
			/>
		</section>
	);
}
