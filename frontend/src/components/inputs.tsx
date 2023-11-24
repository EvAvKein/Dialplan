import {type HTMLInputTypeAttribute} from "react";
import styles from "./inputs.module.css";

interface textareaProps {
	handler: (text: string) => void;
	placeholder: string;
	id?: string;
	pattern?: RegExp;
}
export function Textarea({handler, placeholder, id}: textareaProps) {
	return (
		<textarea
			className={styles.input}
			id={id}
			placeholder={placeholder}
			onInput={(event) => handler(event.currentTarget.value)}
		/>
	);
}

interface inputProps {
	handler: (text: string) => void;
	placeholder: string;
	type?: HTMLInputTypeAttribute;
	id?: string;
	pattern?: RegExp;
	list?: string;
}

export function Input({handler, placeholder, id, list, pattern}: inputProps) {
	return (
		<input
			className={styles.input}
			id={id}
			list={list}
			pattern={pattern?.source}
			placeholder={placeholder}
			onInput={(event) => handler(event.currentTarget.value)}
		/>
	);
}

interface labelledInputProps extends Omit<inputProps, "placeholder"> {
	label: string;
	id: string;
}
export function LabelledInput(props: labelledInputProps) {
	return (
		<div className={styles.labelledInputWrapper}>
			<Input {...props} placeholder={" "} />
			<label className={styles.inputLabel} htmlFor={props.id}>
				{props.label}
			</label>
		</div>
	);
}

interface searchableInputProps extends labelledInputProps {
	id: string;
	options: {value: string; text: string}[];
	labelled?: true;
}
export function SearchableInput(props: searchableInputProps) {
	return (
		<div>
			{props.labelled ? (
				<LabelledInput {...props} id={"InputComponent"} />
			) : (
				<Input {...props} placeholder={props.label} id={"InputComponent"} />
			)}
			<datalist id={props.id} onSelect={(event) => props.handler(event.currentTarget.nodeValue ?? "")}>
				{props.options.map(({value, text}) => (
					<option value={value} key={value}>
						{text}
					</option>
				))}
			</datalist>
		</div>
	);
}
