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
		this.valid = this.test(value);
	}

	test(newValue: string) {
		return this.pattern.test(newValue) && (this.charLimit === null || newValue.length <= this.charLimit);
	}
	trimByLimit(newValue: string) {
		return this.charLimit === null ? newValue : newValue.slice(0, this.charLimit);
	}
}
