import {v4 as uuidV4} from "uuid";

export function newSessionId() {
	return uuidV4(); // TODO: this is allegedly not secure enough, look into alternatives
}
