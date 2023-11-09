import {HTMLInputTypeAttribute} from "react";
import styles from "./inputs.module.css";

interface props {
	handler: (text: string) => void;
	placeholder: string;
	type?: "textarea" | HTMLInputTypeAttribute;
	id?: string;
}

export function Input({handler, placeholder, type, id}: props) {
	return type === "textarea" ? (
		<textarea
			className={styles.input}
			id={id}
			placeholder={placeholder}
			onInput={(event) => handler(event.currentTarget.value)}
		/>
	) : (
		<input
			className={styles.input}
			id={id}
			placeholder={placeholder}
			onInput={(event) => handler(event.currentTarget.value)}
		/>
	);
}

interface labelledInputProps extends Omit<props, "placeholder"> {
	label: string;
	id: string;
}
export function LabelledInput(props: labelledInputProps) {
	return (
		<div className={styles.inputWrapper}>
			<Input {...props} placeholder={" "} />
			<label className={styles.inputLabel} htmlFor={props.id}>
				{props.label}
			</label>
		</div>
	);
}
