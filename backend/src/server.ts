import path from "node:path";
import express from "express";
import helmetSecurity from "helmet";
import cookieParser from "cookie-parser";
import * as timestamps from "../../shared/helpers/timestamps.js";
import {postgres, postgresP} from "./postgres.js";
import {endpoints_orgs} from "./endpoints/orgs.js";

const app = express();
app.use(express.static("../frontend/dist"));
app.use(cookieParser());
app.use(express.json());
app.use(helmetSecurity());

endpoints_orgs(app, postgres, postgresP);

app.get("*", function (request, response) {
	response.sendFile(path.join(process.cwd() + "/../frontend/dist/index.html"));
});

app.listen(3000, () => {
	// nginx recieves this 3000 via a shared network and exposes it to client via 80, am doing this to verify the client isn't connecting directly to node
	console.log(`Server Online at http://localhost:80
  Date: ${timestamps.iso()}`);
});
