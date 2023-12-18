import {ZodSchema, z} from "zod";
import {unix} from "../../../shared/helpers/timestamps.js";
import {shared} from "../../../shared/objects/validationRegex.js";
import * as obj from "../../../shared/objects/shared.js";

export const id = z.string().trim().uuid();

export const countryCode = z.string().trim().regex(shared.countryCode);
export const phoneNumber = z.string().trim().regex(shared.phoneNumber);

export const timestamp = z
	.string()
	.trim()
	.datetime({precision: process.env.PROD ? 0 : 3}) satisfies ZodSchema<obj.isoStamp>;
export const timeRange = z
	.tuple([timestamp, timestamp])
	.refine(([stamp1, stamp2]) => unix(stamp1) < unix(stamp2)) satisfies ZodSchema<obj.timeRange>;

export const dayAvailability = z.array(timeRange).refine((day) => {
	const firstStamp = day[0][0];
	const lastStamp = day[day.length - 1][1];
	if (
		new Date(firstStamp).getUTCDay() !== new Date(lastStamp).getUTCDay() ||
		unix(lastStamp) - unix(firstStamp) > obj.units.day - obj.units.second
	) {
		return false;
	}

	let latestStamp = 0;
	for (const stamp of day) {
		if (latestStamp > unix(stamp[0])) return false;
		latestStamp = unix(stamp[1]);
	}
	return true;
}) satisfies ZodSchema<obj.dayAvailability>;

export const weekAvailability = z.tuple([
	dayAvailability,
	dayAvailability,
	dayAvailability,
	dayAvailability,
	dayAvailability,
	dayAvailability,
	dayAvailability,
]) satisfies ZodSchema<obj.weekAvailability>;

export const availability = z.array(weekAvailability).min(1) satisfies ZodSchema<obj.availability>;
