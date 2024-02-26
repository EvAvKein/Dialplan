const secsInHour = 3600;

export function secsToReadableDuration(secs: number) {
	const seconds = Math.floor(secs % 60);
	const minutes = Math.floor((secs % secsInHour) / 60);
	const hours = Math.floor(secs / secsInHour);
	const days = Math.floor(secs / (secsInHour * 24));

	return `${days ? `${days}d ` : ""}${hours ? `${hours}h ` : ""}${minutes ? `${minutes}m ` : ""}${
		seconds ? `${seconds}s` : ""
	}`.trimEnd();
}
