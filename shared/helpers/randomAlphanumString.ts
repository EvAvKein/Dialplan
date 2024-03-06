export function randomAlphanumString(length: number) {
	let string = "";

	while (string.length < length) {
		string += Math.random().toString(36)[2];
	}

	return string;
}
