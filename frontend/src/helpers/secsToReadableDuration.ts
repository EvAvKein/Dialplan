const second = 1;
const minute = 60 * second;
const hour = 60 * minute;
const day = 24 * hour;

export function secsToReadableDuration(secs: number) {
	const seconds = Math.floor(secs % minute);
	const minutes = Math.floor((secs % hour) / minute);
	const hours = Math.floor((secs % day) / hour);
	const days = Math.floor(secs / day);

	return `${days ? `${days}d ` : ""}${hours ? `${hours}h ` : ""}${minutes ? `${minutes}m ` : ""}${
		seconds ? `${seconds}s` : ""
	}`.trimEnd();
}
