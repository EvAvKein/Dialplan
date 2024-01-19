import {type HTMLInputTypeAttribute} from "react";
import styles from "./inputs.module.css";

interface textareaProps {
	handler: (text: string) => void;
	placeholder: string;
	defaultValue?: string;
	id?: string;
	testId?: string;
	pattern?: RegExp;
}
export function Textarea({handler, defaultValue, placeholder, id, testId}: textareaProps) {
	return (
		<textarea
			className={styles.input}
			id={id}
			data-testid={testId}
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
	testId?: string;
	pattern?: RegExp;
	list?: string;
	minLength?: number;
	maxLength?: number;
	required?: boolean;
	autofocus?: boolean;
}

export function Input({
	handler,
	type,
	defaultValue,
	placeholder,
	id,
	testId,
	list,
	pattern,
	minLength,
	maxLength,
	required,
	autofocus,
}: inputProps) {
	return (
		<input
			className={styles.input}
			type={type}
			defaultValue={defaultValue}
			id={id}
			data-testid={testId}
			list={list}
			pattern={pattern?.source}
			minLength={minLength}
			maxLength={maxLength}
			required={required}
			autoFocus={autofocus}
			placeholder={placeholder}
			onInput={(event) => handler(event.currentTarget.value)}
		/>
	);
}

interface labelledInputProps extends Omit<inputProps, "placeholder"> {
	label: string;
	collapsedLabel?: true;
	id: string;
}
export function LabelledInput(props: labelledInputProps) {
	return (
		<div className={styles.labelledInputWrapper}>
			<Input {...props} placeholder={" "} />
			<label
				className={styles.inputLabel + (props.collapsedLabel ? " " + styles.collapsedLabel : "")}
				htmlFor={props.id}
			>
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
