import {Children, cloneElement, type TextareaHTMLAttributes, type InputHTMLAttributes} from "react";
import styles from "./inputs.module.css";

interface textareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	handler: (text: string) => void;
}
export function Textarea(props: textareaProps) {
	return (
		<textarea
			onInput={(event) => props.handler(event.currentTarget.value)}
			{...props} // intentionally after onInput, allows overriding it and getting access to event arg
			className={styles.input + " " + (props.className ?? "")}
		/>
	);
}

interface inputProps extends InputHTMLAttributes<HTMLInputElement> {
	handler: (text: string) => void;
}
export function Input(props: inputProps) {
	const {handler, ...inputProps} = props;
	return (
		<input
			onInput={(event) => props.handler(event.currentTarget.value)}
			{...inputProps} // intentionally after onInput, allows overriding it and getting access to event arg
			className={styles.input + " " + (props.className ?? "")}
		/>
	);
}

interface labelWrapperProps {
	label: string;
	collapsedLabel?: true;
	id: string;
}
export function LabelWrapper<T>(props: T & labelWrapperProps & {children: React.ReactElement}) {
	const child = Children.only(props.children);
	const {children, label, collapsedLabel, ...otherProps} = props;

	return (
		<div className={styles.labelWrapper}>
			{cloneElement(child, {...otherProps})}
			<label className={styles.label + (collapsedLabel ? " " + styles.collapsedLabel : "")} htmlFor={props.id}>
				{label}
			</label>
		</div>
	);
}

type labelledInputProps = labelWrapperProps & Omit<inputProps, "placeholder">;
export function LabelledInput(props: labelledInputProps) {
	const {label, collapsedLabel, ...inputProps} = props;
	return (
		<LabelWrapper {...props}>
			<Input {...inputProps} placeholder={" "} />
		</LabelWrapper>
	);
}

type labelledTextareaProps = labelWrapperProps & Omit<textareaProps, "placeholder">;
export function LabelledTextarea(props: labelledTextareaProps) {
	return (
		<LabelWrapper {...props}>
			<Textarea {...props} placeholder={" "} />
		</LabelWrapper>
	);
}

interface searchableInputProps extends Omit<labelledInputProps, "list"> {
	id: string;
	options: {value: string; text: string}[];
	labelled?: true;
}
export function SearchableInput(props: searchableInputProps) {
	const {labelled, ...inputProps} = props;
	return (
		<div>
			{props.labelled ? (
				<LabelledInput {...inputProps} list={props.id} id={props.id + "InputComponent"} />
			) : (
				<Input {...inputProps} list={props.id} id={props.id + "InputComponent"} placeholder={props.label} />
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
