export function unix(stamp?: Date | string) {
	return Math.floor((stamp ? new Date(stamp).getTime() : Date.now()) / 1000); // conditional is for automated tests (to verify they get updated)
}

export function iso(stamp?: Date | string) {
	const date = stamp ? new Date(stamp) : new Date();
	date.setMilliseconds(0);
	return date.toISOString();
}
