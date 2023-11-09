import {Outlet} from "react-router-dom";
import "./visitor.layout.css";

export default function layout() {
	return (
		<>
			<header>
				<h1>Dialplan</h1>
			</header>
			<main>
				<Outlet />
			</main>
		</>
	);
}
