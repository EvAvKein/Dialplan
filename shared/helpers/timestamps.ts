export function unix(stamp?: Date | string) {
	return Math.floor((stamp ? new Date(stamp).getTime() : Date.now()) / (process.env.PROD ? 1000 : 1)); // conditional is for automated tests (to verify they get updated)
}

export function iso(stamp?: Date | string) {
	return (stamp ? new Date(stamp) : new Date()).toISOString();
}
