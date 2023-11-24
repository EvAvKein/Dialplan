export const timezones = Intl.supportedValuesOf("timeZone").map((timeZone) => {
	const offset = new Intl.DateTimeFormat("fr" /* UTC */, {timeZone: timeZone, timeZoneName: "shortOffset"})
		.formatToParts()
		.find((part) => part.type === "timeZoneName")!.value;
	const timeZoneName = new Intl.DateTimeFormat("en", {timeZone: timeZone, timeZoneName: "long"})
		.formatToParts()
		.find((part) => part.type === "timeZoneName")!.value;
	return {value: timeZone, text: `${timeZoneName} (${offset})`};
});
