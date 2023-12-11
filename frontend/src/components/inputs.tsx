import {type HTMLInputTypeAttribute} from "react";
import styles from "./inputs.module.css";

interface textareaProps {
	handler: (text: string) => void;
	placeholder: string;
	defaultValue?: string;
	id?: string;
	pattern?: RegExp;
}
export function Textarea({handler, defaultValue, placeholder, id}: textareaProps) {
	return (
		<textarea
			className={styles.input}
			id={id}
			defaultValue={defaultValue}
			placeholder={placeholder}
			onInput={(event) => handler(event.currentTarget.value)}
		/>
	);
}

interface inputProps {
	handler: (text: string) => void;
	placeholder: string;
	type?: HTMLInputTypeAttribute;
	defaultValue?: string;
	id?: string;
	pattern?: RegExp;
	list?: string;
	minLength?: number;
	maxLength?: number;
	required?: boolean;
}

export function Input({
	handler,
	type,
	defaultValue,
	placeholder,
	id,
	list,
	pattern,
	minLength,
	maxLength,
	required,
}: inputProps) {
	return (
		<input
			className={styles.input}
			type={type}
			defaultValue={defaultValue}
			id={id}
			list={list}
			pattern={pattern?.source}
			minLength={minLength}
			maxLength={maxLength}
			required={required}
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

interface searchableInputProps extends Omit<labelledInputProps, "list"> {
	id: string;
	options: {value: string; text: string}[];
	labelled?: true;
}
export function SearchableInput(props: searchableInputProps) {
	return (
		<div>
			{props.labelled ? (
				<LabelledInput {...props} list={props.id} id={props.id + "InputComponent"} />
			) : (
				<Input {...props} list={props.id} id={props.id + "InputComponent"} placeholder={props.label} />
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
