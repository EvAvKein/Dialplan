import path from "node:path";
import express from "express";
import helmetSecurity from "helmet";
import * as timestamps from "../../shared/helpers/timestamps.js";
import {postgres} from "./postgres.js";

const app = express();
app.use(express.static("../frontend/dist"));
app.use(helmetSecurity());

postgres; // called purely to remove ESlint error, this'll later be replaced with passing this var to endpoints

app.get("*", function (request, response) {
	response.sendFile(path.join(process.cwd() + "/../frontend/dist/index.html"));
});

app.listen(3000, () => {
	// nginx recieves this 3000 via a shared network and exposes it to client via 80, am doing this to verify the client isn't connecting directly to node
	console.log(`Server Online at http://localhost:80
  Date: ${timestamps.iso()}`);
});
