import {ZodSchema, z} from "zod";
import {unix} from "../../../shared/helpers/timestamps.js";
import * as shared from "../../../shared/objects/shared.js";

export const id = z.string().uuid();

export const countryCode = z.string().regex(/^[1-9]\d{0,2}$/);
export const phoneNumber = z.string().regex(/^[1-9]\d{8}$/);

export const timestamp = z
	.string()
	.datetime({precision: process.env.PROD ? 0 : 3}) satisfies ZodSchema<shared.isoStamp>;
export const timeRange = z
	.tuple([timestamp, timestamp])
	.refine(([stamp1, stamp2]) => unix(stamp1) < unix(stamp2)) satisfies ZodSchema<shared.timeRange>;

export const dayAvailability = z.array(timeRange).refine((day) => {
	const firstStamp = day[0][0];
	const lastStamp = day[day.length - 1][1];
	if (
		new Date(firstStamp).getUTCDay() !== new Date(lastStamp).getUTCDay() ||
		unix(lastStamp) - unix(firstStamp) > shared.units.day - shared.units.second
	) {
		return false;
	}

	let latestStamp = 0;
	for (const stamp of day) {
		if (latestStamp > unix(stamp[0])) return false;
		latestStamp = unix(stamp[1]);
	}
	return true;
}) satisfies ZodSchema<shared.dayAvailability>;

export const weekAvailability = z.tuple([
	dayAvailability,
	dayAvailability,
	dayAvailability,
	dayAvailability,
	dayAvailability,
	dayAvailability,
	dayAvailability,
]) satisfies ZodSchema<shared.weekAvailability>;

export const availability = z.array(weekAvailability).min(1) satisfies ZodSchema<shared.availability>;
