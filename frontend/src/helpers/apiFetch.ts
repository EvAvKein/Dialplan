import {FetchResponse} from "../../../shared/objects/api";

export async function apiFetch<T = unknown>(
	method: "GET" | "POST" | "PATCH" | "DELETE",
	address: string,
	body?: object,
): Promise<FetchResponse<T> & {status: number | null}> {
	return await fetch("/api" + address, {
		headers: new Headers({
			"Content-Type": "application/json",
		}),
		method: method,
		body: body ? JSON.stringify(body) : null,
	})
		.then(async (response) => {
			const jsonBody = await response.text();
			const body = jsonBody ? JSON.parse(jsonBody) : {};
			return {...body, status: response.status};
		})
		.catch(() => {
			return {...new FetchResponse(null, {message: "Failed to contact server"}), status: null};
		});
}
