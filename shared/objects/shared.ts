const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;
const week = day * 7;
export const units = {
	second,
	minute,
	hour,
	day,
	week,
};

export type isoStamp = string;

export type timeRange = [isoStamp, isoStamp];

export type dayAvailability = timeRange[];

export type weekAvailability = [
	dayAvailability,
	dayAvailability,
	dayAvailability,
	dayAvailability,
	dayAvailability,
	dayAvailability,
	dayAvailability,
];

export type availability = weekAvailability[];
