export class FetchResponse<T = unknown> {
	data?: T;
	error?: {
		message: string;
	};

	constructor(data?: T, error?: FetchResponse["error"]) {
		data ? (this.data = data) : delete this.data;
		error ? (this.error = error) : delete this.error;
	}
}
