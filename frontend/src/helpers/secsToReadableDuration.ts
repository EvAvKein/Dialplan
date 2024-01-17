const secsInHour = 3600;

export function secsToReadableDuration(secs: number) {
	const hours = Math.floor(secs / secsInHour);
	const minutes = Math.floor((secs % secsInHour) / 60);
	const seconds = Math.floor(secs % 60);
	return `${hours ? `${hours}h ` : ""}${minutes ? `${minutes}m ` : ""}${seconds ? `${seconds}s` : ""}`;
}
