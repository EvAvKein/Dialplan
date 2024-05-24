import {recursiveRecord} from "../../../shared/helpers/dataRecord";

export class InputState {
	attempted: boolean = false;
	constructor(
		public value: string,
		public pattern: RegExp,
		public charLimit: number | null = null,
		public valid: boolean = false,
	) {}

	set(newValue: string) {
		const value = this.trimByLimit(newValue);
		this.value = value;
		this.attempted = true;
		return (this.valid = this.test(value));
	}

	test(newValue: string) {
		return this.pattern.test(newValue) && (this.charLimit === null || newValue.length <= this.charLimit);
	}
	trimByLimit(newValue: string) {
		return this.charLimit === null ? newValue : newValue.slice(0, this.charLimit);
	}
}

export function recursiveInputStateRecordToValues<obj extends recursiveRecord>(
	record: recursiveRecord<obj, InputState>,
): recursiveRecord<obj, string> {
	const valuesObj: recursiveRecord<obj, string> = {} as recursiveRecord<obj, string>;

	for (const key in record) {
		const keyValue = record[key];

		keyValue instanceof InputState
			? ((valuesObj[key] as string) = keyValue.value)
			: ((valuesObj[key] as object) = recursiveInputStateRecordToValues(record[key] as object));
	}

	return valuesObj;
}

export function recursiveInputStateRecordIsValid(record: recursiveRecord<object, InputState>): boolean {
	return Object.values(record).every((value) => {
		if (value instanceof InputState) {
			return value.valid;
		}

		return typeof value === "object" && value !== null ? recursiveInputStateRecordIsValid(value) : true;
	});
}
