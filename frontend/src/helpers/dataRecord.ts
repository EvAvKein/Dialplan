export type nestedRecord<OBJ = object, T = unknown> = {
	[K in keyof OBJ]: {[K2 in keyof OBJ[K]]: T};
};

export type recursiveRecord<OBJ = object, T = unknown> = {
	[K in keyof OBJ]: OBJ[K] extends object ? recursiveRecord<OBJ[K], T> : T;
};
