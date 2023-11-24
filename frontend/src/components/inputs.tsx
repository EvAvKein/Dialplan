import {type HTMLInputTypeAttribute} from "react";
import styles from "./inputs.module.css";

interface props {
	handler: (text: string) => void;
	placeholder: string;
	type?: "textarea" | HTMLInputTypeAttribute;
	id?: string;
	list?: string;
}

export function Input({handler, placeholder, type, id, list}: props) {
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
			list={list}
			placeholder={placeholder}
			onInput={(event) => handler(event.currentTarget.value)}
		/>
	);
}

interface labelledInputProps extends Omit<props, "placeholder"> {
	label: string;
	id: string;
}
export function LabelledInput({id, label, handler, list}: labelledInputProps) {
	return (
		<div className={styles.labelledInputWrapper}>
			<Input id={id} placeholder={" "} handler={handler} list={list} />
			<label className={styles.inputLabel} htmlFor={id}>
				{label}
			</label>
		</div>
	);
}

interface searchableInputProps extends labelledInputProps {
	id: string;
	options: {value: string; text: string}[];
	labelled?: true;
}
export function SearchableInput({id, options, label = " ", labelled, handler}: searchableInputProps) {
	return (
		<div>
			{labelled ? (
				<LabelledInput list={id} label={label} handler={handler} id={id + "LabelComponent"} />
			) : (
				<Input list={id} placeholder={label} handler={handler} />
			)}
			<datalist id={id} onSelect={(event) => handler(event.currentTarget.nodeValue ?? "")}>
				{options.map(({value, text}) => (
					<option value={value} key={value}>
						{text}
					</option>
				))}
			</datalist>
		</div>
	);
}
